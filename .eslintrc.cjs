/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
	root: true,
	extends: ['@mheob/eslint-config'],
	rules: {
		'no-console': ['error', { allow: ['warn', 'error'] }],
	},
};
