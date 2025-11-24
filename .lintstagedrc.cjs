module.exports = {
    "./(app|config|library|resource)/**/*.{ts,tsx,js,jsx,cjs}": (
        stagedFiles,
    ) => [
        `eslint --fix --flag v10_config_lookup_from_file ${stagedFiles.join(" ")}`,
        "npm run test",
    ],
    "*.{ts,tsx,js,jsx,mjs,cjs,json,yml,yaml,md}": ["prettier --write"],
    "schema.prisma": ["npx prisma format --schema"],
};
