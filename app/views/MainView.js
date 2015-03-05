define(['app', 'backbone', 'marionette', 'mustache', 'jquery', 'text!templates/main.html', 'hammerjs', 'jquery-hammerjs'],
    function(App, Backbone, Marionette, Mustache, $, template, Hammer) {
        return Backbone.Marionette.LayoutView.extend({
            template: function(serialized_model) {
                return Mustache.render(template, serialized_model);
            },
            id: 'main',
            initialize: function() {
                var self = this;
                var globalVent = Backbone.Wreqr.radio.channel('global').vent;

                globalVent.on('back', function(data) {

                });
                globalVent.on('alert', function(message) {
                    //todo alert something
                    console.log(message);
                });
            },
            events: {
                'tap a': 'onTapLink',
                'click a': 'onClickLink'
            },
            ui: {
                'menu': '#menu',
                'content': '#content',
                'topbar': '#topbarWrapper',
                'bottombar': '#bottombarWrapper',
                'appContent': '#appContent',
                'primary': '#primary',
                'secondary': '#secondary',
                'tertiary': '#tertiary'
            },
            regions: {
                menuRegion: '#menu',
                contentRegion: '#content',
                primaryRegion: '#primary',
                secondaryRegion: '#secondary',
                tertiaryRegion: '#tertiary',
                topbarRegion: '#topbarWrapper',
                bottombarRegion: '#bottombarWrapper'
            },
            onShow: function() {
                $('body').hammer({
                    direction: Hammer.DIRECTION_ALL,
                    domEvents: true
                });
                $('body').data('hammer').get('pan').set({
                    direction: Hammer.DIRECTION_ALL
                });

                this.windowHeight = $(window).height();
                this.ui.primary.height(this.windowHeight - this.ui.topbar.height() - this.ui.bottombar.height() );
                this.ui.secondary.height(this.windowHeight);
                this.ui.tertiary.height(this.windowHeight);


            },
            onTapLink: function(event) {
                event.preventDefault();
                event.stopPropagation();

                var $link = $(event.currentTarget);
                var href = $link.attr("href");

                if (href && $link.attr("external")) {
                    //判断是否为外链
                    if (href.indexOf('http') > -1 || href.indexOf('tel') > -1) {
                        var timeout = setTimeout(function() {
                            window.location.href = href;
                            clearTimeout(timeout);
                        }, 0);

                    } else {
                        Backbone.history.navigate(href, {
                            trigger: true
                        });
                    }
                    return;
                } else if (href) {
                    Backbone.history.navigate(href, {
                        trigger: true
                    });
                }

            },
            onClickLink: function(event) {
                //prevent ghost click
                event.preventDefault();
                event.stopPropagation();
            },
            onTapSelect: function(event) {
                event.preventDefault();
                event.stopPropagation();
                var item = $(event.currentTarget).find('.dropdown-menu');
                if (!item.hasClass('open')) {
                    item.addClass('open');
                }
            },
            openMenu: function() {

            },
            closeMenu: function() {
                this.$el.find('#content').removeClass('open');
                this.topbarRegion.currentView.onCloseMenu();
            },
            toggleMenu: function() {
                this.$el.find('#content').toggleClass('open');
            },
            updatePrimaryRegion: function(view) {
                this.secondaryRegion.reset();
                this.primaryRegion.show(view);
            },
            updateSecondaryRegion: function(view) {
                this.secondaryRegion.show(view);
                this.secondaryRegion.$el.addClass('active');
            },
            foldSecondaryRegion: function() {
                this.secondaryRegion.$el.removeClass('active');
                this.secondaryRegion.reset();
            },
            updateTertiaryRegion: function(view) {
                this.tertiaryRegion.show(view);
                this.tertiaryRegion.$el.addClass('active');
            },
            foldTertiaryRegion: function() {
                this.tertiaryRegion.$el.removeClass('active');
                this.tertiaryRegion.reset();
            },
            disableTopBar: function() {
                this.topbarRegion.reset();
                this.ui.topbar.hide();
            },
            enableTopBar: function(view) {
                if ( view ) {
                    this.topbarRegion.show(view);
                }
                this.ui.topbar.show();
            },
            disableBottomBar: function() {
                this.bottombarRegion.reset();
                this.ui.bottombar.hide();
            },
            enableBottomBar: function(view) {
                if ( view ) {
                    this.bottombarRegion.show(view);
                }
                this.ui.bottombar.show();
            },
            navigateBack: function(ev) {
                window.history.back();

            }
        });
    });