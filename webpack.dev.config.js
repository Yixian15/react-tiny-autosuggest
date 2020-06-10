const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/App.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: [
      '.js', '.jsx', '.ts', '.tsx'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.cm\.styl$/,
        loader: 'style-loader!css-loader?modules&camelCase&localIdentName=[local]-[hash:base64:5]!stylus-loader'
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new htmlWebpackPlugin({
      template: 'public/index.html'
    })
  ],
};
