const { resolve: pathResolve } = require('path');

module.exports = {
	mode: 'development',
	entry: './frontend/src/js/index.js',
	output: {
		path: pathResolve(__dirname, 'frontend/dist'),
		filename: 'index.bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.styl$/, 
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" },
					{ loader: "stylus-loader" }
				]
			}
		]
	},
};