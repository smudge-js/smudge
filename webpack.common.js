const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const rules = [
  {
    test: /\.js$/,
    enforce: 'pre',
    loader: 'source-map-loader',
  },
  {
    test: /\.ts$/,
    enforce: 'pre',
    use: 'source-map-loader',
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
    use: ['style-loader', 'css-loader'],
  },
  {
    test: /\.(png|jpg)$/,
    loader: 'url-loader',
  },
  {
    test: /\.(html)$/,
    loader: 'html-loader',
  },
];

module.exports = {
  entry: {
    smudge: './src/js/smudge-p5',
  },
  output: {
    filename: 'smudge-p5.js',
    libraryTarget: 'var', // expose as variable
    library: 'smudge_p5', // name the variable 'smudge_p5'
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'], // order to resolve extensions
  },
  module: {
    rules,
  },
  plugins: [/*new CleanWebpackPlugin(),*/ new CopyPlugin([{ from: 'images', to: 'images' }])],
};
