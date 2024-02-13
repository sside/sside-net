module.exports = {
    "*.{ts,js}": ["eslint --fix"],
    "*.{ts,tsx,js,jsx,mjs,cjs,json,yml,yaml,md}": ["prettier --write"],
    "schema.prisma": ["yarn prisma format --schema"],
};
