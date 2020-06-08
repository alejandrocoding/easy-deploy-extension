import { Environment } from './environment.interface';

export interface Settings {
    selected: number;
    environments: Environment[];
    token: string;
}
