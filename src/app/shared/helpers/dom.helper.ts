import { Settings } from '../interfaces/settings.interface';

import { URLHelper } from './url.helper';
import { GitHubHelper } from './github.helper';
import { sleep, getSettingsStorage } from './async.helper';

export class DomHelper {

    private settings: Settings;

    private deployBtn: HTMLElement;

    async initDeployButton() {
        if (!URLHelper.isDeployableURL() || !this.getContainer()) {
            return false;
        }

        try {
            this.settings = await getSettingsStorage();
            if (this.settings && this.isMatchingOwnerAndRepo()) {

                const container = this.getContainer();
                const deployBtn = this.createDeployButton();

                container.parentNode.insertBefore(deployBtn, container.nextSibling);
            }
        } catch { }
    }

    private getContainer() {
        return document.querySelector('#branch-select-menu') as HTMLElement;
    }

    private getSHARef() {
        if (URLHelper.isDeployableURL() && this.getContainer()) {
            const anchor: HTMLAnchorElement = document.querySelector('.commit-tease-sha');
            return anchor.href.split('/commit/')[1];
        }
    }

    private isMatchingOwnerAndRepo() {
        return this.settings.environments.some(env =>
            env.repoOwner === URLHelper.getOwner() && env.repoName === URLHelper.getRepositoryName()
        );
    }

    private closeDropDown() {
        if (this.deployBtn) {
            this.deployBtn.removeAttribute('open');
        }
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
        const buttons = this.createSelectMenuPopupListButtons();

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

    private createSelectMenuPopupListButtons() {
        const itemList = document.createElement('div');
        itemList.classList.add('select-menu-list');

        for (const env of this.settings.environments) {
            const btn = this.createEnvironmentBtn(env.name, env.description);
            btn.setAttribute('id', env.id);
            itemList.appendChild(btn);
        }
        return itemList;
    }

    private createEnvironmentBtn(envName: string, envDescription?: string) {
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

        button.addEventListener('click', () => this.onEnvironmentButtonClick(button));
        return button;
    }

    private async onEnvironmentButtonClick(button: HTMLButtonElement) {
        this.closeDropDown();

        const environment = this.settings.environments.find((env) => env.id === button.id);
        const sha = this.getSHARef();

        const gitHubHelper = new GitHubHelper(this.settings.token, environment.repoOwner, environment.repoName);
        await gitHubHelper.actionDispatch(sha, environment.event);

        await sleep(1000); // Needed as the action doesn't render on the github action page right away
        const urlRedirection = `https://github.com/${environment.repoOwner}/${environment.repoName}/actions`;
        chrome.runtime.sendMessage({ redirect_actions: urlRedirection });
    }
}
