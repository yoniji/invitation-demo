define(['backbone', 'marionette'],
    function(Backbone, Marionette) {

        function formatDate(date, fmt) { //author: meizz 
                var o = {
                    "M+": date.getMonth() + 1, //月份 
                    "d+": date.getDate(), //日 
                    "h+": date.getHours(), //小时 
                    "m+": date.getMinutes(), //分 
                    "s+": date.getSeconds(), //秒 
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
                    "S": date.getMilliseconds() //毫秒 
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
        }

        //项目通用的helper
        var pomeTemplateHelpers = {
            full_width: function() {
                var ratio = window.devicePixelRatio;
                var window_width = $(window).width();
                var width = 320;
                if (window_width > width) {
                    width = 480;
                }
                if (!ratio || ratio > 2) {
                    ratio = 3;
                }
                width = width * ratio;
                return '@' + width + 'w';

            },
            half_width: function() {
                var ratio = window.devicePixelRatio;
                var window_width = $(window).width();
                var width = 150;
                if (window_width > 320) {
                    width = 230;
                }
                if (!ratio || ratio > 2) {
                    ratio = 3;
                }
                width = width * ratio;
                return '@' + width + 'w';

            },
            half_width_height: function() {
                var ratio = window.devicePixelRatio;
                var window_width = $(window).width();
                var width = 150;
                if (window_width > 320) {
                    width = 230;
                }
                if (ratio) {
                    width = width * ratio;
                    return '@' + width + 'w_' + width + 'h_1e_1c';
                }

            },
            avatar_size: function() {
                var ratio = window.devicePixelRatio;
                var width = 55,
                    height = 55;
                if (ratio && ratio < 3) {
                    width = width * ratio;
                    height = width;
                    return '@' + width + 'w_' + height + 'h_1e_1c';
                } else {
                    return '';
                }

            },
            icon_size: function() {
                var ratio = window.devicePixelRatio;
                var width = 55,
                    height = 55;
                if (ratio && ratio < 3) {
                    width = width * ratio;
                    height = width;
                    return '@' + width + 'w_' + height + 'h';
                } else {
                    return '';
                }

            },
            list_thumb_size: function() {
                var ratio = window.devicePixelRatio;
                var width = 72,
                    height = 72;
                if (ratio) {
                    width = width * ratio;
                    height = width;

                }

                return '@' + width + 'w_' + height + 'h_1e_1c';
            },
            getTimeString: function(date_utc) {
                var timeStr = "";
                var now = (new Date()).getTime();
                var duration = Math.floor(now / 1000 - date_utc);

                if (duration < 3600) {
                    timeStr = "<span class='color-recent-minutes'>1小时内</span>";
                } else if (duration < 3600 * 24) {
                    timeStr = "<span class='color-recent-hours'>" + Math.floor(duration / 3600) + "小时内</span>";
                } else if (duration < 3600 * 24 * 7) {
                    timeStr = "<span class='color-recent-days'>" + Math.floor(duration / 3600 / 24) + "天内</span>";
                } else {
                    var due_date = new Date();
                    due_date.setTime(date_utc * 1000);
                    timeStr = formatDate(due_date, 'yyyy-MM-dd');
                }
                return timeStr;
            },
            getFullTimeString: function(date_utc) {
                var timeStr = "";
                var now = (new Date()).getTime();
                var duration = Math.floor(now / 1000 - date_utc);

                if (duration < 3600) {
                    timeStr = "<span class='color-recent-minutes'>1小时内</span>";
                } else if (duration < 3600 * 24) {
                    timeStr = "<span class='color-recent-hours'>" + Math.floor(duration / 3600) + "小时内</span>";
                } else if (duration < 3600 * 24 * 7) {
                    timeStr = "<span class='color-recent-days'>" + Math.floor(duration / 3600 / 24) + "天内</span>";
                } else {
                    var due_date = new Date();
                    due_date.setTime(date_utc * 1000);
                    timeStr = formatDate(due_date, 'yyyy-MM-dd hh:mm:ss');
                }
                return timeStr;
            }
        };

        var View = Marionette.View;

        Marionette.View.prototype.mixinTemplateHelpers = function(target) {
            target = target || {};
            //加入自定义helpers
            target = _.extend(target, pomeTemplateHelpers);
            var templateHelpers = this.getOption('templateHelpers');
            if (_.isFunction(templateHelpers)) {
                templateHelpers = templateHelpers.call(this);
            }
            return _.extend(target, templateHelpers);
        };

    });