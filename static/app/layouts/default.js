define(['App', 'common/ui/modal', 'layouts/common/pubLayout', 'bs/collapse', 'jq/nicescroll', 'common/ui/pwdmasked', 'common/ui/validator'], function (App, Modal, pubLayout) {
    return App.Layout({
        binds: [
            [
                'viewchange', 'window', function (e, curState, prevState) {
                $('.tooltip').remove();
                pubLayout.activeSideBar(this, curState, true);
            }
            ],
            [
                'resize', 'window', function (e) {
                this.resize(e.target);
            }
            ],
            [
                'click', '[href$="#/logout"]', function (e) {
                e.preventDefault();
                App.logout();
            }
            ],
            [
                'click', '[href$="#/resetpwd"]', function (e) {
                e.preventDefault();
                this.btnChangepw();
            }
            ],
            [
                'click', '[href$="#/adduser"]', function (e) {
                e.preventDefault();
                this.btnAddUser();
            }
            ]
        ],
        dataFilter: function () {
            var sideList = [
                {
                    name: "主页",
                    icon: 'fa-bank',
                    link: '/home'
                },
                {
                    name: "数据源",
                    icon: 'fa-user',
                    link: '/ml_source/source_overview'
                },
                {
                    name: "ML实验",
                    icon: 'fa-bars',
                    link: '/ml_project/project_overview'
                },
                {
                    name: "ML模型",
                    icon: 'fa-briefcase',
                    link: '/ml_model/model_overview'
                }
            ];
            if (App.getCookie('is_admin')) {//管理员
                sideList.push(
                    {
                        name: "审计日志",
                        icon: 'fa-camera-retro',
                        link: '/sysmanagement/audit'
                    },
                    {
                        name: "系统检测",
                        icon: 'fa-wrench',
                        link: '/common/system_check'
                    });
            }

            this.menuMap = pubLayout.parseMenuMap(this, sideList);
            return {sideList: sideList};
        },
        ready: function () {
            var $aside = this.$('aside:first'),
                $sideBar = $('#side-bar', $aside);

            $sideBar.metisMenu();

            var $pageMain = this.$('#page-main'),
                $pageContent = $('.page-content:first', $pageMain);

            this.set('$aside', $aside);
            this.set('$sideBar', $sideBar);
            this.set('$pageMain', $pageMain);
            this.set('$pageContent', $pageContent);

            this.bind($('click', '.btn-changepw'), this.btnChangepw);

            pubLayout.init(this);
            pubLayout.activeSideBar(this, App.getState(), true);
        },
        destroyed: function () {
            pubLayout.destroy(this);
            pubLayout.setCss();
        },
        btnChangepw: function (e) {
            var self = this;
            Modal.show({
                title: "修改密码",
                remote: function () {
                    var def = $.Deferred();
                    self.render(
                        App.remote("../change_password.html"),
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
                                'old_password': {
                                    required: true,
                                    minlength: 3,
                                    maxlength: 15,
                                    var: true
                                },
                                'user_password': {
                                    required: true,
                                    minlength: 3,
                                    maxlength: 15,
                                    notEqualToOldPwd: "#old_password",
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


                            var passwdData = {};
                            passwdData["password"] = $("#user_password", $dialog).val();
                            passwdData["old_password"] = $("#old_password", $dialog).val();
                            var uid = App.cookie.getUid();
                            self.ajax.put(
                                {
                                    url: "/api/v1/users/" + uid,
                                    data: App.json.stringify(passwdData),
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
        },
        menuMap: {},
        $win: $(window),
        $aside: $([]),
        $sideBar: $([]),
        $pageMain: $([]),
        $pageContent: $([])
    });
});