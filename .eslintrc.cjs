/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
	root: true,
	extends: ['@mheob/eslint-config'],
	rules: {
		'no-console': ['warn', { allow: ['warn', 'error'] }],
	},
};
