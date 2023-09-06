const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Webpack entry points. Mapping from resulting bundle name to the source file entry.
const entries = {};

// Loop through subfolders in the "Samples" folder and add an entry for each one
const extensionsDir = path.join(__dirname, "src/extensions");
fs.readdirSync(extensionsDir).filter((dir) => {
  if (fs.statSync(path.join(extensionsDir, dir)).isDirectory()) {
    entries[dir] =
      "./" + path.relative(process.cwd(), path.join(extensionsDir, dir, dir));
  }
});

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
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "TFS/Dashboards/WidgetHelpers": path.resolve(
        __dirname,
        "node_modules/vss-web-extension-sdk/lib/VSS.SDK.js"
      ),
      "Charts/Services": path.resolve(
        __dirname,
        "node_modules/vss-web-extension-sdk/lib/VSS.SDK.js"
      ),
      "TFS/DistributedTask/TaskRestClient": path.resolve(
        __dirname,
        "node_modules/vss-web-extension-sdk/lib/VSS.SDK.js"
      ),
    },
    // fallback: {
    //   fs: false,
    //   path: false,
    // },
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
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "**/*.html", context: "src/extensions" }],
    }),
  ],
};
