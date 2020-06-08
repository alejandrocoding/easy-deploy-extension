export class GitHubHelper {

    private readonly ACCESS_TOKEN: string;
    private readonly REPO_OWNER: string;

    constructor(token: string, repoOwner: string) {
        this.ACCESS_TOKEN = token;
        this.REPO_OWNER = repoOwner;
    }

    async actionDispatch(sha: string, eventType: string) {
        return await fetch(`https://api.github.com/repos/${this.REPO_OWNER}/dispatches`, {
            method: 'POST', headers: new Headers({ Authorization: `token ${this.ACCESS_TOKEN}` }),
            body: JSON.stringify({ event_type: eventType, client_payload: { sha, event_type: eventType } })
        });
    }
}
