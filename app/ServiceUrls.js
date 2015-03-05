define(['jquery', 'backbone'],
    function($, Backbone) {
        var testBaseUrl = 'http://10.0.0.9:9999/';
        var releaseBaseUrl = 'https://shiliujishi.com/';

        var testServiceUrls = {
            'account' : testBaseUrl + 'admin/member/members.js'
        };

        var serviceUrls = {
            'account' : testBaseUrl + 'admin/member/members.js'
        };
        var ServiceUrls = {
            getServiceUrlByName: function(serviceName) {
                return serviceUrls[ serviceName ];
            }
        };

        return ServiceUrls;
    }
);