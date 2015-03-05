define(function (require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");
    var Marionette = require("marionette");
    require('views/View');

    // The root path to run the application through.
    exports.root = '/';

    var app = new Backbone.Marionette.Application();

    var Account = require('models/Account');
    var account = new Account();
    app.reqres.setHandler('account', function(){
          return account;
    });
    

    app.addInitializer(function (options) {

        var MainView = require('views/MainView');
        app.mainView = new MainView();        
        app.mainRegion.show(app.mainView);

        Backbone.history.start({ pushState: true, root: "/" });

        
    });

    app.addRegions({
        mainRegion: '#mainWrapper'
    });


    return app;

});
