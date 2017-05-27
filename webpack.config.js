module.exports = {
 entry: './index.ts',
 output: {
   filename: 'bundle.js',
   path: __dirname
 },
 module: {

   rules: [
       {
         test: /\.ts$/,
         loader: 'ts-loader',
         exclude: /node_modules/,
     },
     {
       enforce: 'pre',
       test: /\.js$/,
       loader: "source-map-loader"
     },
     {
       enforce: 'pre',
       test: /\.tsx?$/,
       use: "source-map-loader"
     }
   ]
 },
 resolve: {
   extensions: [".tsx", ".ts", ".js"]
 },
 devtool: 'inline-source-map',
};
