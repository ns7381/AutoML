/**
 * 密码设置弹出框
 *
 * Created by jinzk on 2015/12/4.
 */
define(['jquery', 'PubView', './modal', 'json', './validator', './pwdmasked'], function($, PubView, Modal, JSON) {
    return {
        show: function(Cookie, success, failure) {
            if (!Cookie.getUid()) {
                typeof failure === "function" && failure();
                return false;
            }
            var loginMode = Cookie.getLoginMode(),
                suffix = (loginMode == "admin" ? '_admin' : '');
            return Modal.show({
                cssClass: 'modal-resetpwd',
                title: '密码设置',
                message: function() {
                    return (
                        '<form class="form-horizontal" id="form-resetpwd" role="form">' +
                        '<div class="form-group form-required">' +
                        '<label class="control-label col-sm-3" for="password'+suffix+'">原密码：</label>' +
                        '<div class="col-sm-8">' +
                        '<input class="form-control" name="password'+suffix+'" id="password'+suffix+'" type="password" data-toggle="pwd-masked">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group form-required ">' +
                        '<label class="control-label col-sm-3" for="newPassword'+suffix+'">新密码：</label>' +
                        '<div class="col-sm-8">' +
                        '<input class="form-control" name="newPassword'+suffix+'" id="newPassword'+suffix+'" type="password" data-toggle="pwd-masked">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group form-required">' +
                        '<label class="control-label col-sm-3" for="confirmPassword'+suffix+'">确认新密码：</label>' +
                        '<div class="col-sm-8">' +
                        '<input class="form-control" name="confirmPassword'+suffix+'" id="confirmPassword'+suffix+'" type="password" data-toggle="pwd-masked">' +
                        '</div>' +
                        '</div>' +
                        '</form>'
                    );
                }(),
                onshow: function(dialog) {
                    var $dialog = dialog.getModalDialog(),
                        $form = $('#form-resetpwd', $dialog);
                    var validateOpts = {
                        errorContainer: $dialog,
                        errorPlacement:"left bottom",
                        rules: {},
                        messages: {}
                    };
                    validateOpts.rules['password'+suffix] = {
                        required: true,
                        minlength: 6,
                        maxlength: 15
                    };
                    validateOpts.messages['password'+suffix] = {
                        required: "请填写原密码"
                    };
                    validateOpts.rules['newPassword'+suffix] = {
                        required: true,
                        minlength: 6,
                        maxlength: 15,
                        notEqualTo: "#password"+suffix
                    };
                    validateOpts.messages['newPassword'+suffix] = {
                        required: "请填写新密码",
                        notEqualTo: "新密码不能与原密码相同"
                    };
                    validateOpts.rules['confirmPassword'+suffix] = {
                        required: true,
                        minlength: 6,
                        maxlength: 15,
                        equalTo: "#newPassword"+suffix
                    };
                    validateOpts.messages['confirmPassword'+suffix] = {
                        required: "请确认新密码",
                        equalTo: "两次输入的密码不相同"
                    };
                    $form.validate(validateOpts);
                    // 重新登录
                    $dialog.on("click", ".btn-login", function() {
                        dialog.setData('login', true);
                        dialog.close();
                    });

                    $('[data-toggle="pwd-masked"]', $dialog).pwdMasked();
                },
                buttons: [{
                    icon: 'fa fa-check-circle',
                    label: '确&ensp;定',
                    id: "btn-resetpwd",
                    cssClass: 'btn-primary',
                    autospin: true,
                    hotkey: 13,
                    action: function(dialog) {
                        dialog.enableButtons(false);
                        dialog.getButton('btn-resetpwd').spin();
                        var $form = $('#form-resetpwd', dialog.getModalBody()),
                            submitError = function(message) {
                                dialog.enableButtons(true);
                                dialog.getButton('btn-resetpwd').stopSpin();
                                var $alert = $(".alert", $form);
                                if (message) {
                                    if (!$alert.length) {
                                        $alert = $('<div class="alert alert-danger"></div>').prependTo($form);
                                    }
                                    $alert.html('<i class="fa fa-exclamation-circle"></i>&ensp;' + message);
                                } else if ($alert.length) {
                                    $alert.remove();
                                }
                                dialog.setPosition();
                                return false;
                            },
                            submitSuccess = function() {
                                dialog.setData('success', true);
                                dialog.enableButtons(true);
                                dialog.getButton('btn-resetpwd').stopSpin();
                                dialog.close();
                            };
                        if (!$form.valid()) {
                            return submitError();
                        }
                        var uid = Cookie.getUid();
                        if (!uid) {
                            dialog.setData('login', true);
                            return submitError("获取用户信息失败！可能是登录已失效。<a class='btn-login link-more' href='javascript:;'>点此重新登录</a>");
                        }
                        var $password = $('[name="password'+suffix+'"]', $form),
                            $newPassword = $('[name="newPassword'+suffix+'"]', $form);
                        var postData = {
                                "password": $newPassword.val()
                            };
                        $.ajax({
                            type: "PUT",
                            url: PubView.root+"/api/v1/users/"+uid,
                            data: JSON.stringify(postData),
                            headers: {
                                'Accept': "application/json",
                                'Content-Type': "application/json"
                            },
                            success: function(res) {
                                if (res == 1) {
                                    submitSuccess();
                                } else if (res == -1) {
                                    submitError("原密码输入错误！");
                                } else {
                                    submitError(res && res.error_desc ? res.error_desc : "密码修改失败！");
                                }
                            },
                            error: function(xhr, errorText) {
                                submitError(errorText);
                            }
                        });
                    }
                }, {
                    label: '取消',
                    cssClass: 'btn-default',
                    action: function(dialog){
                        dialog.close();
                    }
                }],
                onhidden: function(dialog) {
                    dialog.enableButtons(true);
                    dialog.getButton('btn-resetpwd').stopSpin();
                    if (dialog.getData('success')) {
                        typeof success === "function" && success.call(success, dialog);
                    } else {
                        typeof failure === "function" && failure.call(failure, dialog);
                    }
                }
            });
        }
    };
});