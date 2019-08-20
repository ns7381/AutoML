define(['App', 'common/pubLogin', 'common/ui/pwdmasked'], function(App, punLogin) {
    return App.View({
        layout: null,
        title: "Insight ML Login",
        style: 'login.css',
        $loginForm: $([]),
        ready: function() {
            var self = this;
            this.set('$loginForm', this.$("#login-form"));
            this.set('dialog', false);

            punLogin.readyBody(this, App);
        },
        destroyed: function() {
            App.logging = false;
        }
    });
});
