define(['app', 'backbone', 'marionette','views/WelcomeView'],
    function (App, Backbone, Marionette, WelcomeView) {
        return Backbone.Marionette.Controller.extend({
            initialize: function (options) {

            },
            welcome: function() {
                var welcome = new WelcomeView();
            }
        });
    });