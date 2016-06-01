module.exports = {
    entry: './src/app.js',
    output: {
        path: './public',
        filename: '/bundle.js'
    },
    devServer: {
        contentBase: 'public',
        inline: true,
        port: 3000
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_modules)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};