const webpack = require("webpack");

module.exports = {
    webpack: {
        configure: {
            resolve: {
                alias: {
                    process: 'process/browser',
                    stream: "stream-browserify",
                    zlib: "browserify-zlib"
                },
                fallback: {
                    process: require.resolve("process/browser"),
                    zlib: require.resolve("browserify-zlib"),
                    stream: require.resolve("stream-browserify"),
                    util: require.resolve("util"),
                    buffer: require.resolve("buffer"),
                    asset: require.resolve("assert"),
                },
            },
            plugins: [
                new webpack.ProvidePlugin({
                    Buffer: ["buffer", "Buffer"],
                    process: "process/browser",
                })
            ],
        },
    },
};
