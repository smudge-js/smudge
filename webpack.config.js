module.exports = {
	entry: './index.ts',
	output: {
		filename: 'bundle.js',
		path: __dirname,
	},
    resolve: {
        extensions: [".ts", ".js",]
    },
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			}, {
				enforce: 'pre',
				test: /\.js$/,
				loader: "source-map-loader",
			}, {
				enforce: 'pre',
				test: /\.ts$/,
				use: "source-map-loader",
			},
		]
	},
	devtool: 'inline-source-map'
};
