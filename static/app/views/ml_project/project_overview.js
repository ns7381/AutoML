define(['App', 'jquery', 'common/ui/datatables', 'common/ui/modal', 'common/ui/validator', 'jq/chosen'], function (App, $, DataTables, Modal, Bind) {
    return App.View({
        $table: $([]),
        sources: {},
        params: {},
        spark_version: "v2",
        ready: function () {
            var self = this;
            var $table = this.$("#table-project-overview");
            this.set('$table', $table);
            this.initTablePrivate(function () {
                var $tableTop = self.$('#table-project-overview_top');
                self.bind('click', $('.btn-add', $tableTop), self.addProject);
                self.bind('click', $('.btn-delete', $table), self.deleteProject);
            });
        },
        initTablePrivate: function (callback) {
            var self = this;
            DataTables.init(this.$table, {
                serverSide: true,
                ajax: this.tableAjax(),
                columns: [{
                    'data': "",
                    'width': "check",
                    'defaultContent': '<label><input type="checkbox"></label>'
                }, {
                    'data': "name",
                    'width': "10em",
                    'render': function (data, type, rowData, cellApi) {
                        return '<a href="' + self.getUrl('/ml_project/project_flow?id=' + rowData.id) + '">' + data + '</a>';
                    }
                }, {
                    'data': "cores",
                    'width': "10em",
                    'render': function (data, type, rowData, cellApi) {
                        return data + " 核";
                    }
                }, {
                    'data': "memory",
                    'width': "8em",
                    'render': function (data, type, rowData, cellApi) {
                        return data + " Mb";
                    }
                }, {
                    'data': "create_time",
                    'width': "8em",
                    render: function (data, type, rowData, cellApi) {
                        return data.substring(0, 19);
                    }
                }, {
                    'data': "",
                    'width': "10em",
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
                url: '/api/v1/projects/page/{pageNo}/{pageSize}'
            });
        },
        addProject: function (e) {
            var self = this;
            Modal.show({
                title: "新建ML实验",
                remote: function () {
                    var def = $.Deferred();
                    self.render({
                        source: self.getPathId('/ml_project/create_project'),
                        data: {"sources": self.sources},
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
                        var processor = Modal.processing("正在创建ML实验");
                        self.ajax.post({
                                url: "/api/v1/projects",
                                data: App.json.stringify(formData),
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
        deleteProject: function (e) {
            var self = this;
            var row = $(e.currentTarget).data('row.dt'),
                rowData = row.data(),
                name = rowData.name,
                project_id = rowData.id;
            var keywords = '实验' + App.highlight(name);
            Modal.confirm("确定删除" + keywords + "吗？", function (bsure) {
                if (bsure) {
                    var processor = Modal.processing("正在删除" + keywords);
                    self.ajax.delete("/api/v1/projects/" + project_id, function (err, data) {
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
                    'cores': {
                        positive_integer: true,
                        required: true
                    },
                    'memory': {
                        positive_integer: true,
                        required: true
                    }
                }
            }) : null;
        },
    });
});