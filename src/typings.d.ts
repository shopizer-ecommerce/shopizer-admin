/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var tinymce: any;
declare var echarts: any;

declare var $ENV: Env;
interface Env {
  googleApiKey: string;
  mode: string;
  apiUrl: string;
  client: any;
}
