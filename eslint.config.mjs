import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

export default [
  // 1. Configuración de archivos y reglas
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: { ...globals.node }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      // Importamos las reglas recomendadas de eslint/js
      ...js.configs.recommended.rules,

      // Tus reglas personalizadas
      'eqeqeq': 'error',
      'no-console': 'off',

      // Reglas de @stylistic (usando el prefijo definido arriba)
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/arrow-spacing': ['error', { 'before': true, 'after': true }],
    }
  },

  // 2. Configuración de archivos ignorados (reemplazo de globalIgnores)
  {
    ignores: ["dist/"]
  }
];