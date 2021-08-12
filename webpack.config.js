const { resolve: pathResolve } = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
	mode: 'development',
	entry: './frontend/main.js',
	output: {
		path: pathResolve(__dirname, 'frontend/dist'),
		filename: 'main.bundle.js',
	},
	module: {
		rules: [
			{test: /\.vue$/, use: "vue-loader"}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
};