export interface Settings {
    selected: number;
    environments: Environment[];
    token: string;
}

export interface Environment {
    id: string;
    name: string;
    description: string;
    repo: string;
    event: string;
}
