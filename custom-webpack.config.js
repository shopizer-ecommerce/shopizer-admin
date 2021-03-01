const webpack = require('webpack');

//Matches structure of 
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      $ENV: {
        googleApiKey: JSON.stringify(process.env.googleApiKey),
        mode: JSON.stringify(process.env.mode),
        apiUrl: JSON.stringify(process.env.apiUrl),
        client: JSON.stringify(process.env.client)
      }
    })
  ]
};