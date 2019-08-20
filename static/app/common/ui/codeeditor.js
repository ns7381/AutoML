/**
 * 将文本区域（textarea）转化为关键字加亮的代码区域
 * 基于CodeMirror
 * option = {
 * 	mode: string
 *    	所有可用 mode 在项目的codemirror专属js目录下的mode目录下维护
 *	theme: string
 *    	所有可用 theme 在项目的codemirror专属css目录下的theme目录下维护
 *	indentUnit: integer
 *    	How many spaces a block (whatever that means in the edited language) should be indented.
 *    	The default is 2.
 *	smartIndent: boolean
 *    	Whether to use the context-sensitive indentation that the mode provides (or just indent the same as the line before).
 *    	Defaults to true.
 *	tabSize: integer
 *    	The width of a tab character.
 *    	Defaults to 4.
 *	indentWithTabs: boolean
 *    	Whether, when indenting, the first N*tabSize spaces should be replaced by N tabs.
 *		Default is false.
 *	electricChars: boolean
 *    	Configures whether the editor should re-indent the current line when a character is typed that might change its proper indentation (only works if the mode supports indentation).
 *    	Default is true.
 *	specialChars: RegExp
 *    	A regular expression used to determine which characters should be replaced by a special placeholder. Mostly useful for non-printing special characters.
 *    	The default is /[\u0000-\u0019\u00ad\u200b\u2028\u2029\ufeff]/.
 *	specialCharPlaceholder: function(char) → Element
 *    	A function that, given a special character identified by the specialChars option, produces a DOM node that is used to represent the character.
 *    	By default, a red dot (•) is shown, with a title tooltip to indicate the character code.
 *	rtlMoveVisually: boolean
 *    	Determines whether horizontal cursor movement through right-to-left (Arabic, Hebrew) text is visual (pressing the left arrow moves the cursor left) or logical (pressing the left arrow moves to the next lower index in the string, which is visually right in right-to-left text).
 *    	The default is false on Windows, and true on other platforms.
 *	keyMap: string
 *   	Configures the key map to use. （所有的keymap在项目的codemirror专属js目录下的keymap目录下维护）
 *   	The default is "default", which is the only key map defined in codemirror.js itself. Extra key maps are found in the key map directory. See the section on key maps for more information.
 *	extraKeys: object
 *    	Can be used to specify extra key bindings for the editor, alongside the ones defined by keyMap. Should be either null, or a valid key map value.
 *	lineWrapping: boolean
 *    	Whether CodeMirror should scroll or wrap for long lines.
 *    	Defaults to false (scroll).
 *	lineNumbers: boolean
 *    	Whether to show line numbers to the left of the editor.
 *	firstLineNumber: integer
 *    	At which number to start counting lines.
 *    	Default is 1.
 *	lineNumberFormatter: function(line: integer) → string
 *    	A function used to format line numbers. The function is passed the line number, and should return a string that will be shown in the gutter.
 *	gutters: array<string>
 *    	Can be used to add extra gutters (beyond or instead of the line number gutter). Should be an array of CSS class names, each of which defines a width (and optionally a background), and which will be used to draw the background of the gutters. May include the CodeMirror-linenumbers class, in order to explicitly set the position of the line number gutter (it will default to be to the right of all other gutters). These class names are the keys passed to setGutterMarker.
 *	fixedGutter: boolean
 *   	Determines whether the gutter scrolls along with the content horizontally (false) or whether it stays fixed during horizontal scrolling (true, the default).
 *	coverGutterNextToScrollbar: boolean
 *    	When fixedGutter is on, and there is a horizontal scrollbar, by default the gutter will be visible to the left of this scrollbar. If this option is set to true, it will be covered by an element with class CodeMirror-gutter-filler.
 *	readOnly: boolean|string
 *    	This disables editing of the editor content by the user. If the special value "nocursor" is given (instead of simply true), focusing of the editor is also disallowed.
 *	showCursorWhenSelecting: boolean
 *   	Whether the cursor should be drawn when a selection is active.
 *   	Defaults to false.
 *	undoDepth: integer
 *    	The maximum number of undo levels that the editor stores. Note that this includes selection change events.
 *    	Defaults to 200.
 *	historyEventDelay: integer
 *    	The period of inactivity (in milliseconds) that will cause a new history event to be started when typing or deleting.
 *    	Defaults to 1250.
 *	tabindex: integer
 *    	The tab index to assign to the editor. If not given, no tab index will be assigned.
 *	autofocus: boolean
 *    	Can be used to make CodeMirror focus itself on initialization.
 *    	Defaults to off. When fromTextArea is used, and no explicit value is given for this option, it will be set to true when either the source textarea is focused, or it has an autofocus attribute and no other element is focused.
 *	dragDrop: boolean
 *    	Controls whether drag-and-drop is enabled. On by default.
 *	cursorBlinkRate: number
 *    	Half-period in milliseconds used for cursor blinking. The default blink rate is 530ms. By setting this to zero, blinking can be disabled. A negative value hides the cursor entirely.
 *	cursorScrollMargin: number
 *    	How much extra space to always keep above and below the cursor when approaching the top or bottom of the visible view in a scrollable document.
 *    	Default is 0.
 *	cursorHeight: number
 *    	Determines the height of the cursor. Default is 1, meaning it spans the whole height of the line. For some fonts (and by some tastes) a smaller height (for example 0.85), which causes the cursor to not reach all the way to the bottom of the line, looks better
 *	resetSelectionOnContextMenu: boolean
 *    	Controls whether, when the context menu is opened with a click outside of the current selection, the cursor is moved to the point of the click. Defaults to true.
 *	workTime, workDelay: number
 *    	Highlighting is done by a pseudo background-thread that will work for workTime milliseconds, and then use timeout to sleep for workDelay milliseconds.
 *    	The defaults are 200 and 300, you can change these options to make the highlighting more or less aggressive.
 *	pollInterval: number
 *    	Indicates how quickly CodeMirror should poll its input textarea for changes (when focused). Most input is captured by events, but some things, like IME input on some browsers, don't generate events that allow CodeMirror to properly detect it. Thus, it polls.
 *    	Default is 100 milliseconds.
 *	flattenSpans: boolean
 *    	By default, CodeMirror will combine adjacent tokens into a single span if they have the same class. This will result in a simpler DOM tree, and thus perform better. With some kinds of styling (such as rounded corners), this will change the way the document looks. You can set this option to false to disable this behavior.
 *	addModeClass: boolean
 *    	When enabled (off by default), an extra CSS class will be added to each token, indicating the (inner) mode that produced it, prefixed with "cm-m-". For example, tokens from the XML mode will get the cm-m-xml class.
 *	maxHighlightLength: number
 *    	When highlighting long lines, in order to stay responsive, the editor will give up and simply style the rest of the line as plain text when it reaches a certain position. The default is 10 000. You can set this to Infinity to turn off this behavior.
 *	crudeMeasuringFrom: number
 *    	When measuring the character positions in long lines, any line longer than this number (default is 10 000), when line wrapping is off, will simply be assumed to consist of same-sized characters. This means that, on the one hand, measuring will be inaccurate when characters of varying size, right-to-left text, markers, or other irregular elements are present. On the other hand, it means that having such a line won't freeze the user interface because of the expensiveness of the measurements.
 *	viewportMargin: integer
 *    	Specifies the amount of lines that are rendered above and below the part of the document that's currently scrolled into view. This affects the amount of updates needed when scrolling, and the amount of work that such an update does. You should usually leave it at its default, 10. Can be set to Infinity to make sure the whole document is always rendered, and thus the browser's text search works on it. This will have bad effects on performance of big documents.
 * }
 *
 * Created by jinzk on 2015/12/9.
 */
