import { defineNetworkFixture, NetworkFixture } from "@msw/playwright";
import { test } from "@playwright/test";
import { AnyHandler } from "msw";

const clientTest = test.extend<{
    handlers: Array<AnyHandler>;
    network: NetworkFixture;
}>({
    handlers: [[], { auto: true }],
    network: [
        async ({ context, handlers }, use) => {
            const network = defineNetworkFixture({
                context,
                handlers,
            });

            await network.enable();
            await use(network);
            await network.disable();
        },
        { auto: true },
    ],
});

export { clientTest as test };
