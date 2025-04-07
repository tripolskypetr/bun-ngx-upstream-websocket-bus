const baseServices = {
    loggerService: Symbol('loggerService'),
    errorService: Symbol('errorService'),
    bootstrapService: Symbol('bootstrapService'),
};

export const TYPES = {
    ...baseServices,
};

export default TYPES;
