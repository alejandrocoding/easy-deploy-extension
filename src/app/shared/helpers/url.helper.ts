export class URLHelper {
    static getOwner() {
        return document.location.pathname.split('/').filter((e) => e)[0];
    }

    static getRepositoryName() {
        return document.location.pathname.split('/').filter((e) => e)[1];
    }

    static isDeployableURL() {
        const urlTreeSplit = location.pathname.split(`/tree/`);
        const isTreeCommitURL =
            urlTreeSplit[0] === `/${this.getOwner()}/${this.getRepositoryName()}` &&
            urlTreeSplit[1].indexOf('/') === -1;
        const isHomePageURL = location.pathname === `/${this.getOwner()}/${this.getRepositoryName()}/`;

        return isTreeCommitURL || isHomePageURL;
    }
}
