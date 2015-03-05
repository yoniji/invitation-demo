define(['app', 'backbone', 'marionette', 'mustache', 'jquery', 'text!templates/welcome.html', 'iscroll'],
    function(App, Backbone, Marionette, Mustache, $, template) {

        return Backbone.Marionette.ItemView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            ui: {

            },
            events: {

            },
            initialize: function() {
                this.mainView = App.mainView;
                this.mainView.disableTopBar();
                this.mainView.disableBottomBar();
                this.mainView.updatePrimaryRegion(this);

            },
            onShow: function() {
                console.log( this.$el[0]);
                this.iscroll = new IScroll(this.$el[0]);

            },
            onDestroy: function() {
                if (this.mainView) {
                    this.mainView.enableTopBar();
                    this.mainView.enableBottomBar();
                }
                this.stopListening();
            },
            id: 'welcomeWrapper'
        });
    });