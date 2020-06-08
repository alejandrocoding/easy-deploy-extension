import { Environment } from '../interfaces/environment.interface';
import { newGUID } from '../helpers/guid.helper';

export const DEFAULT_ENVIROMENT: Environment = {
    id: newGUID(),
    name: 'NEW ENV',
    description: 'This enviroment is accesible only for developers',
    repo: '',
    event: ''
} as const;
