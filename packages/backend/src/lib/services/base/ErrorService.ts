import { errorData, Subject, type TSubject } from 'functools-kit';
import fs from "fs";

const ERROR_HANDLER_INSTALLED = Symbol.for('error-handler-installed');
const ERROR_EXECUTE_BEFORE_EXIT = Symbol.for('error-execute-before-exit');

export class ErrorService {

    get beforeExitSubject(): TSubject<void> {
        const global = <any>globalThis;
        if (!global[ERROR_EXECUTE_BEFORE_EXIT]) {
            global[ERROR_EXECUTE_BEFORE_EXIT] = new Subject<void>();
        }
        return global[ERROR_EXECUTE_BEFORE_EXIT];
    }

    public handleGlobalError = async (error: Error) => {
        fs.appendFileSync('./error.txt', JSON.stringify(errorData(error), null, 2));
        await this.beforeExitSubject.next();
        process.kill(process.pid, 'SIGTERM');
    };

    private _listenForError = () => {
        console.log("Global exceptions listened in lib");
        process.on('uncaughtException', (err) => {
            console.log(err);
            this.handleGlobalError(err);
        });
        process.on('unhandledRejection', (error) => {
            throw error;
        });
    };

    protected init = () => {
        const global = <any>globalThis;
        if (global[ERROR_HANDLER_INSTALLED]) {
            return;
        }
        this._listenForError();
        global[ERROR_HANDLER_INSTALLED] = 1;
    }

}

export default ErrorService;
