import * as Process from 'process';

export namespace Npm {

    export class Config {

        private static namespace = 'npm_package_config';

        public static get(path: string, env?: NodeJS.ProcessEnv): any {
            if (!env) env = Process.env;

            path = this.namespace.concat('_' + path.replace('.', '_'));
            let descriptor = Object.getOwnPropertyDescriptor(env, path);

            if (descriptor) return descriptor.get();
            else return null;
        }
    }

}