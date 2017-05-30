module.exports = {
	entry: './src/app.ts',

	output: {
		filename: 'bundle.js',
		path: __dirname
	},

	resolve: {
		extensions: [".ts", ".js",]
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			}, {
				enforce: 'pre',
				test: /\.js$/,
				loader: "source-map-loader"
			}, {
				enforce: 'pre',
				test: /\.ts$/,
				use: "source-map-loader"
			}, {
				test: /\.(glsl|frag|vert)$/,
				loader: 'raw-loader',
				exclude: /node_modules/,
			}, {
				test: /\.(glsl|frag|vert)$/,
				loader: 'glslify-loader',
				exclude: /node_modules/,
			},
		]
	},

	devtool: 'inline-source-map',
};
