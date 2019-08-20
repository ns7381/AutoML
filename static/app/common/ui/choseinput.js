/**
 * Created by jinzhk on 2016/2/15.
 */
define(['jquery'], function($) {

    var ChoseInput = function(element, options) {
        this.$element = $(element);
        this.options = $.extend(true, {}, ChoseInput.DEFAULTS, options);
        this.textBinds = $([]);
        this.create();
    };

    ChoseInput.version = "0.8.0";

    ChoseInput.DEFAULTS = {
        align: "right",
        editable: false,
        default_buttons: [
            {
                label: "选择",
                cssClass: "btn btn-default",
                bindToText: true,
                action: function() {
                    //
                }
            }
        ],
        clear_buttons: [
            {
                label: "重新选择",
                cssClass: "btn btn-primary",
                bindToText: true,
                action: function() {
                    //
                }
            },
            {
                label: '',
                cssClass: "btn btn-remove",
                action: function() {
                    this.clear();
                }
            }
        ]
    };

    ChoseInput.prototype = {
        create: function() {
            this.$element.wrap('<div class="chose-input"></div>').addClass("chose-input-element");
            this.$wrapper = this.$element.parent();

            var pdr = parseInt(this.$element.css('padding-right'));
            if (isNaN(pdr)) pdr = 0;
            this.$element.data('original-pdr', pdr);

            if (this.options.align) {
                this.$wrapper.addClass("chose-input-align-"+this.options.align);
            }

            if (this.options.editable) {
                this.$wrapper.addClass("chose-input-editable");
            }

            this.$wrapper.append('<span class="chose-input-text"></span>');
            this.$text = this.$wrapper.find('.chose-input-text:first');

            this.$wrapper.append('<div class="chose-input-controls"></div>');
            this.$controls = this.$wrapper.find('.chose-input-controls:first');

            this.$controls.append('<div class="chose-input-controls-default"></div>');
            this.$controlsDef = this.$controls.find('.chose-input-controls-default:first');

            this.$controls.append('<div class="chose-input-controls-clear"></div>');
            this.$controlsClear = this.$controls.find('.chose-input-controls-clear:first');

            var that = this;

            if ($.isArray(this.options.default_buttons)) {
                if (this.options.align !== "right") {
                    this.options.default_buttons.reverse();
                }
                $.each(this.options.default_buttons, function(i, btnOpt) {
                    that.$controlsDef.append(that.createBtn(btnOpt));
                });
            }
            if ($.isArray(this.options.clear_buttons)) {
                if (this.options.align !== "right") {
                    this.options.clear_buttons.reverse();
                }
                $.each(this.options.clear_buttons, function(i, btnOpt) {
                    that.$controlsClear.append(that.createBtn(btnOpt));
                });
            }
            this.listen();

            this.clear();
            this.val(this.$element.val());
        },
        createBtn: function(opt) {
            if (!opt) return '';
            var $btn = $('<a></a>');
            $btn.addClass(opt.cssClass)
                .html(opt.label || '')
                .data('action', opt.action);
            if (opt.bindToText) {
                this.textBinds = this.textBinds.add($btn);
            }
            return $btn;
        },
        listen: function() {
            var that = this, $btns = this.$controlsDef.children().add(this.$controlsClear.children());
            $btns.each(function() {
                var $this = $(this);
                $this.off("click").on("click", that, function(e) {
                    var $this = $(e.target),
                        that = e.data,
                        action = $this.data('action');
                    if ((
                        that.isFilled() && $.contains(that.$controlsClear[0], $this[0])
                    ) || (
                        !that.isFilled() && $.contains(that.$controlsDef[0], $this[0])
                    )) {
                        typeof action === "function" && action.call(that, e);
                    }
                });
            });
            this.$text.off("click").on("click", that, function(e) {
                var that = e.data;
                that.textBinds.trigger("click");
            });
        },
        val: function() {
            if (arguments.length <= 0) {
                return this.$element.val();
            } else if(arguments[0]) {
                this.$element.val(arguments[0]);
                this.$text.text(arguments[0]);
                this.$wrapper.addClass("chose-input-state-filled");
                var controlsW = this.$controlsClear.outerWidth(),
                    align = this.options.align || "left",
                    originalpdr = this.$element.data('original-pdr') || 0;
                this.$text.css(align, controlsW);
                this.$element.css('padding-'+align, controlsW + originalpdr);
            }
        },
        clear: function() {
            this.$element.val('');
            this.$text.text('');
            this.$wrapper.removeClass("chose-input-state-filled");
            var controlsW = this.$controlsDef.outerWidth(),
                align = this.options.align || "left",
                originalpdr = this.$element.data('original-pdr') || 0;
            this.$text.css(align, controlsW);
            this.$element.css('padding-'+align, controlsW + originalpdr);
        },
        isFilled: function() {
            return this.$wrapper.hasClass("chose-input-state-filled");
        }
    };

    var old = $.fn.choseInput;

    $.fn.choseInput = function(options) {
        var that = this, ret, args = Array.prototype.slice.call(arguments, 1);
        this.each(function() {
            var $this = $(this);
            var data = $this.data('choseInput.ui');

            if (!data) $this.data('choseInput.ui', (data = new ChoseInput(this, options)));
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

    $.fn.choseInput.noConflict = function() {
        $.fn.choseInput = old;
        return this;
    };

});