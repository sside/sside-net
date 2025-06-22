module.exports = {
    "*.{ts,tsx,js,jsx,cjs}": ["eslint --fix --ignore-pattern ./*.*"],
    "*.{ts,tsx,js,jsx,mjs,cjs,json,yml,yaml,md}": ["prettier --write"],
    "schema.prisma": ["npx prisma format --schema"],
};
