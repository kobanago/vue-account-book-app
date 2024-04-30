module.exports = {
  '*': ['prettier --write --ignore-unknown'],
  '*.{js,ts,vue}': [
    'eslint "./src/**/*.{ts, tsx, js, jsx}" --fix',
    'prettier --write "./src/**/*.{ts, tsx, js, jsx}"',
  ],
};
