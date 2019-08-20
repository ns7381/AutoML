/**
 * 密码框显示的加密与明文显示
 *
 * Created by jinzhk on 2016/3/29.
 */
define(['jquery'], function($) {

    var PassSelector = {
        element : 'input[type="password"]',
        wrapper : '.pwd-masked-wrapper',
        button  : '.btn-pwd-masked',
        prompt  : '.pwd-masked-prompt'
    };

    var toCssClass = function(selector) {
        selector = selector || "";
        var selectors = selector.split(','), cssClass = [];
        $.each(selectors, function(i, item) {
            item = $.trim(item);
            item = $.trim(item.split('\.').join(" "));
            cssClass.push(item);
        });
        cssClass = cssClass.join(" ");
        return cssClass;
    };

    var PwdMasked = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, PwdMasked.DEFAULTS, options);
        this.create();
        this.listen();
    };

    PwdMasked.DEFAULTS = {};

    PwdMasked.prototype = {
        create: function() {
            if (!this.$element.is(PassSelector.element)) return this;
            this.$element.each(function() {
                var $this = $(this),
                    $wrapper = $this.parent();
                if (!$wrapper.is(PassSelector.wrapper)) {
                    var cssClassWrapper = toCssClass(PassSelector.wrapper);
                    $wrapper = $('<div class="' + cssClassWrapper +'"></div>');
                    $this.wrap($wrapper);
                }
                var zIndex = parseInt($this.css('z-index')) || 0;
                /*
                 var $prompt = $wrapper.children(PassSelector.prompt);
                 if (!$prompt.length) {
                 $prompt = $('<input type="text">').addClass(this.className || "").addClass(toCssClass(PassSelector.prompt));
                 if ($this.attr('id')) {
                 $prompt.attr('id', $this.attr('id') + "-prompt");
                 }
                 $prompt.hide();
                 $prompt.val($this.val());
                 $this.after($prompt);
                 }
                 if (zIndex) {
                 $prompt.css('z-index', ++zIndex);
                 }
                 */
                var $btn = $wrapper.children(PassSelector.button);
                if (!$btn.length) {
                    $btn = $('<a class="' + toCssClass(PassSelector.button) + '"></a>');
                    $this.after($btn);
                }
                if (zIndex) {
                    $btn.css('z-index', ++zIndex);
                }
            });
        },
        listen: function() {
            var that = this, $wrappers = this.$element.parent();
            $wrappers.find(PassSelector.element)
                .off("keypress").on("keypress", function(e) {
                    //
                })
                .off("change").on("change", function() {
                var $this = $(this);
                $this.siblings(PassSelector.prompt).val($this.val())
            });
            $wrappers.find(PassSelector.prompt)
                .off("change").on("change", function() {
                    var $this = $(this);
                    $this.siblings(PassSelector.element).val($this.val())
                })
                .off("blur").on("blur", function() {
                $(this).siblings(PassSelector.element).blur();
            });
            $wrappers
                .off("mousedown", PassSelector.button)
                .on("mousedown", PassSelector.button, function(e) {
                    var $wrapper = $(e.delegateTarget);
                    $wrapper.addClass("open");
                    var cssClassPrompt = toCssClass(PassSelector.prompt);
                    $wrapper.find(PassSelector.element)
                        .addClass(cssClassPrompt)
                        .attr('type', "text");
                });
            $wrappers
                .off("mouseup", PassSelector.button)
                .on("mouseup", PassSelector.button, function(e) {
                    var $wrapper = $(e.delegateTarget);
                    $wrapper.removeClass("open");
                    var cssClassPrompt = toCssClass(PassSelector.prompt);
                    $wrapper.find(PassSelector.prompt)
                        .removeClass(cssClassPrompt)
                        .attr('type', "password");
                });
            $(window)
                .off("blur")
                .on("blur", function() {
                    var $target = $(PassSelector.button, $wrappers);
                    if ($wrappers.hasClass('open')) {
                        $target.trigger('mouseup')
                    }
                });
        }
    };

    var old = $.fn.pwdMasked;

    $.fn.pwdMasked = function(options) {
        var that = this, ret, args = Array.prototype.slice.call(arguments, 1);
        this.each(function() {
            var $this = $(this);
            var data = $this.data('pwdMasked.ui');

            if (!data) $this.data('pwdMasked.ui', (data = new PwdMasked(this, options)));
            var curRet;
            if (typeof options === "string" && typeof data[options] === "function" && typeof (curRet = data[options].apply(data, args)) !== "undefined") {
                if (that.length > 1) {
                    if (!ret) ret = [];
                    ret.push(curRet);
                } else {
                    ret = curRet;
                }
            } else {
                ret = that;
            }
        });
        return ret;
    };

    $.fn.pwdMasked.noConflict = function() {
        $.fn.pwdMasked = old;
        return this;
    };

});