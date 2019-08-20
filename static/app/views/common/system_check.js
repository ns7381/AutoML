define(['App', 'jquery', 'common/ui/datatables', 'common/ui/modal', 'common/ui/validator'], function (App, $, DataTables, Modal) {
    return App.View({
        $table: $([]),
        $tableVg: $([]),
        processor: {},
        ready: function (data) {
            var self = this;
            self.bind('click', $('.btn-primary'), self.systemCheck);
        },
        systemCheck: function (e) {
            var self = this;
            self.$("#checkInfo").empty();
            self.$(".btn-primary").attr("disabled", true);
            self.processor = Modal.processing("正在检测");
            self.$("#checkInfo").append('【开始检查后台服务】 ...\n');
            self.ajax.get({
                url: App.getRootUrl("/api/v1/system/status"),
                timeout: 60000,
                dataType: 'json'
            }, function (err, data) {
                if (err) {
                    self.$("#checkInfo").append('【失败】：' + err.message + "\n");
                } else {
                    self.$("#checkInfo").append('【成功】：' + "后台服务正常\n");
                }
                self.$("#checkInfo").append("\n");
                self.$("#checkInfo").append("测试结束");
                self.processor.success('测试结束');
                self.$(".btn-primary").attr("disabled", false);
            });
        }
    });
});