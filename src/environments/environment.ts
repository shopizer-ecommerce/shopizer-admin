/**
 * @license
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

//mode MARKETPLACE Category and options are global
//mode STORE Category and options are specific


export const environment = {
    production: false,
    googleApiKey: '',
    mode: 'MARKETPLACE',
    shippingapi: 'http://15.223.64.6:9091/api',
    //apiUrl: 'http://aws-demo.shopizer.com:8080/api',
    //apiUrl: 'http://localhost:8080/api',
    apiUrl: 'http://15.223.64.6:9090/api',
    client: {
        language: {
            default: 'en',
            array: [
                'en',
                'es',
                'fr',
                'ru'
            ],
        },
    }
};
