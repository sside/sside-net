export abstract class Seedable {
    abstract seed(...args: unknown[]): Promise<unknown> | unknown;
}
