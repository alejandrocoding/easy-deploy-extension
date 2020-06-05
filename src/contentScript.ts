interface Settings {
    selected: number;
    environments: Environment[];
    token: string;
}

interface Environment {
    id: string;
    name: string;
    description: string;
    repo: string;
    event: string;
}

const sleep = (ms: number) => new Promise((cb: () => void) => setTimeout(cb, ms));


class DeployBtnDomHelper {

    private deployBtn: HTMLElement;
    private settings: Settings;

    constructor() { }

    addDeployBtn() {

        if (!this.isContainerPresent()) {
            return false;
        }

        try {
            chrome.storage.sync.get(['settings'], (data: { settings }) => {
                if (data?.settings?.environments?.length) {
                    this.settings = data.settings;
                    if (!this.isCurrentRepoOwner(this.settings)) {
                        return false;
                    }
                    const container = this.getContainer();
                    const deployBtn = this.createDeployButton();

                    container.parentNode.insertBefore(deployBtn, container.nextSibling);
                }
            });
        } catch { }
    }

    isContainerPresent() {
        return Boolean(this.getContainer());
    }

    isCurrentRepoOwner(settings: Settings) {
        return settings.environments.some(env => env.repo.length && location.pathname.includes(env.repo));
    }

    private closeDropDown() {
        if (this.deployBtn) {
            this.deployBtn.removeAttribute('open');
        }
    }

    private getContainer() {
        return document.querySelector('#branch-select-menu') as HTMLElement;
    }

    private createDeployButton() {
        const deployBtn = document.createElement('details');
        deployBtn.classList.add('deploy-btn', 'details-reset', 'details-overlay', 'select-menu', 'float-left');
        this.deployBtn = deployBtn;

        const dropDownBtn = this.createDropDownBtn();
        const selectMenuBox = this.createSelectMenuPopupBoxComponent();

        deployBtn.appendChild(dropDownBtn);
        deployBtn.appendChild(selectMenuBox);

        return deployBtn;
    }

    private createDropDownBtn() {
        const dropDownBtn = document.createElement('summary');
        dropDownBtn.classList.add('select-menu-button', 'btn', 'btn-sm', 'btn-primary', 'ml-2');
        dropDownBtn.innerHTML = '<span> Deploy </span>';
        return dropDownBtn;
    }

    private createSelectMenuPopupBoxComponent() {
        const selectMenu = document.createElement('details-menu');
        selectMenu.classList.add('select-menu-modal', 'position-absolute');
        selectMenu.style.zIndex = '99';

        const title = this.createSelectMenuPopupTitle();
        const buttons = this.createSelectMenuPopupListBtns();

        selectMenu.appendChild(title);
        selectMenu.appendChild(buttons);

        return selectMenu;
    }

    private createSelectMenuPopupTitle() {
        const titleBox = document.createElement('div');
        titleBox.classList.add('select-menu-header');

        const title = document.createElement('span');
        title.classList.add('select-menu-title');
        title.innerText = 'Environments';

        titleBox.appendChild(title);
        return titleBox;
    }

    private createSelectMenuPopupListBtns() {
        const itemList = document.createElement('div');
        itemList.classList.add('select-menu-list');

        for (const env of this.settings.environments) {
            const btn = this.createEnvBtn(env.name, env.description);
            btn.setAttribute('id', env.id);
            itemList.appendChild(btn);
        }
        return itemList;
    }

    private createEnvBtn(envName: string, envDescription?: string) {
        const button = document.createElement('button');
        button.classList.add('select-menu-item', 'width-full');

        const innerBox = document.createElement('div');
        innerBox.classList.add('select-menu-item-text');

        const title = document.createElement('span');
        title.classList.add('select-menu-item-heading');
        title.innerText = envName;

        const description = document.createElement('span');
        description.classList.add('description');
        description.innerText = envDescription;


        innerBox.appendChild(title);
        if (envDescription) {
            innerBox.appendChild(description);
        }

        button.appendChild(innerBox);

        button.addEventListener('click', async () => {
            this.closeDropDown();

            const environment = this.settings.environments.find(env => env.id === button.id);
            const sha = (document.querySelector('.commit-tease-sha') as HTMLAnchorElement).href.split('/commit/')[1];

            const repoHelper = new RepoHelper(this.settings.token, environment.repo);
            await repoHelper.actionDispatch(sha, environment.event);

            await sleep(1000); // Needed as the action doesn't render on the github action page right away
            chrome.runtime.sendMessage({ redirect_actions: `https://github.com/${environment.repo}/actions` });
        });
        return button;
    }
}

class RepoHelper {

    private readonly ACCESS_TOKEN: string;
    private readonly REPO_OWNER: string;

    constructor(token: string, repo: string) {
        this.ACCESS_TOKEN = token;
        this.REPO_OWNER = repo;
    }

    async actionDispatch(sha: string, eventType: string) {
        return await fetch(`https://api.github.com/repos/${this.REPO_OWNER}/dispatches`, {
            method: 'POST', headers: new Headers({ Authorization: `token ${this.ACCESS_TOKEN}` }),
            body: JSON.stringify({ event_type: eventType, client_payload: { ref: sha } })
        });
    }
}

// Main
(async () => {

    const deployHelper = new DeployBtnDomHelper();
    deployHelper.addDeployBtn();

})();
