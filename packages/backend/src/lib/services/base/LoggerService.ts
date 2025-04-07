import { createLogger } from 'pinolog';
import { inject } from '../../core/di';
import { BootstrapService } from './BootstrapService';
import TYPES from '../../core/types';
import { singleshot } from 'functools-kit';
import { CC_APP_NAME } from '../../../config/params';

export class LoggerService {

    private readonly bootstrapService = inject<BootstrapService>(TYPES.bootstrapService);

    private getLogger = singleshot(() => {
        const { bootstrap, port } = this.bootstrapService.getArgs();
        return createLogger(`${CC_APP_NAME}-${bootstrap ? `bootstrap` : `port-${port}`}.log`);
    });

    public log = (...args: any[]) => {
        this.getLogger().log(...args);
    }

    public debug = (...args: any[]) => {
        this.getLogger().info(...args);
    }

}

export default LoggerService
