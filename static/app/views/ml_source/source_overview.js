define(['App', 'jquery', 'common/ui/datatables', 'common/ui/modal', 'echarts', 'common/ui/validator', 'jq/chosen', 'bs/switcher', 'bs/collapse'], function (App, $, DataTables, Modal, Bind, ec) {
    return App.View({
        $table: $([]),
        alarmindex: 1,
        rowAttributes: ['prediction'],
        ready: function () {
            var self = this;
            var $table = this.$("#table-model-overview");
            this.set('$table', $table);
            this.initTablePrivate(function () {
                var $tableTop = self.$('#table-model-overview_top');
                // 事件绑定 添加 配置 请求处理 删除
                self.bind('click', $('.btn-add', $tableTop), self.addSource);
                self.bind('click', $('.btn-delete', $table), self.deleteSource);
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
                    'width': "8em"
                }, {
                    'data': "file_path",
                    'minWidth': "15em",
                    'render': function (data, type, rowData, cellApi) {
                        if (rowData.format === "jdbc") {
                            return JSON.parse(rowData.options)["url"];
                        }
                        return data;
                    }
                }, {
                    'data': "create_time",
                    'width': "13em",
                    render: function (data, type, rowData, cellApi) {
                        return data.substring(0, 19);
                    }
                }, {
                    'data': "",
                    'width': "6em",
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
                url: '/api/v1/sources/page/{pageNo}/{pageSize}'
            });
        },
        addSource: function () {
            var self = this;
            Modal.show({
                title: "新建数据源",
                remote: function (dialog) {
                    var def = $.Deferred();
                    self.render({
                        source: self.getPathId('/ml_source/create_source'),
                        callback: function (err, html) {
                            def.resolve(html);
                        }
                    });
                    return def;
                },
                onloaded: function (dialog) {
                    var $dialog = dialog.getModalDialog();
                    $dialog.find('form').each(function () {
                        self.formValidator($(this));
                    });
                    $('#includeHead-yes').attr('checked', 'true');
                    self.selectFormat($dialog);
                },
                buttons: [{
                    label: "关闭",
                    action: function (dialog) {
                        dialog.close();
                    }
                }, {
                    label: "确定",
                    cssClass: "btn-primary",
                    action: function (dialog) {
                        var $dialog = dialog.getModalDialog(),
                            $form = $("#form-data-source", $dialog),
                            formData = $form.serializeObject() || {};
                        if (formData.format === "mysql" || formData.format === "hive2") {
                            formData.options = JSON.stringify({
                                url: "jdbc:" + formData.format + "://" + formData.db_host + ":" + formData.db_port + "/" + formData.db_database,
                                dbtable: formData.dbtable,
                                user: formData.user,
                                password: formData.password,
                            });
                            formData.format = 'jdbc';
                        } else {
                            formData.options = JSON.stringify({
                                header: formData.header === "True",
                                delimiter: formData.delimiter,
                                inferSchema: true
                            });
                        }
                        var keywords = App.highlight('ML数据源：' + formData.name);
                        var processor = Modal.processing('正在创建 ' + keywords);
                        self.ajax.postJSON({
                                url: "/api/v1/sources",
                                data: formData,
                                timeout: 10000
                            }, function (err, data) {
                                if (err) {
                                    self.onError(err, function (err) {
                                        processor.error('创建失败!，原因：' + err.message);
                                    });
                                } else {
                                    processor.success('创建成功!');
                                    dialog.close();
                                    self.$table.reloadTable();
                                }
                            }
                        );
                    }
                }]
            });
        },
        deleteSource: function (e) {
            var self = this;
            var row = $(e.currentTarget).data('row.dt'),
                rowData = row.data(),
                name = rowData.name,
                sourceId = rowData.id;
            var keywords = '数据源' + App.highlight(name);
            Modal.confirm("确定删除" + keywords + "吗？", function (bsure) {
                if (bsure) {
                    var processor = Modal.processing("正在删除" + keywords);
                    self.ajax.delete("/api/v1/sources/" + sourceId, function (err, data) {
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
                        required: true,
                        maxlength: 255,
                        minlength: 2
                    },
                    'format': {
                        required: true
                    },
                    'file_path': {
                        required: true
                    },
                    'delimiter': {
                        required: true
                    },
                    'db_host': {
                        IP: true,
                        required: true
                    },
                    'db_port': {
                        range: [0, 65535],
                        required: true
                    },
                    'db_database': {
                        required: true
                    },
                    'dbtable': {
                        required: true
                    },
                    'user': {
                        required: true
                    }
                }
            }) : null;
        },
        selectFormat: function ($stepPane) {
            $('select[name=format]', $stepPane).on('change', function () {
                var format = $('select[name=format]', $stepPane).val();
                var jdbcDiv = $('#jdbc', $stepPane);
                var fileDiv = $('#file', $stepPane);
                if (format === "mysql" || format === "hive2") {
                    jdbcDiv.show();
                    fileDiv.hide();
                } else {
                    jdbcDiv.hide();
                    fileDiv.show();
                }
            });
        }
    });
});