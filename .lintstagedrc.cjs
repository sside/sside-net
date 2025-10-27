module.exports = {
    "./(app|config|library|resource)/**/*.{ts,tsx,js,jsx,cjs}": [
        "eslint --fix --ignore-pattern ./*.* --ignore-pattern library/api-client/**/*.*",
    ],
    "*.{ts,tsx,js,jsx,mjs,cjs,json,yml,yaml,md}": ["prettier --write"],
    "schema.prisma": ["npx prisma format --schema"],
};
