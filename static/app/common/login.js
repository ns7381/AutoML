define(['common/ui/modal', 'common/pubLogin', 'common/ui/pwdmasked'], function(Modal, pubLogin) {
    return {
        $loginForm: $([]),
        init: function(App, pubLayout) {
            var self = this;
            if (App.loginModal) return this;
            App.loginModal = Modal.show({
                cssClass: 'modal-login',
                title: '请登录',
                message: self.modalHtml(App),
                onshown: function(dialog) {
                    self.$loginForm = $("form", dialog.getModalBody());
                    self.dialog = dialog;
                    pubLogin.readyBody(self, App);
                },
                buttons: [
                    {
                        icon: 'fa fa-sign-in',
                        label: '登&ensp;录',
                        id: "btn-signin",
                        cssClass: 'btn-primary',
                        autospin: true,
                        hotkey: 13,
                        action: function(dialog) {
                            if (dialog.getData('logging')) return false;
                            dialog.setData('logging', true);
                            dialog.enableButtons(false);
                            pubLogin.submitForm(App, function(err, resp) {
                                if (!err) {
                                    dialog.setData('logged', true);
                                    dialog.close();
                                }
                                var uid = resp.id,
                                    uname = resp.name,
                                    urole = resp.role;
                                App.setCookie('login_model_ml', resp.login_model);
                                App.setCookie('ml_token_id', resp.ml_token_id);
                                App.setCookie('user_id', uid);
                                App.setLogin({id: uid, name: uname, isAdmin:urole==1});
                                App.setLogin({id: uid, name: uname, isAdmin:urole==1});
                                App.loginCache();
                                dialog.setData('logging', false);
                                dialog.enableButtons(true);
                                dialog.getButton('btn-signin').stopSpin();
                            });
                        }
                    },
                    {
                        label: '取消',
                        cssClass: 'btn-default',
                        action: function(dialog){
                            dialog.close();
                        }
                    }
                ],
                onhidden: function(dialog) {
                    if (pubLayout) {
                        pubLayout.setCss();
                    }
                    App.loginModal = null;
                    dialog.setData('logging', false);
                    var state = App.getState();
                    if (!dialog.getData('logged')) {
                        App.go(App.getUrl('/login', {callback: state.url}));
                    } else {
                        App.go(true, App.getUrl(state.url));
                    }
                    App.logging = false;
                }
            });
        },
        modalHtml: function(App) {
            return (
                '<div class="signin-header">' +
                '<div class="signin-title">' +
                '<img style="margin-top: -8px;" class="signin-logo" alt="Insight ML" src="' + App.getResourceUrl('images/logo.png') +'"/>' +
                '<span style="margin-left: 10px;font-size: 22px;font-weight: bold;">Insight ML</span>' +
                '</div>' +
                '</div>' +
                '<form class="form-horizontal form-signin" onsubmit="return false;" role="form" autocomplete="off">' +
                '<input class="form-control" type="text" style="visibility:hidden;width:1px;margin-top:-35px"/>' +
                '<input class="form-control" type="password" style="visibility:hidden;width:1px;margin-top:-35px"/>' +
                '<div class="input-group">' +
                '<span class="signin-icons signin-icon-input signin-icon-user">' +
                '<i class="signin-icons signin-icon-br"></i>' +
                '</span>' +
                '<input class="form-control" id="username" name="username" type="text" placeholder="用户名"/>' +
                '</div>' +
                '<div class="input-group form-control-pwd">' +
                '<span class="signin-icons signin-icon-input signin-icon-pwd">' +
                '<i class="signin-icons signin-icon-br"></i>' +
                '</span>' +
                '<input class="form-control" id="password" name="password" type="password" placeholder="密码"/>' +
                '</div>' +
                '</form>'
            );
        }
    };
});
