import TYPES from "./core/types";
import "./core/provide";
import { inject, init } from "./core/di";
import type LoggerService from "./services/base/LoggerService";
import ErrorService from "./services/base/ErrorService";
import type BootstrapService from "./services/base/BootstrapService";

const baseServices = {
    bootstrapService: inject<BootstrapService>(TYPES.bootstrapService),
    loggerService: inject<LoggerService>(TYPES.loggerService),
    errorService: inject<ErrorService>(TYPES.errorService),
};

init();

export const ioc = {
    ...baseServices,
};
