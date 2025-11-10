module.exports = {
    "./(app|config|library|resource)/**/*.{ts,tsx,js,jsx,cjs}": [
        "eslint --fix --flag v10_config_lookup_from_file",
    ],
    "*.{ts,tsx,js,jsx,mjs,cjs,json,yml,yaml,md}": ["prettier --write"],
    "schema.prisma": ["npx prisma format --schema"],
};
