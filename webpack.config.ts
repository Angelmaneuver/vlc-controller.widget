import path           from 'path';
import CopyFilePlugin from 'copy-webpack-plugin';

module.exports = {
	target: 'web',
    entry: {
        libraries: './src/index.ts'
    },
    output: {
        path:          path.join(__dirname, 'vlc-controller.widget', 'lib'),
        filename:      '[name].bundle.js',
        library:       '[name]',
        libraryTarget: 'umd'
    },
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [{
			test:    /\.ts$/,
			use: [{
				loader: 'ts-loader',
			}]
		}]
	},
	plugins: [
		new CopyFilePlugin({
			patterns: [{
				from:    '**/**.min.css',
				context: path.resolve(
					__dirname,
					'node_modules',
					'icono',
					'dist',
				),
			}]
		}),
	]
};
