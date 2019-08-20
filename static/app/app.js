define(['yfjs/spa', 'common/app', 'jquery', 'common/ui/modal', 'common/login', 'bs/tab', 'bs/popover', 'jq/nicescroll'], function (App, AppProps, $, Modal, Login) {
    App.create($.extend({}, {
        baseUrl: {
            resource: "/resources",
            style: "/resources/styles"
        },
        cssPrefix: {
            view: "page_"
        },
        beforeLoad: function () {
            if (Modal.dialogs != null) {
                var dialog;
                for (var id in Modal.dialogs) {
                    dialog = Modal.dialogs[id];
                    if (dialog !== this.loginModal && !dialog.inLayout) {
                        dialog.dispose();
                    }
                }
            }
        },
        Widget: {
            beforeReady: function () {
                this.rootContext.readyContent(this);
            }
        },
        View: {
            layout: "default"
        },
        cookie: {
            getLogin: function () {
                return this.get('user_ml');
            },
            getLoginId: function () {
                var user = this.getLogin();
                return user ? user.id : user;
            },
            getUid: function () {
                var uid = this.get('user_id');
                if (!uid) {
                    var user = this.getLogin();
                    user && (uid = user.id);
                }
                return uid;
            },
            getUname: function () {
                var userName;
                var user = this.getLogin();
                user && (userName = user.name);
                return userName;
            },
            isAdmin: function () {
                var userName;
                var user = this.getLogin();
                return user.isAdmin;
            },
            _parse: function (val) {
                var res;
                try {
                    res = JSON.parse(val);
                } catch (e) {
                    res = val;
                }
                return res;
            }
        },
        ajax: {
            headers: {
                'Accept': "application/json; charset=utf-8",
                'Content-Type': "application/json; charset=utf-8"
            },
            respFilter: function (err, resp, xhr) {
                var undef, res = Array.prototype.slice.call(arguments);
                if (resp && (resp.error || (resp.error_code && resp.error_code !== "undefined"))) {
                    err = err || {};
                    err.message = resp.message || resp.error_desc;
                    res[0] = err;
                    res[1] = undef;
                }
                return res;
            }
        },
        websocket: {
            respFilter: function (err, data, ws) {
                var args = Array.prototype.slice.call(arguments);
                if (data && typeof data.body !== "undefined") {
                    args[1] = data.body;
                }
                return args;
            }
        },
        filter: {
            name: 'login',
            access: function () {
                return this.hasLogin();
            },
            do: function () {
                this.doLogin();
            },
            includes: ['*'],
            excludes: ['/login']
        },
        errorFilter: function () {
            var error404s = this.getError({type: 'script_unfound'});
            var html = '<div class="container">' +
                '<h1>Error</h1>' +
                '{{if isArray(error)}}' +
                '<dl>' +
                '{{each error as err}}' +
                '{{if err}}' +
                '<dt>&diams;&ensp;{{err.type}}</dt>' +
                '<dd>{{err.message}}</dd>' +
                '{{/if}}' +
                '{{/each}}' +
                '</dl>' +
                '{{else if error}}' +
                '<dl>' +
                '<dt>&diams;&ensp;{{error.type}}</dt>' +
                '<dd>{{error.message}}</dd>' +
                '</dl>' +
                '{{/if}}' +
                '</div>';
            if (error404s.length) {
                var curUrl = this.getState('url');
                for (var i = 0; i < error404s.length; i++) {
                    var err404 = error404s[i];
                    if (err404.originalError && err404.originalError.requireModules) {
                        var requireModules = err404.originalError.requireModules;
                        for (var j = 0; j < requireModules.length; j++) {
                            if (requireModules[j].substring(9) == curUrl) {
                                html = '<p style="text-align: center;font-size: 200px;color: #36B3DF;margin-top: 80px;">404</p>' +
                                    '<p style="text-align: center;font-size: 50px;color:#dc5240;">抱歉，您访问的页面不存在！</p>' +
                                    '<div style="text-align: center;"><a class="btn btn-primary" href="' + this.getUrl('/home') + '">' +
                                    '<i class="fa fa-undo"></i> 返回首页</a></div>'
                            }
                        }
                    }
                }
            }
            this.rootContext.set('error', html);
            var errLogin = this.getError(this.rootContext.loginErr);
            if (errLogin.length) {
                this.assignError(errLogin, {level: 'app'});
                this.addError(errLogin);
            }
        },
        onError: function () {
            var loginErrs = this.getError(this.loginErr);
            if (loginErrs && loginErrs.length) {
                this.removeError(loginErrs);
                this.clearLogin();
                this.doLogin();
                return this;
            }
            var otherErrs = this.getError();
            if (otherErrs.length && !this.logging) {
                $.each(otherErrs, function (i, err) {
                    Modal.error(err.message);
                });
            }
        },
        loginErr: {type: 'ajax', status: /(401|506|507|508)/},
        doLogin: function () {
            var curUrl = this.getState('url'),
                curPath = this.getState('path');

            if (this.logging) return this;

            this.logging = true;

            var params, isLoginPage = false, isLoginModal = false;

            if (curUrl) {
                isLoginPage = /^\/login/.test(curUrl);
                if (isLoginPage) {
                    params = this.getParams();
                    isLoginModal = !!params.modal;
                } else {
                    params = {callback: curUrl};
                }
            }

            if (this.getView() && (!isLoginPage || isLoginModal)) {
                if (!isLoginModal) {
                    Login.init(this);
                }
            } else {
                this.go(this.getUrl('/login', params));
            }


            return this;
        },
        hasLogin: function () {
            var token_id;
            token_id = this.cookie.get('ml_token_id') || undefined;
            return typeof token_id !== "undefined";
        },
        setLogin: function (user) {
            this.cookie.set('user_ml', user);
            return this;
        },
        clearLogin: function () {
            this.cookie.remove('login_model_ml');
            this.cookie.remove('ml_token_id');
            this.cookie.remove('role_insight_ml ');
            this.cookie.remove('session');
            this.cookie.remove('user_id');
            this.cookie.remove('user_ml');
            return this;
        },
        logging: false,
        loginModal: null,
        template: {
            rendered: function (err, html) {
                if (typeof html !== "undefined") {
                    html = this.rootContext.permission.compile(html);
                }
                return [err, html];
            },
            helpers: {
                'getLoginName': function () {
                    return this.rootContext.cookie.getUname();
                },
                'isAdmin': function () {
                    return this.rootContext.cookie.isAdmin();
                },
                'statusLabel': function (status, ext) {
                    return this.rootContext.statusLabel.apply(this.rootContext, arguments);
                },
                'statusLabelTitle': function (status, ext) {
                    return this.rootContext.statusLabelTitle.apply(this.rootContext, arguments);
                },
                'shortContent': function (content, len, ext) {
                    return this.rootContext.shortContent.apply(this.rootContext, arguments);
                },
                'formatBytes': function (bytes) {
                    return this.rootContext.formatBytes.apply(this.rootContext, arguments);
                },
                'formatBytesStrict': function (bytes) {
                    return this.rootContext.formatBytesStrict.apply(this.rootContext, arguments);
                },
                'pwdHtml': function (text, withoutControl) {
                    return this.rootContext.pwdHtml(text, withoutControl);
                },
                'pwdText': function (text) {
                    return this.rootContext.pwdText(text);
                },
                'uiSelect': function (data) {
                    var inHtml = this.rootContext.uiSelect(data);
                    return inHtml;
                },
                'uiSelectList': function (data) {
                    if (!$.isPlainObject(data)) {
                        data = $.extend({}, {list: data}, {wrapper: false});
                    } else {
                        data = $.extend({}, data, {wrapper: false});
                    }
                    var inHtml = this.rootContext.uiSelect(data);
                    return inHtml;
                },
                'markdown': function (preset, options, content) {
                    var inHtml = Remarkable.render(preset, options, content);
                    return typeof inHtml === 'string' ? inHtml : '';
                }
            }
        },
        ready: function () {
            var self = this;
            // 统一处理面包屑导航上的回退事件
            this.loginCache();
            // tab show
            $.fn.tabShow = function (index, callback) {
                if (typeof index === "function") {
                    callback = index;
                    index = null;
                }
                index = $.trim(index);
                var tabIndex = null;
                if (index.length) {
                    tabIndex = parseInt(index);
                    if (isNaN(tabIndex)) {
                        if (!/^#/.test(index)) {
                            tabIndex = '#' + index;
                        } else {
                            tabIndex = index;
                        }
                    }
                }
                this.each(function () {
                    var $tab = $(this),
                        $container = $tab.parents('[id^="app-view"][data-view]'),
                        $tabNav = $tab.find('.nav-tabs,.nav-pills'),
                        $tabContent = $('.tab-content', $tab);

                    if (tabIndex != null) {
                        $tabNav.data('__bs_tab_cache__', tabIndex);
                    }

                    if (typeof callback === "function") {
                        $tab.data('callback', callback);
                    } else {
                        callback = $tab.data('callback');
                    }

                    var tabSelector = 'a[data-toggle="tab"],a[data-toggle="pill"]',
                        $tabs = $(tabSelector, $tabNav);

                    if ($container.length) {
                        $tabs.off('shown.ui.tab').on('shown.ui.tab', tabShown);
                    } else {
                        $tabs.off('shown.bs.tab').on('shown.bs.tab', tabShown);
                    }

                    var hrefCur, $curTab;

                    if (tabIndex != null) {
                        hrefCur = tabIndex;
                    }

                    if (typeof hrefCur === "number") {
                        $curTab = $tabs.eq(hrefCur);
                    } else if (hrefCur != null) {
                        $curTab = $tabs.filter('[href$="' + hrefCur + '"]');
                    }

                    if (!$curTab || !$curTab.length) {
                        $curTab = $tabNav.children('.active').children(tabSelector);
                        if ($curTab.length) {
                            $curTab.parent().removeClass("active");
                        }
                    } else {
                        if ($curTab.length) {
                            $curTab.parent().removeClass("active");
                        }
                    }

                    if (!$curTab || !$curTab.length) {
                        $curTab = $tabs.eq(0);
                    }

                    $curTab.tab('show');

                    function tabShown(e) {
                        var relativeId = $(this).attr('href'),
                            $tabPane = $(relativeId, $tabContent);
                        if ($tabPane.length && typeof callback === "function") {
                            try {
                                var args = [relativeId.replace(/^#+/, ''), $tabPane, $tab];
                                if (typeof e.targetKey !== "undefined") {
                                    args.push(e.targetKey);
                                }
                                callback.apply(this, args);
                            } catch (e) {
                                self.trigger('CallbackError',
                                    self.makeError('callback', ['calledTabCallback', e.message], e)
                                );
                            }
                        }
                    }
                });
                return this;
            };
            // bind pwd mask
            this.bind('click', '.pwd-masked-static + .btn-pwd-masked', this.passToggle);
            return this;
        },
        readyContent: function (widget) {
            var self = this;

            if (!self.prevState() || window.history.length <= 1) {
                widget.$('.btn-back').each(function () {
                    var $this = $(this);
                    if (!$this.attr('href')) {
                        $this.attr('disabled', true);
                    }
                });
                widget.$('.breadcrumb').find('a').each(function () {
                    var $this = $(this);
                    if (!$this.attr('href')) {
                        $this.attr('disabled', true);
                    }
                });
            }

            // bind tab shown, fix to bootstrap tab
            var tabSelector = 'a[data-toggle="tab"],a[data-toggle="pill"]',
                tabNavSelector = '.nav-tabs,.nav-pills';

            var $tabNavs = widget.$(tabNavSelector),
                tabCacheKey = '__bs_tab_cache__',
                tabFixedKey = '__bs_tab_fixed__';

            // ready tab
            if ($tabNavs.length) {
                $tabNavs.each(function () {
                    var $nav = $(this);

                    if ($nav.data(tabFixedKey)) {
                        return false;
                    }

                    var navIndex = $nav.index($tabNavs),
                        $tabs = $(tabSelector, $nav);

                    var hrefCache = $nav.data(tabCacheKey);

                    if (hrefCache == null) {
                        var tabCache = widget.getCache('tab') || {};
                        hrefCache = tabCache[navIndex];
                    }

                    var $curTab;

                    if (hrefCache != null) {
                        if (typeof hrefCache === "number") {
                            $curTab = $tabs.eq(hrefCache);
                        } else if (hrefCache != null) {
                            $curTab = $tabs.filter('[href$="' + hrefCache + '"]');
                        }
                        if ($curTab && $curTab.length) {
                            $nav.children(".active").removeClass("active");
                            $nav.siblings(".tab-content").children(".active").removeClass("active");
                        }
                    }

                    if (!$curTab || !$curTab.length) {
                        $curTab = $nav.children('.active').children(tabSelector);
                    }

                    //
                    if (!$curTab || !$curTab.length) {
                        $curTab = $tabs.eq(0);
                    }

                    if ($curTab && $curTab.length) {
                        $curTab.parent().addClass("active");
                        $nav.siblings(".tab-content").children($curTab.attr('href')).addClass("active");
                    }

                    $nav.data(tabFixedKey, true);
                });
            }

            widget.bind("shown.bs.tab", $(tabSelector, $tabNavs), function (e) {
                var widget = this;
                var $tab = $(e.currentTarget),
                    href = $tab.attr('href'),
                    tabCache = widget.getCache('tab') || {};
                var $tabNav, navIndex;
                if ($tab.is('a[data-toggle="pill"]')) {
                    $tabNav = $tab.parents('.nav-pills:first');
                } else {
                    $tabNav = $tab.parents('.nav-tabs:first');
                }
                navIndex = $tabNav.index($tabNavs);
                if (navIndex >= 0) {
                    tabCache[navIndex] = href;
                    widget.setCache('tab', tabCache);
                }
                $tab.trigger($.Event('shown.ui.tab', {
                    context: widget,
                    targetKey: navIndex,
                    relatedTarget: e.relatedTarget,
                    target: e.target
                }));
                return false;
            });

            widget.bind("click", $(tabSelector, $tabNavs), function (e) {
                self.isBack = false;
            });

            // 返回按钮
            widget.bind('click', '.btn-back', function (e) {
                e.preventDefault();
                self.isBack = true;
                self.goback(e, this);
                return false;
            });

            // 面包屑导航链接
            widget.bind('click', '.breadcrumb>li>a', function (e) {
                e.preventDefault();
                self.isBack = true;
                self.gobreadcrumb(e, this);
                return false;
            });

            widget.$('input').each(function () {
                var $this = $(this);
                $this.attr('autocomplete', "off");
                var placeholder = $this.attr('placeholder');
                if (/^\/login\/?/.test(self.getState('url'))) {
                    return true;
                } else {
                    $this.on('focus', function () {
                        $this.attr('placeholder', '');
                    }).on('blur', function () {
                        $this.attr('placeholder', placeholder);
                    });
                }
            });

            // 分类过滤事件
            widget.bind("click", ".category-filter-item", function (e) {
                var $this = $(e.currentTarget);
                if ($this.hasClass("active")) return false;
                $this.siblings().removeClass("active").end().addClass("active");
                $this.parents(".category-filter-box").trigger($.Event("changed", {relatedTarget: $this[0]}));
            });
        },
        destroyed: function () {
            var mainScrollbar = $('#page-main').getNiceScroll();
            if (mainScrollbar && mainScrollbar.length) {
                mainScrollbar.remove();
            }
        },
        goback: function (e, widget) {
            var $this = $(e.currentTarget),
                href = $this.attr('href') || '';
            var posHash = href.lastIndexOf("#"), path;
            if (~posHash) {
                path = href.substring(posHash + 1);
            }
            if (path) {
                this.go(path);
            } else {
                this.go(-1);
            }
            return this;
        },
        gobreadcrumb: function (e, widget) {
            widget = widget || this;
            var $this = $(e.currentTarget),
                href = $this.attr('href') || '';
            var posHash = href.lastIndexOf("#"), path;
            if (~posHash) {
                path = href.substring(posHash + 1);
            } else {
                var $breadcrumb = $this.parents(".breadcrumb:first"),
                    $list = $breadcrumb.children("li:not(.active):has(a)"),
                    len = $list.length,
                    index = $list.index($this.parents("li:first"));
                path = index - len;
            }
            if (typeof path == "number") {
                this.go(path);
            } else {
                this.go(widget.getUrl(path));
            }
            return this;
        },
        passToggle: function (e) {
            var $this = $(e.currentTarget),
                $static = $this.siblings(".pwd-masked-static:first");
            var isOpen = $this.hasClass("open"),
                orgPwd = this.Base64.decode($static.data('original-pwd'));
            if (isOpen) {
                // 加密显示密码
                orgPwd = orgPwd || $.trim($static.text());
                $static.html(this.pwdHtml(orgPwd, true));
            } else if (orgPwd) {
                // 明文显示密码
                $static.text(orgPwd);
            }
            $this.toggleClass("open");
            return false;
        }
    }, AppProps));
});
