import { Environment } from '../interfaces/environment.interface';
import { newGUID } from '../helpers/guid.helper';

export const DEFAULT_ENVIRONMENT: Environment = {
    id: newGUID(),
    name: 'NEW ENV',
    description: 'This environment is accessible only for developers',
    event: '',
    repoOwner: '',
    repoName: '',
} as const;
