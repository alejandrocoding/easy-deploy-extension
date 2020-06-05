import { Environment } from './interfaces';
import { newGUID } from './helper';

export const DEFAULT_ENVIROMENT: Environment = {
    id: newGUID(),
    name: 'NEW ENV',
    description: 'This enviroment is accesible only for developers',
    repo: '',
    event: ''
} as const;
