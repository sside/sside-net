export const createErrorMessage = (
    message: string,
    contextValues: Record<string, unknown>,
): string =>
    message +
    " " +
    Object.entries(contextValues)
        .map(([key, value]) => `[${key}]: ${value}`)
        .join(", ");
