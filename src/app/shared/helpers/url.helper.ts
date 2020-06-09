export class URLHelper {
    static getOwner() {
        return document.location.pathname.split('/').filter((e) => e)[0];
    }

    static getRepositoryName() {
        return document.location.pathname.split('/').filter((e) => e)[1];
    }

    static isDeployableURL() {
        return location.pathname
            .split(`/${this.getOwner()}/${this.getRepositoryName()}/tree/`)
            .filter((e) => e).length === 1;
    }
}
