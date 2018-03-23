const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const rules = [{
		test: /\.js$/,
		enforce: 'pre',
		loader: "source-map-loader"
	},
	{
		test: /\.ts$/,
		enforce: 'pre',
		use: "source-map-loader"
	},
	{
		test: /\.ts$/,
		loader: 'ts-loader',
		exclude: /node_modules/,
	},
	{
		test: /\.(glsl|frag|vert)$/,
		loader: 'raw-loader',
		exclude: /node_modules/,
	},
	{
		test: /\.(glsl|frag|vert)$/,
		loader: 'glslify-loader',
		exclude: /node_modules/,
	},
	{
		test: /\.css$/,
		use: ['style-loader', 'css-loader']
	},
	{
		test: /\.(png|jpg)$/,
		loader: 'url-loader'
	},
	{
		test: /\.(html)$/,
		loader: 'html-loader',
	}
];


module.exports = [{
		entry: './sketches/index.ts',
		output: {
			filename: 'sketch.js',
			path: path.resolve(__dirname, 'dist')
		},
		externals: {
			THREE: 'THREE',
			lodash: '_',
			// 	"../src/js/index": "smudge",
		},
		resolve: {
			extensions: [".ts", ".js", ]
		},
		module: {
			rules
		},
		devtool: 'inline-source-map',
		mode: 'development',

	},
	{
		entry: {
			smudge: './src/js/index',
			// sketch: './sketches/basic',
		},

		output: {
			library: 'smudge',
			libraryTarget: 'var',
			filename: 'smudge.js',
			path: path.resolve(__dirname, 'dist')
		},

		resolve: {
			extensions: [".ts", ".js", ]
		},

		externals: {
			THREE: 'THREE',
			lodash: '_',
			// lodash: {
			// 	commonjs: 'lodash',
			// 	commonjs2: 'lodash',
			// 	amd: 'lodash',
			// 	root: '_'
			// }
		},

		module: {
			rules
		},

		devtool: 'inline-source-map',

		plugins: [
			new CleanWebpackPlugin(['dist']),
			// new BundleAnalyzerPlugin(),
		],


		mode: "development",

	}
];