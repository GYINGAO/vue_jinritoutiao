'use strict';
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        components: '@/components',
        api: '@/api',
        utils: '@/utils',
        store: '@/store',
        router: '@/router',
        views: '@/views',
        assets: '@/assets'
      }
    }
  }
};
