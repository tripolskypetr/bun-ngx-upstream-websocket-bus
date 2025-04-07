import { provide } from '../core/di';

import TYPES from './types';

import LoggerService from '../services/base/LoggerService';
import ErrorService from '../services/base/ErrorService';
import BootstrapService from '../services/base/BootstrapService';

{
    provide(TYPES.loggerService, () => new LoggerService());
    provide(TYPES.errorService, () => new ErrorService());
    provide(TYPES.bootstrapService, () => new BootstrapService());
}
