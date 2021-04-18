/**
 * @license
 */
export const environment = {
    production: true,
    //GOOGLE MAP
    googleApiKey: window["env"]["APP_MAP_API_KEY"] || '',
    //MARKETPLACE | BTB | STANDARD
    mode: 'STANDARD',
    //API URL
    apiUrl: window["env"]["APP_BASE_URL"] || 'http://localhost:8080/api',
    shippingApi: window["env"]["APP_SHIPPING_URL"] || 'http://localhost:9090/api',
    client: {
        language: {
            default: window["env"]["APP_DEFAULT_LANGUAGE"] || 'en',
            array: [
                'en',
                'es',
                'fr',
                'ru',
                'ar'
            ],
        },
    }
};
