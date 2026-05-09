module.exports = {
    "./(app|config|library|resource)/**/*.{ts,tsx,js,jsx,cjs}": (
        stagedFiles,
    ) => [`eslint --fix ${stagedFiles.join(" ")}`],
    // フロントエンドのテストはバックエンド不要になるまで一旦見送り
    // "./app/frontend/**/*.{ts,tsx,js,jsx,cjs}": [
    //     "npx --no-install turbo run test --filter=@sside-net/frontend",
    // ],
    "./app/backend/**/*.{ts,tsx,js,jsx,cjs}": [
        "npx --no-install turbo run test --filter=@sside-net/backend",
    ],
    "./(config|library|resource)/**/*.{ts,tsx,js,jsx,cjs}": [
        "npx --no-install turbo run test --filter=!./app/*",
    ],
    "*.{ts,tsx,js,jsx,mjs,cjs,json,yml,yaml,md}": ["prettier --write"],
    "schema.prisma": ["npx --no-install prisma format --schema"],
};
