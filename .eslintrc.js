module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'functions/tsconfig.json'
  },
  rules: {
    curly: ['error', 'multi-or-nest']
  }
}
