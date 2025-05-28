// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const { rules } = require("eslint-plugin-react-hooks");

module.exports = defineConfig([
	expoConfig,
	{
		ignores: ["dist/*"],
		rules: {
			"react-hooks/exhaustive-deps": "warn",
		},
	},
]);
