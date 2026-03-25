module.exports = {
    "./(app|config|library|resource)/**/*.{ts,tsx,js,jsx,cjs}": (
        stagedFiles,
    ) => [`eslint --fix ${stagedFiles.join(" ")}`, "npm run test"],
    "*.{ts,tsx,js,jsx,mjs,cjs,json,yml,yaml,md}": ["prettier --write"],
    "schema.prisma": ["npx --no-install prisma format --schema"],
};
