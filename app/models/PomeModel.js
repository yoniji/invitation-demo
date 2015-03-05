define(["jquery", "backbone", "ServiceUrls"],
    function($, Backbone, ServiceUrls) {
        var wrapError = function(e, message) {
            var err = new Error(message);
            err.origError = e;
            return err;
        };
        // Creates a new Backbone Model class object
        return Backbone.Model.extend({
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
            fetchWithAccessToken: function() {
                var self = this;
                self.fetch({
                    'data': {
                        'access_token': self.getAccessToken()
                    },
                    'processData': true
                });
            },
            triggerSyncAndChangeEvent: function() {
                this.trigger('sync');
                this.trigger('change');
            },
            fetch: function(options) {

                var originOptions = options;
                options = options ? _.clone(options) : {};
                var beforeSend = options.beforeSend;
                if (options.parse === void 0) options.parse = true;
                var model = this;
                var self = this;
                var success = options.success;
                options.success = function(resp) {
                    if (!model.set(model.parse(resp, options), options)) return false;
                    if (success) success(model, resp, options);
                    model.trigger('sync', model, resp, options);
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
                wrapError(this, options);
                
                //add accesstoken
                if (!options.data) {
                    options.data = {};
                    options.processData = true;
                }
                options.data.access_token = this.getAccessToken();
               
                return this.sync('create', this, options);
                
                
            },
            onFetchError: function(error, originOptions) {
                var self = this;
                if (error.status && error.status == 401) {
                    var account = this.getAccount();
                    this.listenToOnce(account, 'refreshSuccess', function() {
                        //更新access_token
                        if (originOptions && originOptions.data && originOptions.data.access_token) {
                            originOptions.data.access_token = self.getAccessToken();
                        }
                        self.fetch(originOptions);
                    });

                    account.refreshAccessToken();
                } else {
                    Backbone.history.navigate('/', {
                        trigger: true
                    });
                }
            }
        });
    }
);