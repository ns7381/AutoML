define(['App'], function (App) {
    return App.View({
        ready: function () {
            var self = this, name = self.getParam('name');
            self.$('#notebook').attr('src', 'http://10.110.17.184:8000/user/admin/notebooks/' + name + '?token=52d28ca878054e7fa76edaa94a9c5b76')
        }
    });
});
