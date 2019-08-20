define(['App', 'jquery', 'common/ui/datatables', 'common/ui/modal', 'common/ui/validator', 'jq/chosen', 'common/ui/filedownload'], function (App, $, DataTables, Modal, Bind) {
    return App.View({
        $table: $([]),
        ready: function () {
            var self = this;
            var $table = this.$("#table-predict-overview");
            this.set('$table', $table);
            this.initTablePrivate(function () {
                var $tableTop = self.$('#table-predict-overview_top');
                // 事件绑定 添加 配置 请求处理 删除
                self.bind('click', $('.btn-add', $tableTop), self.addNotebook);
                self.bind('click', $('.btn-delete', $table), self.deleteNotebook);
            });
        },
        initTablePrivate: function (callback) {
            var self = this;
            DataTables.init(this.$table, {
                ajax: this.tableAjax(),
                dataSrc: 'content',
                columns: [{
                    'data': "",
                    'width': "check",
                    'defaultContent': '<label><input type="checkbox"></label>'
                }, {
                    'data': "name",
                    'width': "6em",
                    'render': function (data, type, rowData, cellApi) {
                        // return '<a href="' + self.getUrl('/ml_notebook/notebook_info?name=' + rowData.name) + '">' + data + '</a>';
                        return '<a target="_blank" href="' + 'http://10.110.17.184:8000/user/admin/notebooks/' + data + '?token=52d28ca878054e7fa76edaa94a9c5b76' + '">' + data + '</a>';
                    }
                }, {
                    'data': "path",
                    'width': "6em"
                }, {
                    'data': "size",
                    'width': "4em",
                    'render': function (data, type, rowData, cellApi) {
                        return data + "B";
                    }
                }, {
                    'data': "created",
                    'width': "datetime",
                    render: function (data, type, rowData, cellApi) {
                        if (data && data.length > 19) {
                            return data && data.substring(0, 19);
                        }
                        return data;
                    }
                }, {
                    'data': "last_modified",
                    'width': "datetime",
                    render: function (data, type, rowData, cellApi) {
                        if (data && data.length > 19) {
                            return data && data.substring(0, 19);
                        }
                        return data;
                    }
                }, {
                    'data': "id",
                    'width': "opt",
                    'render': function (data, type, rowData, cellApi) {
                        return (
                            '<a class="btn btn-opt btn-delete" title="删除" data-toggle="tooltip">' +
                            '<i class="fa fa-trash-o"></i>' +
                            '</a>'
                        );
                    }
                }]
            }, callback);
        },
        tableAjax: function () {
            var self = this;
            return DataTables.parseAjax(this, this.$table, {
                url: '/api/v1/notebooks'
            });
        },
        addNotebook: function (e) {
            var self = this;
            Modal.show({
                title: "创建Notebook",
                remote: function () {
                    var def = $.Deferred();
                    self.render({
                        source: self.getPathId('/ml_notebook/create_notebook'),
                        callback: function (err, html) {
                            def.resolve(html);
                        }
                    });
                    return def.promise();
                },
                onloaded: function (dialog) {
                    var $dialog = dialog.getModalDialog(),
                        $form = $("form", $dialog);
                    $dialog.find('form').each(function () {
                        self.formValidator($(this));
                    });
                },
                buttons: [{
                    label: "关闭",
                    action: function (dialog) {
                        dialog.close();
                    }
                }, {
                    label: "创建",
                    cssClass: "btn-primary",
                    action: function (dialog) {
                        var $dialog = dialog.getModalDialog(),
                            $form = $("form", $dialog),
                            formData = $form.serializeObject() || {};
                        if (!$form.length || !$form.valid()) return false;
                        dialog.close();
                        var processor = Modal.processing("正在创建Notebook");
                        self.ajax.postJSON({
                                url: "/api/v1/notebooks",
                                data: {
                                    "name": formData.name + ".ipynb",
                                    "path": formData.name + ".ipynb",
                                    "type": "notebook",
                                    "writable": true
                                },
                                timeout: 30000
                            }, function (err, data) {
                                if (err) {
                                    self.onError(err, function (err) {
                                        processor.error('创建失败。原因：' + err.message);
                                    });
                                } else {
                                    processor.success('创建成功');
                                    self.$table.reloadTable();
                                }
                            }
                        );
                    }
                }]
            });
        },
        deleteNotebook: function (e) {
            var self = this;
            var row = $(e.currentTarget).data('row.dt'),
                rowData = row.data(),
                name = rowData.name;
            var keywords = 'Notebook' + App.highlight(name);
            Modal.confirm("确定删除" + keywords + "吗？", function (bsure) {
                if (bsure) {
                    var processor = Modal.processing("正在删除" + keywords);
                    self.ajax.delete("/api/v1/notebooks/" + name, function (err, data) {
                        if (err) {
                            self.onError(err, function (err) {
                                processor.error(keywords + '删除失败。原因：' + err.message);
                            });
                        } else {
                            processor.success(keywords + '删除成功');
                            self.$table.reloadTable();
                        }
                    });
                }
            });
        },
        formValidator: function ($form) {
            return $form ? $form.validate({
                errorContainer: "_form",
                errorPlacement: "left bottom",
                rules: {
                    'name': {
                        required: true
                    },
                }
            }) : null;
        },
    });
});
