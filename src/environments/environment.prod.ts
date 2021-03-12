/**
 * @license
 */


export const environment = {
    //GOOGLE MAP
    googleApiKey: process.env.APP_MAP_API_KEY || '',
    //MARKETPLACE | BTB | STANDARD
    mode: 'STANDARD',
    //API URL
    apiUrl: process.env.APP_BASE_URL || 'http://aws-demo.shopizer.com:8080/api',
    shippingApi: process.env.APP_SHIPPING_URL || 'http://localhost:8080/api',
    client: {
        language: {
            default: 'en',
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