define(['jquery', 'codemirror', 'codemirror/mode/meta'], function($, CodeMirror) {

    var CodeEditor = function(element, options) {
        this.$element = $(element);
        this.options = $.extend(true, {}, CodeEditor.DEFAULTS, options);
        // init mode
        if (options.mode && typeof options.mode === "string") {
            this.options.mode = CodeMirror.findModeByName(options.mode);
        } else if (options.ext) {
            this.options.mode = CodeMirror.findModeByExtension(options.ext);
        } else if (options.filename) {
            this.options.mode = CodeMirror.findModeByFileName(options.filename);
        } else if (options.mime) {
            this.options.mode = CodeMirror.findModeByMIME(options.mime);
        }
        if (typeof this.options.mode === "object") {
            if (!this.options.mode.mode) {
                this.options.mode = CodeEditor.DEFAULTS.mode;
            } else {
                this.options.mode = this.options.mode.mode;
            }
        } else {
            this.options.mode = this.options.mode || CodeEditor.DEFAULTS.mode;
        }
        this.editor = null;
        this.create();
    };

    CodeEditor.DEFAULTS = {
        value: "",
        mode: "null",
        theme: "default",
        lineNumbers: true,
        autofocus: true,
        readOnly: false,
        oncreated: null
    };

    CodeEditor.Editor = CodeMirror;

    CodeEditor.prototype = {
        create: function() {
            var def = $.Deferred();
            var requires = [], modeName = typeof this.options.mode === "string" ? this.options.mode : this.options.mode.mode;
            if (modeName !== "null") {
                requires.push('codemirror/mode/' + modeName + '/' +modeName);
            }
            if (this.options.theme && this.options.theme !== "default") {
                requires.push('rq/css!codemirror/theme/'+this.options.theme);
            }
            var that = this;
            var doRender = function() {
                that.$element.wrap('<div class="code-editor"></div>');
                if (that.$element.is("textarea")) {
                    that.editor = CodeMirror.fromTextArea(that.$element[0], that.options);
                } else {
                    that.editor = CodeMirror(function(elt) {
                        if (that.$element.is("input")) {
                            that.$element.val(elt);
                        } else {
                            that.$element.html(elt);
                        }
                    }, that.options);
                }
                if (that.editor && that.options.value) {
                    that.editor.setValue(that.options.value);
                }
                def.resolve(that.editor);
                typeof that.options.oncreated === "function" && that.options.oncreated.call(that, that.editor);
            };
            require(requires, doRender, function() {
                that.options.mode = "null";
                doRender();
            });
            return def.promise();
        },
        /**
         * 获取CodeMirror的实例化对象
         * @returns {CodeEditor.Editor}
         */
        editor: function() {
            return this.editor;
        },
        /**
         * 获取值
         * @param lineSep
         * @returns {*}
         */
        getValue: function(lineSep) {
            if (this.editor && typeof this.editor.getValue === "function") {
                return this.editor.getValue(lineSep);
            } else {
                return this.$element.val();
            }
        },
        /**
         * 设置值
         * @param val
         * @returns {*}
         */
        setValue: function(val) {
            if (this.editor && typeof this.editor.setValue === "function") {
                return this.editor.setValue(val);
            } else {
                return this.$element.val(val);
            }
        },
        /**
         * 设置配置项
         * @param option
         * @param value
         */
        setOption: function(option, value) {
            if (this.editor && typeof this.editor.setOption === "function") {
                this.editor.setOption(option, value);
            }
        },
        /**
         * 执行命令
         * @param cmd
         */
        exec: function(cmd) {
            if (this.editor && typeof this.editor.execCommand === "function") {
                return this.editor.execCommand(cmd);
            }
        },
        /**
         * 销毁editor
         */
        destroy: function() {
            if (this.editor && typeof this.editor.toTextArea === "function") {
                this.editor.toTextArea();
            }
            if (this.$element.parent().is(".code-editor")) {
                this.$element.unwrap();
            }
            this.$element.removeData('codeEditor.ui');
            return this.$element;
        }
    };

    var old = $.fn.codeEditor;

    $.fn.codeEditor = function(options) {
        var that = this, ret, args = Array.prototype.slice.call(arguments, 1);
        this.each(function() {
            var $this = $(this);
            var data = $this.data('codeEditor.ui');

            if (!data) $this.data('codeEditor.ui', (data = new CodeEditor(this, options)));
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

    $.fn.codeEditor.Constructor = CodeEditor;

    $.fn.codeEditor.noConflict = function() {
        $.fn.codeEditor = old;
        return this;
    };
});