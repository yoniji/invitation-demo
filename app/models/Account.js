define(["jquery", "models/PomeModel"],
    function($, PomeModel) {
        return PomeModel.extend({
            initialize: function(options) {
                var self = this;
                this.getApp().reqres.setHandler("accessToken", function() {
                    return self.get('access_token');
                });
                this.getApp().reqres.setHandler("refreshToken", function() {
                    return self.get('refresh_token');
                });

                if (this.supportLocalStorage()) {
                    if (localStorage.access_token) {
                        this.set('access_token', localStorage.access_token);
                    }
                }
            },
            authorize: function(options) {
                var self = this;

                $.ajax({
                    url: self.getServiceUrl('authorize'),
                    data: options,
                    type: 'POST',
                    success: function(data) {
                        self.set(data.response);
                        self.set( {
                            'username': options.username,
                            'password': options.password
                        });

                        if (self.supportLocalStorage()) {
                            localStorage.access_token = data.response.access_token;
                            localStorage.username = options.username;
                            localStorage.password = options.password;
                        }

                        self.trigger('authorize');
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        //todo:login fail
                    }

                });
            },
            isAuthorized: function() {
                return this.has("access_token");
            },
            refreshAccessToken: function() {
                //todo: refresh access_token
            },
            supportLocalStorage: function() {
                if (typeof(Storage) !== "undefined") {
                    return true;
                } else {
                    return false;
                }
            }
        });
    }
);