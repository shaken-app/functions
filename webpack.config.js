const path = require("path");

module.exports = {
  entry: "./s3-upload/s3-upload.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "s3-upload.js",
    path: path.resolve(__dirname, "./functions-out")
  }
};
