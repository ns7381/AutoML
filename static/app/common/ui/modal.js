/**
 * 模态框
 *
 * Created by jinzk on 2015/11/17.
 */
define(['jquery', 'bs/modal'], function($, Modal) {
    // 存在模态框时非文本输入框下禁用Backspace（回退）键
    $(document).on("keypress keydown", ".modal-backdrop,.modal", function(e) {
        var evt = e || window.event,
            isBackspace = (evt.keyCode == 8);

        if (!isBackspace) return true;

        var bBubble = false;

        // 按下Backspace键时，事件源类型为单行、多行文本输入框，
        // 并且readonly或disabled属性为true时，则禁用退格键
        var $tar = $(evt.target || evt.srcElement),
            isReadOnly = !!$tar.prop('readonly'),
            isDisabled = !!$tar.prop('disabled');
        if ($tar.is("input") || $tar.is("textarea")) {
            bBubble = !(isReadOnly || isDisabled);
        }

        return bBubble;
    });
    // init modal default options
    Modal.configDefaultOptions({
        size: {
            width: Modal.SIZE_NORMAL,
            maxHeight: "100%"
        },
        draggable: true,
        closeByBackdrop: false,
        closeByKeyboard: false
    });
    Modal.confirm.configDefaultOptions({
        btnOKLabel: "确认"
    });
    Modal.success.configDefaultOptions({
        nl2br: true,
        timeout: 1000
    });
    Modal.processing.configDefaultOptions({
        nl2br: true,
        timeout: {
            success: 1000
        }
    });
    Modal.configDefaultOptions(['processing', 'info', 'warning', 'error'], {
        nl2br: true
    });
    var newModal = $.extend({}, Modal);

    // Modal &  Wizard
    var ModalWizard = function(options) {
        this.options = $.extend({}, options);

        this.modalOptions = $.extend(true, {}, this.options, ModalWizard.DEFAULTS.modal);
        this.wizardOptions = $.extend(true, {}, this.options, ModalWizard.DEFAULTS.wizard);

        this.modalOptions.remote = $.proxy(function(dialog) {
            var that = this, def = $.Deferred(), defModule = $.Deferred();
            require(['bs/wizard'], function() {
                defModule.resolve();
            }, function(e) {
                defModule.reject(e);
            });
            if (this.options.remote) {
                var defMessage;
                if(typeof this.options.remote === "function") {
                    this.options.remote = this.options.remote(dialog);
                }
                if(typeof this.options.remote === "string") {
                    this.options.remote = {url: this.options.remote};
                } else if($.isPlainObject(this.options.remote)) {
                    if(typeof this.options.remote.always === "function") {
                        defMessage = this.options.remote;
                    }
                }
                if (!defMessage && this.options.remote.url) {
                    defMessage = $.ajax(this.options.remote);
                } else if (!defMessage) {
                    defMessage = $.Deferred();
                    defMessage.resolve('');
                }
                $.when(defMessage, defModule).then(function(html) {
                    def.resolve(html);
                }, function(e) {
                    def.reject(e);
                });
            } else if (this.options.message) {
                defModule.then(function() {
                    def.resolve(dialog.createDynamicContent(that.options.message));
                }, function(e) {
                    def.reject(e);
                });
            }
            return def.promise();
        }, this);
        this.modalOptions.onloaded = $.proxy(function(dialog) {
            dialog.getModalBody().removeClass('loading');
            dialog.setSize(
            		(this.options.size && typeof(this.options.size) === "object") 
            		? $.extend({}, ModalWizard.DEFAULTS.size, this.options.size) 
    				: (this.options.size || ModalWizard.DEFAULTS.size)
			, true);

            var $modal = dialog.getModal(),
                $modalBody = dialog.getModalBody(),
                $element = $(".wizard-step", $modalBody);

            if (this.options.formSubmitting && typeof this.options.formSubmitting.action === "function") {
                var that = this;
                this.wizardOptions.formSubmitting.action = function() {
                    var self = this;
                    that.options.formSubmitting.action.call(self, dialog);
                };
            }
            $element.wizardStep(this.wizardOptions);

            // 固定 step-desc
            var $stepContent = $(".step-content", $element),
                $stepPanes = $(".step-pane", $stepContent),
                $stepDesc = $(".step-desc", $stepContent);
            $stepPanes.each(function() {
                var $curStepPane = $(this);
                if (!$(".step-pane-right, .step-pane-left", $curStepPane).length) {
                    $curStepPane.addClass("step-pane-mainly");
                } else {
                    $curStepPane.removeClass("step-pane-mainly");
                }
            });
            if ($stepDesc.length) {
                $stepDesc.css({position: "relative", top: 0});
                var checkPosition = function() {
                    var $stepPane = $element.wizardStep('getStepPane'),
                        contentH = $stepPane.innerHeight(),
                        pdt = parseFloat($stepPane.css('padding-top')) || 0,
                        pdb = parseFloat($stepPane.css('padding-bottom')) || 0;
                    contentH -= (pdt + pdb);
                    if ($stepPane && $stepPane.length) {
                        var $currentStepDesc = $('.step-desc', $stepPane),
                            posTop = $stepPane.scrollTop() || 0,
                            dh = $currentStepDesc.outerHeight(true) - contentH;
                        if (dh > 0) {
                            if (posTop <= dh) {
                                posTop = 0;
                            } else {
                                posTop -= dh;
                            }
                        }
                        $currentStepDesc.css({top: posTop});
                    }
                };
                $stepPanes.off("scroll.stepContent").on("scroll.stepContent", checkPosition);
                checkPosition.call($stepPanes[0]);
            }

            if (typeof this.options.onloaded === "function") {
                this.options.onloaded.call($modal.data('loaded.bs.modal'), dialog);
            }
        }, this);

        var key;
        for (key in ModalWizard.DEFAULTS.modal) {
            delete this.wizardOptions[key];
        }
        for (key in ModalWizard.DEFAULTS.wizard) {
            delete this.modalOptions[key];
        }
    };

    ModalWizard.prototype.show = function() {
        return Modal.show(this.modalOptions);
    };

    ModalWizard.DEFAULTS = {
		size: {
			width: '65%',
            height: 550,
            minWidth: 600,
            maxWidth: 850,
            maxHeight: '100%'
		},
        modal: {
            size: Modal.SIZE_NORMAL,
            cssClass: "modal-wizard",
            buttons: [],
            onshow: function(dialog) {
                dialog.getModalBody().addClass('loading');
            }
        },
        wizard: {
            disablePreviousStep: false,
            stepIndex: 1,
            height: "100%",
            formMode: true,
            orient: "vertical"
        }
    };

    Modal.wizard = function(options)  {
        return new ModalWizard(options).show();
    };
    Modal.show = function(options) {
        var that = this;
        var modalOptions = $.extend(true, {}, options, {onshown: function(dialog) {
            var $modal = dialog.getModal();
            $modal.on('keypress', 'input', function(e) {
                if(e.keyCode === 13) {
                    return false;
                }
            });
            typeof options.onshown === "function" && options.onshown.apply(that, arguments);
        }});
        return newModal.show(modalOptions);
    };

    return Modal;
});