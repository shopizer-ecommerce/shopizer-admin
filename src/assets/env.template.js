(function(window) {
    window["env"] = window["env"] || {};
  
    // Environment variables
    window["env"]["APP_BASE_URL"] = "${APP_BASE_URL}";
    window["env"]["APP_SHIPPING_URL"] = "${APP_SHIPPING_URL}";
    window["env"]["APP_MAP_API_KEY"] = "${APP_MAP_API_KEY}";
    window["env"]["APP_DEFAULT_LANGUAGE"] = "${APP_DEFAULT_LANGUAGE}";
  })(this);