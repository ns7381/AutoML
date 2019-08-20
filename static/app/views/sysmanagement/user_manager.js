define(['App', 'jquery', 'common/ui/datatables', 'common/ui/modal', 'common/ui/validator', 'jq/chosen'],
    function (App, $, DataTables, Modal, Bind) {
        return App.View({
            $table: $([]),
            sources: {},
            cols: ['abc', 'def'],
            ready: function () {

                var self = this;
                var $table = this.$("#table-user-overview");
                this.set('$table', $table);
                this.initTablePrivate(function () {
                    var $tableTop = self.$('#table-user-overview_top');
                    // 事件绑定 添加 配置 请求处理 删除
                    self.bind('click', $('.btn-add', $tableTop), self.addUser);
                    self.bind('click', $('.btn-change-pwd', $table), self.changePwd);
                    self.bind('click', $('.btn-disable', $table), self.disableUser);
                    self.bind('click', $('.btn-enable', $table), self.enableUser);
                });

            },
            initTablePrivate: function (callback) {
                var self = this;

//            var $dialog = dialog.getModalDialog();
//            $("#source_schema", $dialog).val(source_schema);
                DataTables.init(this.$table, {
                        serverSide: true,
                        ajax: this.tableAjax(),
                        columns: [{
                            'data': "",
                            'width': "check",
                            'defaultContent': '<label><input type="checkbox"></label>'
                        },
                            {
                                'data': "id",
                                'width': "4em",
                                visible: false
                            },
                            {
                                'data': "username",
                                'width': "4em"
                            },
                            {
                                'data': "source_num",
                                'width': "4em"
                            },
                            {
                                'data': "project_num",
                                'width': "4em"
                            },
                            {
                                'data': "model_num",
                                'width': "4em",
                            },
                            {
                                'data': "create_time",
                                'width': "8em",
                                render: function (data, type, rowData, cellApi) {
                                    return data.substring(0, 19);
                                }
                            },
                            {
                                'data': "active",
                                'width': "4em",
                                'render': function (data, type, rowData, cellApi) {
                                    if (data) {
                                        if (rowData.role == 1) {
                                            return '<span class="status" >' + App.statusLabel("able:ADMIN") + '</span>';
                                        }
                                        return '<span class="status" >' + App.statusLabel("able:ACTIVE") + '</span>';
                                    } else {
                                        return '<span class="status" >' + App.statusLabel("able:UNACTIVE") + '</span>';
                                    }
                                }
                            },
                            {
                                'data': "",
                                'width': "10em",
                                'render': function (data, type, rowData, cellApi) {
                                    var resHtml = '';
                                    if (rowData.role == 0) {
                                        if (rowData.active) {
                                            resHtml += ('<a class="btn btn-opt btn-disable" title="禁用" data-toggle="tooltip">' +
                                                '<i class="fa fa-user-times"></i>' +
                                                '</a>')
                                        } else {
                                            resHtml += ('<a class="btn btn-opt btn-enable" title="启用" data-toggle="tooltip">' +
                                                '<i class="fa fa-user"></i>' +
                                                '</a>')
                                        }
                                    }
                                    return resHtml;
                                }
                            }
                        ]
                    },
                    callback);
            },
            tableAjax: function () {
                var self = this;
                return DataTables.parseAjax(this, this.$table, {
                    url: '/api/v1/users/page/{pageNo}/{pageSize}'
                });
            },
            formValidator: function ($form) {

                return $form ? $form.validate({
                    errorContainer: "_form",
                    errorPlacement: "left bottom",
                    rules: {
                        'model_name': {
                            required: true,
                            maxlength: 255,
                            minlength: 2
                        },
                        'model_type': {
                            required: true
                        },
                        'read_type': {
                            required: true
                        },
                        'split_rate': {
                            required: true
                        }
                    }
                }) : null;
            },
            addUser: function (e) {
                var self = this;
                Modal.show({
                    title: "新建用户",
                    remote: function () {
                        var def = $.Deferred();
                        self.render(
                            App.remote("/sysmanagement/add_user.html"),
                            function (err, html) {
                                def.resolve(html);
                            }
                        );
                        return def.promise();
                    },
                    onloaded: function (dialog) {
                        var $dialog = dialog.getModalDialog();
                        $('[data-toggle="pwd-masked"]', $dialog).pwdMasked();


                        // 表单校验
                        $("form", $dialog).each(function () {
                            $(this).validate({
                                errorContainer: "_form",
                                errorPlacement: "left bottom",
                                rules: {
                                    'user_name': {
                                        required: true,
                                        minlength: 3,
                                        maxlength: 15,
                                        var: true
                                    },
                                    'user_password': {
                                        required: true,
                                        minlength: 3,
                                        maxlength: 15,
                                        var: true
                                    },
                                    'confirmpwd': {
                                        required: true,
                                        equalTo: "#user_password"
                                    }
                                },
                                messages: {}
                            });
                        });
                    },
                    buttons: [
                        {
                            label: "取消",
                            action: function (dialog) {
                                dialog.close();
                            }
                        },
                        {
                            label: "确定",
                            cssClass: "btn-primary",
                            action: function (dialog) {
                                var $dialog = dialog.getModalDialog(),
                                    $form = $("form", $dialog);

                                if (!$form.length || !$form.valid()) return false;
                                dialog.close();


                                var formData = {};
                                formData["user_name"] = $("#user_name", $dialog).val();
                                formData["user_password"] = $("#user_password", $dialog).val();


                                self.ajax.post(
                                    {
                                        url: "/api/v1/users",
                                        data: App.json.stringify(formData),
                                        timeout: 30000
                                    }, function (err, data) {
                                        if (err) {
                                            self.onError(err, function (err) {
                                                Modal.error('创建失败。原因：' + err.message);
                                            });
                                        } else {
                                            Modal.success('创建成功');
                                            self.$table.reloadTable();
                                        }
                                    }
                                );

                            }
                        }
                    ]
                });
            },
            enableUser: function (e) {

                var self = this;
                var row = $(e.currentTarget).data('row.dt'),
                    rowData = row.data(),
                    userName = rowData.name,
                    userID = rowData.id;
                var keywords = '用户' + App.highlight(userName);
                Modal.confirm("确定启用" + keywords + "吗？", function (bsure) {
                    if (bsure) {
                        var processor = Modal.processing("正在启用" + keywords);

                        var formData = {};
                        // formData["id"] = userID;
                        formData["active"] = true;

                        self.ajax.put({
                            url: "/api/v1/users/" + userID,
                            data: App.json.stringify(formData),
                            timeout: 10000
                        }, function (err, data) {
                            if (err) {
                                self.onError(err, function (err) {
                                    processor.error(keywords + '启用失败。原因：' + err.message);
                                });
                            } else {
                                processor.success(keywords + '启用成功');
                                self.$table.reloadTable();
                            }
                        });
                    }
                });
            },
            disableUser: function (e) {
                var self = this;
                var row = $(e.currentTarget).data('row.dt'),
                    rowData = row.data(),
                    userName = rowData.name,
                    userID = rowData.id;
                var keywords = '用户' + App.highlight(userName);
                Modal.confirm("确定禁用" + keywords + "吗？", function (bsure) {
                    if (bsure) {
                        var processor = Modal.processing("正在禁用" + keywords);

                        var formData = {};
                        formData["active"] = false;

                        self.ajax.put({
                            url: "/api/v1/users/" + userID,
                            data: App.json.stringify(formData),
                            timeout: 10000
                        }, function (err, data) {
                            if (err) {
                                self.onError(err, function (err) {
                                    processor.error(keywords + '禁用失败。原因：' + err.message);
                                });
                            } else {
                                processor.success(keywords + '禁用成功');
                                self.$table.reloadTable();
                            }
                        });
                    }
                });
            },
            changePwd: function (e) {
                var self = this;
                var row = $(e.currentTarget).data('row.dt'),
                    rowData = row.data(),
                    userName = rowData.name,
                    userID = rowData.id;

                Modal.show({
                    title: "修改用户密码",
                    remote: function () {
                        var def = $.Deferred();
                        self.render(
                            App.remote("/sysmanagement/change_pwd.html"),
                            function (err, html) {
                                def.resolve(html);
                            }
                        );
                        return def.promise();
                    },
                    onloaded: function (dialog) {
                        var $dialog = dialog.getModalDialog();
                        $('[data-toggle="pwd-masked"]', $dialog).pwdMasked();
                        $("#user_name", $dialog).val(userName)

                        // 表单校验
                        $("form", $dialog).each(function () {
                            $(this).validate({
                                errorContainer: "_form",
                                errorPlacement: "left bottom",
                                rules: {
                                    'user_name': {
                                        required: true,
                                        minlength: 3,
                                        maxlength: 15,
                                        var: true
                                    },
                                    'user_password': {
                                        required: true,
                                        minlength: 3,
                                        maxlength: 15,
                                        var: true
                                    },
                                    'confirmpwd': {
                                        required: true,
                                        equalTo: "#user_password"
                                    }
                                },
                                messages: {}
                            });
                        });
                    },
                    buttons: [
                        {
                            label: "取消",
                            action: function (dialog) {
                                dialog.close();
                            }
                        },
                        {
                            label: "确定",
                            cssClass: "btn-primary",
                            action: function (dialog) {
                                var $dialog = dialog.getModalDialog(),
                                    $form = $("form", $dialog);

                                if (!$form.length || !$form.valid()) return false;
                                dialog.close();

                                var formData = {};
                                formData["password"] = $("#user_password", $dialog).val();


                                self.ajax.put(
                                    {
                                        url: "/api/v1/users/" + userID,
                                        data: App.json.stringify(formData),
                                        timeout: 30000
                                    }, function (err, data) {
                                        if (err) {
                                            self.onError(err, function (err) {
                                                Modal.error('修改失败。原因：' + err.message);
                                            });
                                        } else {
                                            Modal.success('修改成功');
                                        }
                                    }
                                );

                            }
                        }
                    ]
                });

            }
        });
    });