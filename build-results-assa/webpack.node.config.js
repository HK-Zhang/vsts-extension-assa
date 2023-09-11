const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Webpack entry points. Mapping from resulting bundle name to the source file entry.
const entries = {};

// Loop through subfolders in the "Samples" folder and add an entry for each one
const buildExtensionsDir = path.join(__dirname, "src/buildExtensions");
fs.readdirSync(buildExtensionsDir).filter((dir) => {
  if (fs.statSync(path.join(buildExtensionsDir, dir)).isDirectory()) {
    entries[dir] =
      "./" +
      path.relative(process.cwd(), path.join(buildExtensionsDir, dir, dir));
  }
});

module.exports = {
  target: 'node',
  entry: entries,
  output: {
    filename: "[name]/[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  stats: {
    warnings: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "azure-devops-ui/buildScripts/css-variables-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.woff$/,
        use: [
          {
            loader: "base64-inline-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        loader: "file-loader",
      }
    ],
  }
};
