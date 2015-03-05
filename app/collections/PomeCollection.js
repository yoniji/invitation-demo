define(["jquery", "backbone","ServiceUrls"],
    function ($, Backbone, ServiceUrls) {
        var wrapError = function(e, message) {
            var err = new Error(message);
            err.origError = e;
            return err;
        };
        return Backbone.Collection.extend({
        	getApp: function() {
                return Backbone.Wreqr.radio.channel('global');
            },
            getServiceUrl: function(urlName) {
                return ServiceUrls.getServiceUrlByName(urlName);
            },
            getConfig: function() {
                return this.getApp().reqres.request('configModel');
            },
            getAccessToken: function() {
                return this.getApp().reqres.request('accessToken');
            },
            getWechatAccessToken: function() {
                return this.getApp().reqres.request('wechatAccessToken');
            },
            getWechatCode: function() {
                return this.getApp().reqres.request('wechatCode');
            },
            getWechatState: function() {
                return this.getApp().reqres.request('wechatState');
            },
            getStoreAlias: function() {
                return this.getApp().reqres.request('storeAlias');
            },
            getAccount: function() {
                return this.getApp().reqres.request('account');
            },
            getAccessTokenString: function() {
                return 'access_token=' + this.getAccessToken();
            },
            // Fetch the default set of models for this collection, resetting the
            // collection when they arrive. If `reset: true` is passed, the response
            // data will be passed through the `reset` method instead of `set`.
            fetch: function(options) {
                var originOptions = options;
                options = options ? _.clone(options) : {};
                var beforeSend = options.beforeSend;
                if (options.parse === void 0) options.parse = true;
                var success = options.success;
                var collection = this;
                var self = this;
                options.success = function(resp) {
                    var method = options.reset ? 'reset' : 'set';
                    collection[method](resp, options);
                    if (success) success(collection, resp, options);
                    collection.trigger('sync', collection, resp, options);
                };
                options.beforeSend = function(xhr) {
                    xhr.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
                    if (beforeSend) {
                        beforeSend.apply(this, arguments);
                    }
                };
                options.error = function(error, errorType, errorText) {
                    self.onFetchError(error, originOptions);
                };

                //add accesstoken
                if ( !options.data ) {
                    options.data = {};
                    options.processData = true;
                }
                options.data.access_token = this.getAccessToken();
                
                wrapError(this, options);
                return this.sync('create', this, options);
            },
            fetchWithAccessToken: function() {
                var self = this;
                self.fetch({
                    'data': {
                        'access_token': self.getAccessToken()
                    },
                    'processData': true
                });
            },
            onFetchError: function(error, originOptions) {
                var self = this;
                if (error.status && error.status == 401) {
                    var account = this.getAccount();
                    this.listenToOnce(account, 'refreshSuccess', function() {
                        if (originOptions && originOptions.data && originOptions.data.access_token) {
                            originOptions.data.access_token = self.getAccessToken();
                        }
                        self.fetch(originOptions);
                    });

                    account.refreshAccessToken();
                } else {
                    Backbone.history.navigate('error', {
                        trigger: true
                    });
                }
            }
        });
    }
);