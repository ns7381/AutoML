define(['crypto', 'common/ui/pwdmasked'], function(CryptoJS) {
    return {
        readyBody: function(view, App) {
            var $loginForm = view.$loginForm;
            var dialog = view.dialog;

            this.$loginForm = $loginForm;
            this.dialog = dialog;
            this.view = view;
            this.App = App;

            var self = this;

            setTimeout(function() {
                $('.form-control', $loginForm).removeClass('noanimate');
            }, 300);

            var $username = $('[name="username"]', $loginForm),
                $password = $('[name="password"]', $loginForm),
                $btnSubmit = $('#login-btn', $loginForm);

            var rememberUsername = this.getCookie(self.rememberKey.username),
                rememberPassword = this.getCookie(self.rememberKey.password),
                rememberPwdDecrypted = this.decryptPwd(rememberPassword);
            this.rememberUsername = rememberUsername;
            this.rememberPwdDecrypted = rememberPwdDecrypted;

            rememberUsername && $username.val(rememberUsername);
            rememberPassword && $password.val(rememberPwdDecrypted);

            $password.pwdMasked();

            $username.focus();

            this.$username = $username;
            this.$password = $password;
            this.$btnSubmit = $btnSubmit;

            this.btnSubmitText = $btnSubmit.html();

            $username.on('keydown', function(e) {
                if (e && e.keyCode == 13) { // enter 键
                    setTimeout(function() {
                        if (dialog) {
                            self.submitForm(App, function(err) {
                                if (!err) {
                                    dialog.setData('logged', true);
                                    dialog.close();
                                }
                                dialog.setData('logging', false);
                                dialog.enableButtons(true);
                                dialog.getButton('btn-signin').stopSpin();
                            });
                        } else {
                            self.submitForm(App);
                        }
                    },100);
                }
            });

            $password.on('keydown', function(e) {
                if (e && e.keyCode == 13) { // enter 键
                    if (dialog) {
                        self.submitForm(App, function(err) {
                            if (!err) {
                                dialog.setData('logged', true);
                                dialog.close();
                            }
                            dialog.setData('logging', false);
                            dialog.enableButtons(true);
                            dialog.getButton('btn-signin').stopSpin();
                        });
                    } else {
                        self.submitForm(App);
                    }
                }
            });

            $username.on('change', function(e) {
                var $this = $(e.target);
                if ($this.val() !== self.rememberUsername) {
                    self.$password.val("");
                } else {
                    self.$password.val(self.rememberPwdDecrypted);
                }
            });

            $username.on('focusin', function() {
                self.$username.popover('destroy');
                self.$password.popover('destroy');
            });

            $password.on('focusin', function() {
                self.$username.popover('destroy');
                self.$password.popover('destroy');
            });

            if ($btnSubmit.length) {
                $btnSubmit.on('click', function() {
                    self.submitForm(App);
                });
            }
        },
        App: {},
        view: {},
        dialog: '',
        rememberKey: {
            username: "remember_username_insight_ml",
            password: "remember_password_insight_ml",
            role	: "role_insight_ml"
        },
        $loginForm: $([]),
        $username: $([]),
        $password: $([]),
        $btnSubmit: $([]),
        btnSubmitText: "",
        rememberUsername: "",
        rememberPwdDecrypted: "",
        submitForm: function(App, callback) {
            var self = this;
            var dialog = this.dialog;
            if (!this.$username.val()) {
                this.showErrorInfo("请输入登录账号！");
                $.isFunction(callback) && callback.call(this, true);
                return false;
            }

            if (!this.$password.val()) {
                this.showErrorInfo("请输入登录密码！", this.$password);
                $.isFunction(callback) && callback.call(this, true);
                return false;
            }

            if (this.$btnSubmit.length) {
                this.$btnSubmit.text("正在登录...").prop('disabled', true);
            }

            var postData = {
                'name':  this.$username.val(),
                'password': this.$password.val()
            };

            App.ajax.postJSON({
                url: App.getRootUrl("/api/v1/auth"),
                data: postData,
                timeout: 5000,
                dataType: 'json'
            }, function(err, resp, xhr) {
                if (err) {
                	self.showErrorInfo("用户名或密码错误");
                    if (self.$btnSubmit.length) {
                        self.$btnSubmit.prop('disabled', false).html(self.btnSubmitText);
                    }
                    App.removeError(err);
                } else {
                    if(resp.login == 0){
                    	self.showErrorInfo("用户名或密码错误");
                        if (self.$btnSubmit.length) {
                            self.$btnSubmit.prop('disabled', false).html(self.btnSubmitText);
                        }
                    } else {
                        var uid = resp.id,
                            uname = resp.name,
                            urole = resp.roles,
                            encryptedPwd = self.encryptPwd(self.$password.val());
                        self.setCookie(self.rememberKey.username, uname);
                        self.setCookie(self.rememberKey.password, encryptedPwd);
                        self.setCookie(self.rememberKey.role, urole);
                        self.setCookie('ml_token_id', resp.ml_token_id);
                        self.setCookie('user_id', uid);
                        self.setCookie('user_name', uname);
                        var is_admin = $.inArray('admin', resp.roles) >= 0;
                        self.setCookie('is_admin', is_admin);
                        App.setLogin({id: uid, name: uname, isAdmin: is_admin});
                        App.loginCache();
                        if (!dialog) {
                            self.loginGo(App);
                        }
                    }
                }
                App.logging = false;
                $.isFunction(callback) && callback.apply(self, arguments);
            });
        },
        loginGo: function(App) {
            var params = App.getParams();
            var callbackUrl = params.callback;
            if (callbackUrl == '/login') {
                callbackUrl = '/home';
            } else {
                delete params.callback;
                $.each(params, function(key, val) {
                    callbackUrl += '&' + key + '=' + val;
                });
            }
            App.go(App.getUrl(callbackUrl || "/"));
        },
        showErrorInfo: function(res, $tar) {
            var msg = "";
            if (typeof res === "string") {
                msg = res;
            } else {
                switch (res.inner_code) {
                    case 'username_is_null':
                        msg = "请输入登录账号！";
                        break;
                    case 'password_is_null':
                        msg = "请输入登录密码！";
                        break;
                    case 'invalid_username':
                    case 'password_is_incorrect':
                        msg = "用户名或密码错误！";
                        break;
                    case 'account_is_locked':
                        msg = "账号已锁定！";
                        break;
                    case 'account_is_disabled':
                        msg = "账号已禁用！";
                        break;
                    case 'no_admin':
                        msg = "非管理员用户，请以租户身份登录！";
                        break;
                    case 'no_vdc':
                        msg = "登录失败，未查询到当前用户关联的租户信息！";
                        break;
                    default:
                        msg = "系统错误！";
                }
            }
            msg = msg || "系统错误！";
            this.errorTip($tar || this.$username, msg);
        },
        errorTip: function($tar, msg) {
            if($tar instanceof $) {
                $tar.popover({
                    container: this.$loginForm,
                    className: "popover-danger",
                    placement: "left top",
                    content: '<i class="glyphicon glyphicon-exclamation-sign"></i> '+(msg||''),
                    trigger: 'manual',
                    html: true
                }).popover("show");
            }
        },
        setCookie: function(key, value, options) {
            return this.App.cookie.set(key, value, $.extend({expires: 1}, options));
        },
        getCookie: function(key) {
            return this.App.cookie.get(key);
        },
        removeCookie: function(key) {
            return this.App.cookie.remove(key);
        },
        keyt: "insight_ml",
        encryptPwd: function(pwd) {
            return pwd ? CryptoJS.AES.encrypt(pwd, this.keyt).toString() : "";
        },
        decryptPwd: function(encryptedPwd) {
            var pwd;
            try {
                if (encryptedPwd) {
                    pwd = CryptoJS.AES.decrypt(encryptedPwd, this.keyt).toString(CryptoJS.enc.Utf8);
                } else {
                    pwd = '';
                }
            } catch(e) {
                pwd = '';
                this.removeCookie("remember_password_insight_ml");
            }
            return pwd
        }
    };
});
