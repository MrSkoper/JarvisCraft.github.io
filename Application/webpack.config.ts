import * as Process from "process";
import * as Path from 'path';

import * as Webpack from 'webpack';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

import {Npm} from './npm.utils';

namespace Utils {
    export type ConfigurationMode = 'development' | 'production' | string;

    export class Mode {

        private select: number;

        private readonly modes: ConfigurationMode[] = [
            'development',
            'production'
        ];

        constructor(mode: ConfigurationMode) {
            this.set(mode);
        }

        public set(mode: ConfigurationMode) {
            let index;

            if ((index = this.modes.indexOf(mode)) < 0)
                throw new Error(`Mode ${mode} don't support.`);

            this.select = index;
        }

        public get(): any {
            if (this.select < 0 || this.select > (this.modes.length - 1))
                return null;

            return this.modes[this.select];
        }

        public get isDevelopment () {
            return this.get() === this.modes[0];
        }

        public get isProduct () {
            return this.get() === this.modes[1];
        }

    }
}

const mode = new Utils.Mode(
    Npm.Config.get('mode')
    ?? Process.env.NODE_ENV
    ?? ((Npm.Config.get('dev') && !Npm.Config.get('production')) ? 'development' : 'production')
);



const config: Webpack.Configuration = {

    mode: mode.get(),

    entry: {
        application: './scripts/index.tsx'
    },

    context: Path.resolve(__dirname, 'src'),

    output: {

        filename: mode.isProduct ? '[name].js' : '[name].hash@[hash].js',
        path: Path.resolve(__dirname, 'out'),

    },

    module: {
        rules: [
            {
                test: /\.(tsx?|jsx?)$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react',
                            '@babel/preset-typescript',
                            '@babel/preset-flow',
                        ]
                    }
                }
            },
            {
                test: /\.(s[ac]ss|css)$/,
                loaders: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(woff2?|[to]tf|svg|eot)$/,
                loader: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        publicPath: '/assets/',
                        context: Path.join(__dirname, 'src', 'assets')
                    }
                }
            }
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
           filename: '[path][name].css'
        }),
    ],

    devServer: {
        contentBase: Path.resolve(__dirname, 'public'),
        publicPath: '/',

        host: '127.0.0.1',
        port: 8080,

        overlay: true,
        liveReload: true,

        watchContentBase: true,

    }

};
export default config;

