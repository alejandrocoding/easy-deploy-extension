export class GitHubHelper {

    private readonly ACCESS_TOKEN: string;
    private readonly REPO_OWNER: string;
    private readonly REPO_NAME: string;

    constructor(token: string, repoOwner: string, repoName: string) {
        this.ACCESS_TOKEN = token;
        this.REPO_OWNER = repoOwner;
        this.REPO_NAME = repoName;
    }

    async actionDispatch(sha: string, eventType: string) {
        return await fetch(`https://api.github.com/repos/${this.REPO_OWNER}/${this.REPO_NAME}/dispatches`, {
            method: 'POST', headers: new Headers({ Authorization: `token ${this.ACCESS_TOKEN}` }),
            body: JSON.stringify({ event_type: eventType, client_payload: { sha, event_type: eventType } })
        });
    }
}
