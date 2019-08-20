/**
 * 文件上传组件 基于webuploader 支持单文件及多文件上传
 * 单文件上传 <input type="file">
 * 多文件上传 <input type="file" data-multiple="num"> num为限制最大上传文件数
 *
 * Created by jinzk on 2015/12/21.
 *
 * options = {
 *  browseLabel:
 *      {String} 选择文件按钮文本内容。默认为"选择"
 *  startLabel:
 *      {String} 开始上传按钮文本内容。默认为"上传"
 *  emptyText:
 *      {String} 未选择文件时显示的文本内容。默认为"尚未选择文件"
 *  url:
 *      {String} 服务器端接收和处理上传文件的脚本地址，格式为/file-upload/{handlerName}，其中handlerName为文件处理方式，可选local(本地存储)、content(不实际保存文件，只获取内容)等
 *  dnd:
 *      {Selector} [可选] [默认值：undefined] 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
 *  disableGlobalDnd:
 *      {Selector} [可选] [默认值：false] 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
 *  paste:
 *      {Selector} [可选] [默认值：undefined] 指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为document.body.
 *  multiSelection:
 *      Boolean 是否可以在文件浏览对话框中选择多个文件，true为可以，false为不可以。默认true，即可以选择多个文件。
 *      需要注意的是，在某些不支持多选文件的环境中，默认值是false。比如在ios7的safari浏览器中，由于存在bug，造成不能多选文件。当然，在html4上传方式中，也是无法多选文件的。
 *      另外，如果组件是基于input[type="file"]类型的元素生成，则该值将默认设为false。
 *  pick:
 *      {Selector, Object} [可选] [默认值：undefined] 指定选择文件的按钮容器，不指定则不创建按钮。
 *          id:
 *              {Seletor|dom} 指定选择文件的按钮容器，不指定则不创建按钮。注意 这里虽然写的是 id, 但是不是只支持 id, 还支持 class, 或者 dom 节点。
 *          label:
 *              {String} 请采用 innerHTML 代替
 *          innerHTML:
 *              {String} 指定按钮文字。不指定时优先从指定的容器中看是否自带文字。
 *          multiple:
 *              {Boolean} 是否开起同时选择多个文件能力。
 *  accept:
 *      {Arroy} [可选] [默认值：null] 指定接受哪些类型的文件。 由于目前还有ext转mimeType表，所以这里需要分开指定。
 *          title:
 *              {String} 文字描述
 *          extensions:
 *              {String} 允许的文件后缀，不带点，多个用逗号分割。
 *          mimeTypes:
 *              {String} 多个用逗号分割。
 *          如：
 *
 *          {
 *              title: 'Images',
 *              extensions: 'gif,jpg,jpeg,bmp,png',
 *              mimeTypes: 'image/*'
 *          }
 *  thumb:
 *      {Object} [可选] 配置生成缩略图的选项。
 *          默认为：
 *
 *          {
 *              width: 110,
 *              height: 110,
 *
 *              // 图片质量，只有type为`image/jpeg`的时候才有效。
 *              quality: 70,
 *
 *              // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
 *              allowMagnify: true,
 *
 *              // 是否允许裁剪。
 *              crop: true,
 *
 *              // 为空的话则保留原有图片格式。
 *              // 否则强制转换成指定的类型。
 *              type: 'image/jpeg'
 *          }
 *  compress:
 *      {Object} [可选] 配置压缩的图片的选项。如果此选项为false, 则图片在上传前不进行压缩。
 *          默认为：
 *
 *          {
 *              width: 1600,
 *              height: 1600,
 *
 *              // 图片质量，只有type为`image/jpeg`的时候才有效。
 *               quality: 90,
 *
 *              // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
 *              allowMagnify: false,
 *
 *              // 是否允许裁剪。
 *              crop: false,
 *
 *              // 是否保留头部meta信息。
 *              preserveHeaders: true,
 *
 *              // 如果发现压缩后文件大小比原来还大，则使用原来图片
 *              // 此属性可能会影响图片自动纠正功能
 *              noCompressIfLarger: false,
 *
 *              // 单位字节，如果图片大小小于此值，不会采用压缩。
 *              compressSize: 0
 *          }
 *  auto:
 *      {Boolean} [可选] [默认值：false] 设置为 true 后，不需要手动调用上传，有文件选择即开始上传。
 *  runtimeOrder:
 *      {Object} [可选] [默认值：html5,flash] 指定运行时启动顺序。默认会想尝试 html5 是否支持，如果支持则使用 html5, 否则则使用 flash.
 *      可以将此值设置成 flash，来强制使用 flash 运行时。
 *  prepareNextFile:
 *      {Boolean} [可选] [默认值：false] 是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
 *  chunked:
 *      {Boolean} [可选] [默认值：false] 是否要分片处理大文件上传。chunkSize大于0时为true，不支持自定义。
 *  chunkSize:
 *      {Boolean} [可选] [默认值：5242880] 如果要分片，分多大一片？ 默认大小为5M.
 *  chunkRetry:
 *      {Boolean} [可选] [默认值：2] 如果某个分片由于网络问题出错，允许自动重传多少次？
 *  threads:
 *      {Boolean} [可选] [默认值：3] 上传并发数。允许同时最大上传进程数。
 *  formData:
 *      {Object} [可选] [默认值：{}] 文件上传请求的参数表，每次发送都会发送此对象中的参数。
 *  fileVal:
 *      {Object} [可选] [默认值：'file'] 设置文件上传域的name。
 *  method:
 *      {Object} [可选] [默认值：'POST'] 文件上传方式，POST或者GET。
 *  sendAsBinary:
 *      {Object} [可选] [默认值：false] 是否已二进制的流的方式发送文件，这样整个上传内容php://input都为文件内容， 其他参数在$_GET数组中。
 *  fileNumLimit:
 *      {int} [可选] [默认值：undefined] 验证文件总数量, 超出则不允许加入队列。
 *  fileSizeLimit:
 *      {int} [可选] [默认值：undefined] 验证文件总大小是否超出限制, 超出则不允许加入队列。
 *  fileSingleSizeLimit:
 *      {int} [可选] [默认值：undefined] 验证单个文件大小是否超出限制, 超出则不允许加入队列。
 *  duplicate:
 *      {Boolean} [可选] [默认值：undefined] 去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
 *  disableWidgets:
 *      {String, Array} [可选] [默认值：undefined] 默认所有 Uploader.register 了的 widget 都会被加载，如果禁用某一部分，请通过此 option 指定黑名单。
 *  onstart:
 *      {Function} 当文件开始上传时触发。this指针指向当前FileUpload对象，带有参数：file（当前file相关信息）
 *  onadded:
 *      {Function} 当文件加入队列时触发。this指针指向当前FileUpload对象，带有参数：files（当前file相关信息）
 *  onprogress:
 *      {Function} 文件正在被上传中触发。this指针指向当前FileUpload对象，带有参数：file（当前file相关信息）、percentage（上传进度）
 *  oncomplete:
 *      {Function} 队列中所有文件上传完成后触发。this指针指向当前FileUpload对象
 *  onsinglecomplete:
 *      {Function} 文件上传完成后触发。this指针指向当前FileUpload对象,带有参数：file（当前file相关信息
 *  onerror:
 *      {Function} 上传发生错误时触发。this指针指向当前FileUpload对象，带有参数：file（当前file相关信息）、response（服务器端返回的数据）
 * }
 **/
define(['App', 'jquery', 'jq/webuploader'], function(App, $, webUploader) {

    var FileUpload = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, FileUpload.DEFAULTS, options);
        if (this.$element.is('input[type="file"]') && !this.$element.attr('data-multiple')) {
            this.options.multiSelection = false;
        }

        // init url
        var url = this.options.url;
        if (url && typeof url === "string" && !/^((https?|s?ftp):)|(file:\/)\/\//.test(url)) {
            this.options.url = App.getRootUrl() + (url.charAt(0) == "/" ? url : '/' + url);
        }

        this.guid = webUploader.guid('file-input-');

        this.uploaded = false;
        this.errorCalled = false;

        this.create();
        this.init();
    };

    FileUpload.DEFAULTS = {
        browseLabel: "选择",
        startLabel: "上传",
        emptyText: "尚未选择文件",
        accept: [],
        fileSizeLimit: undefined,
        multiSelection: true,
        sendAsBinary: false,
        formData: undefined,
        chunkSize: 5 * 1024 * 1024,
        threads: 3,
        method: "POST",
        onstart: null,
        onadded: null,
        onprogress: null,
        oncomplete: null,
        onsinglecomplete: null,
        onbeforesend: null,
        onerror: null,
        onvalidatorerror:null
    };

    FileUpload.prototype.create = function() {
        if (this.$element.is('input[type="file"]') && !this.$element.attr('data-multiple')) {
            this.$element.wrap('<div id="'+this.guid+'" class="control-file-input"></div>').hide();
            this.$wrapper = this.$element.parent();

            this.$wrapper.append(
                '<div class="progress-bar" role="progressbar" style="width: 0;">' +
                '<span class="sr-only">0%</span>' +
                '</div>'
            );
            this.$progressBar = this.$wrapper.find(".progress-bar:first");

            this.$wrapper.append('<div class="file-upload-item"></div>');
            this.$fileWrapper = this.$wrapper.find(".file-upload-item:first");

            this.$fileWrapper.append('<span class="file-name"></span>');
            this.$fileName = this.$wrapper.find(".file-name:first").text(this.options.emptyText);

            this.$fileWrapper.append(
                '<div class="file-controls">' +
                '<a class="btn btn-remove"></a>' +
                '<a class="btn btn-start"><i class="fa fa-upload"></i>'+this.options.startLabel+'</a>' +
                '<a class="btn btn-browse"><i class="fa fa-folder-open"></i>'+this.options.browseLabel+'</a>' +
                '</div>'
            );
            this.$browseBtn = this.$wrapper.find(".btn-browse:first");
            this.$startBtn = this.$wrapper.find(".btn-start:first").hide();
            this.$removeBtn = this.$wrapper.find(".btn-remove:first").hide();
        } else if (this.$element.is('input[type="file"]') && this.$element.attr('data-multiple')) {
            this.$wrapper = this.$element.parent();
            this.$element.remove();
            this.$wrapper.append(
                '<div style="width:100%;max-height:200px;">' +
                '<a class="btn btn-start"><i class="fa fa-upload"></i>'+this.options.startLabel+'</a>' +
                '<a class="btn btn-browse"><i class="fa fa-folder-open"></i>'+this.options.browseLabel+'</a>' +
                '<div class="progress pull-right" style="width:30%;margin-right:10px;margin-top:5px;margin-bottom:0;"></div>' +
                '<div class="filearea"></div>' +
                '</div>'
            );
            this.$progress = this.$wrapper.find(".progress:first").hide();
            this.$browseBtn = this.$wrapper.find(".btn-browse:first");
            this.$startBtn = this.$wrapper.find(".btn-start:first");
            this.$filearea = this.$wrapper.find(".filearea:first");
        }
        this.listen();
    };

    FileUpload.prototype.init = function() {
        var that = this;
        this.uploader = new webUploader.Uploader({
            runtimeOrder: "html5,flash",
            dnd: this.options.dnd,
            disableGlobalDnd: this.options.disableGlobalDnd || true,
            thump: this.options.thump,
            paste: this.options.paste || document.body,
            compress: this.options.compress,
            auto: this.options.auto || false,
            prepareNextFile: this.options.prepareNextFile,
            chunked: this.options.chunkSize > 0 ? true : false,
            chunkSize: this.options.chunkSize,
            chunkRetry: this.options.chunkRetry || 2,
            threads: this.options.threads,
            formData: this.options.formData || {},
            fileVal: this.options.fileVal || 'file',
            sendAsBinary: this.options.sendAsBinary || false,
            fileNumLimit: parseInt(this.$element.attr('data-multiple')),
            fileSizeLimit: this.options.fileSizeLimit,
            fileSingleSizeLimit: this.options.fileSingleSizeLimit,
            duplicate: this.options.duplicate,
            disableWidgets: this.options.disableWidgets,

            pick: {
                id: '.btn-browse',
                multiple: this.options.multiSelection
            },
            method: this.options.method,
            server: this.options.url,

            multiSelection: this.options.multiSelection,

            accept: this.options.accept || null,

            // 当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列
            onBeforeFileQueued: function(file) {
                /*if (!that.options.multiSelection) {
                    $.each(that.uploader.getFiles(), function(i, file){
                        that.uploader.removeFile(file, true);
                    });
                }*/
            },

            // 当文件被加入队列以后触发
            onFileQueued: function(file) {
                if (that.$element.is('input[type="file"]') && !that.$element.attr('data-multiple')) {
                    if (that.options.startLabel.length > 0) {
                        that.enableStartButton();
                    }
                    that.$fileName.text(file.name + '(' + App.formatBytesStrict(file.size) + ')').attr('id', file.id);
                    that.$wrapper.removeClass("file-input-error");
                    that.$progressBar.css("width", 0);
                    that.disableBrowseButton();
                    that.enableRemoveButton();
                } else {
                    that.$filearea.append(
                        '<div class="file" id="' + file.id + '">' +
                        '<i class="fa fa-file-o"></i>' +
                        '<label class="control-label" fileName="' + file.name + '">' +
                            file.name + ' (' + App.formatBytesStrict(file.size) + ')' +
                        '</label>' +
                        '<i class="fa fa-remove pull-right" data-id="' + file.id + '"></i>' +
                        '</div>'
                    );
                    $(".fa-remove").off("click").on('click',function() {
                        that.uploader.removeFile($(this).attr("data-id"), true);
                    });
                }
                typeof that.options.onadded === "function" && that.options.onadded.apply(that, arguments);
            },

            // 当文件被移除队列后触发
            onFileDequeued: function(file) {
                that.uploaded = false;
                if (that.$element.is('input[type="file"]') && !that.$element.attr('data-multiple')) {
                    that.disableStartButton();
                    that.disableRemoveButton();
                    that.enableBrowseButton();
                    that.$fileName.text(that.options.emptyText).removeAttr('id');
                } else {
                    $('#' + file.id).remove();
                    that.$progress.hide();
                }
            },

            // 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次
            onUploadBeforeSend: function(obj, file, headers) {
                typeof that.options.onbeforesend === "function" && that.options.onbeforesend.apply(that, arguments);
            },

            // 当开始上传流程时触发
            onStartUpload: function(file) {
                if (that.$element.is('input[type="file"]') && !that.$element.attr('data-multiple')) {
                    that.disableBrowseButton();
                    that.disableStartButton();
                    that.enableRemoveButton();
                } else {
                    that.$progress
                        .show()
                        .empty()
                        .append(
                        '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>'
                    );
                    that.$progressBar = that.$wrapper.find(".progress-bar:first");
                }
                typeof that.options.onstart === "function" && that.options.onstart.apply(that, arguments);
            },

            // 某个文件开始上传前触发，一个文件只会触发一次
            onUploadStart: function(file) {

            },

            // 当开始上传流程暂停时触发
            onStopUpload: function(file) {

            },

            // 上传过程中触发，携带上传进度
            onUploadProgress: function(file, percentage) {
                that.$progressBar.css('width', percentage * 100 + "%");
                if (that.$element.is('input[type="file"]') && !that.$element.attr('data-multiple')) {
                    that.$progressBar.children("span").text(parseInt(percentage * 100) + "%");
                } else {
                    that.$progressBar.attr('aria-valuenow', percentage * 100);
                    that.$progressBar.text(parseInt(percentage * 100) + '%');
                }
                typeof that.options.onprogress === "function" && that.options.onprogress.apply(that, arguments);
            },

            // 当队列中所有文件被上传完时触发
            onUploadFinished: function() {
                var files = that.uploader.getFiles();
                that.uploaded = true;
                if (that.$element.is('input[type="file"]') && !that.$element.attr('data-multiple')) {
                    that.disableStartButton();
                    that.disableRemoveButton();
                    that.enableBrowseButton();
                }
                var args = Array.prototype.slice.call(arguments),
                    response = that.$wrapper.data('response.ui.fileupload');
                if (!that.options.multiSelection) {
                    args[0] = files[0];
                }
                if (response && !response.error) {
                    args[1] = response;
                    if (typeof that.options.oncomplete === "function") {
                        if ($.support.transition
                            && parseFloat(that.$progressBar.css('width')) < 100
                            && parseFloat(that.$progressBar.css('transition-duration')) > 0) {
                            that.$progressBar.one($.support.transition.end, function() {
                                that.options.oncomplete.apply(that, args);
                            });
                        } else {
                            that.options.oncomplete.apply(that, args);
                        }
                    }
                } else if (!this.errorCalled) {
                    args[1] = {error: true, message: "上传失败!" + response.message};
                    that.errorCalled = true;
                    that.$wrapper.addClass("file-input-error");
                    typeof that.options.onerror === "function" && that.options.onerror.apply(that, args);
                }
            },

            // 当队列中的某一个文件上传完成后触发
            onUploadComplete: function(file) {
                typeof that.options.onsinglecomplete === "function" && that.options.onsinglecomplete.apply(that, arguments);
                /*var response = $.extend({}, responseObject);
                try {
                    response.response = JSON.parse(responseObject.response);
                } catch (e) {
                    response.response = responseObject.response;
                }
                that.$fileName.data('response.ui.fileupload', response);*/
            },

            // 当文件上传成功时触发
            onUploadSuccess: function(file, response) {
                that.$wrapper.data('response.ui.fileupload', response);
            },

            // 当文件上传出错时触发
            onUploadError: function(file, response) {
                response = response === 'F_IMAGE_LOAD' ? '图片解析失败或格式错误' : response;
                response = $.extend({},{}, {"error": true, "message": response});
                that.$wrapper.data('response.ui.fileupload', response);
                if (!that.errorCalled) {
                    that.errorCalled = true;
                    that.$wrapper.addClass("file-input-error");
                }
            },
            onUploadAccept: function(file, ret, fn) {
                if (typeof(ret) === "string") {
                    fn(ret);
                    return false;
                }
                if (ret && ret.error == true) {
                    fn(ret.message);
                    return false;
                }
                if (ret && (ret.error_code || ret.error_desc)) {
                    var code = ret.error_code + ':' || '';
                    var desc = ret.error_desc || '';
                    fn(code + desc);
                    return false;
                }
            },

            // 当validate不通过时，会以派送错误事件的形式通知调用者
            onError: function(err) {
                switch (err) {
                    case 'Q_EXCEED_NUM_LIMIT': err = '文件个数超出限制';break;
                    case 'Q_EXCEED_SIZE_LIMIT': err = '文件总大小超出限制';break;
                    case 'F_EXCEED_SIZE': err = '文件大小超出限制';break;
                    case 'F_DUPLICATE': err = '文件选择重复';break;
                    case 'Q_TYPE_DENIED': err = '文件类型不匹配或大小为0';break;
                    default: break;
                }
                typeof that.options.onvalidatorerror === "function" && that.options.onvalidatorerror.apply(that, arguments);
            }
        });
        $('.webuploader-pick').removeClass('webuploader-pick');
    };

    FileUpload.prototype.listen = function() {
        this.$wrapper.on("click", ".btn-start", $.proxy(function() {
            this.uploader.upload();
        }, this));
        this.$wrapper.on("click", ".btn-remove", $.proxy(function() {
            if (this.uploader) {
                this.uploader.stop();
                this.uploader.removeFile(this.$fileName.attr('id'));
            }
        }, this));
    };

    FileUpload.prototype.disableBrowseButton = function() {
        this.$browseBtn
            .prop('disabled', false)
            .css('right', 0)
            .hide();
        if (this.uploader) {
            this.refresh();
        }
        return this.$element;
    };

    FileUpload.prototype.enableBrowseButton = function() {
        this.$browseBtn
            .show()
            .css('right', (this.$startBtn.is(":visible") ? this.$startBtn.outerWidth(true) : 0) + (this.$removeBtn.is(":visible") ? this.$removeBtn.outerWidth(true) : 0))
            .prop('disabled', false);
        if (this.uploader) {
            this.refresh();
        }
        return this.$element;
    };

    FileUpload.prototype.disableStartButton = function() {
        this.$startBtn
            .prop('disabled', false)
            .css('right', 0)
            .hide();
        return this.$element;
    };

    FileUpload.prototype.enableStartButton = function() {
        this.$startBtn
            .show()
            .css('right', this.$removeBtn.outerWidth(true))
            .prop('disabled', false);
        return this.$element;
    };

    FileUpload.prototype.disableRemoveButton = function() {
        this.$removeBtn
            .prop('disabled', false)
            .hide();
        return this.$element;
    };

    FileUpload.prototype.enableRemoveButton = function() {
        this.$removeBtn
            .show()
            .prop('disabled', false);
        return this.$element;
    };

    FileUpload.prototype.getFile = function() {
        var file;
        if (this.uploader) {
            file = this.uploader.getFile(this.$fileName.attr('id'));
        }
        return file;
    };
    FileUpload.prototype.getFiles = function() {
        var files;
        if (this.uploader) {
            files = this.uploader.getFiles();
        }
        return files;
    };

    FileUpload.prototype.startUpload = function() {
        if (this.uploader && !this.isUploaded()) {
            this.uploader.upload.apply(this.uploader, arguments);
        }
        return this.$element;
    };

    FileUpload.prototype.stopUpload = function() {
        this.uploader && this.uploader.stop.apply(this.uploader, arguments);
        return this.$element;
    };

    FileUpload.prototype.isUploaded = function() {
        return this.uploaded;
    };

    FileUpload.prototype.refresh = function() {
        this.uploader && this.uploader.refresh();
        return this.$element;
    };

    FileUpload.prototype.setOption = function(key, value) {
        if (arguments.length > 1) {
            this.options[key] = value;
            this.uploader && this.uploader.option(key, value);
        } else if (arguments.length == 1) {
            return this.options[key];
        }
        return this.$element;
    };

    FileUpload.prototype.getOption = function(key) {
        var value;
        if (key) {
            value = this.options[key];
        }
        return value;
    };

    FileUpload.prototype.setOptions = function(obj) {
        if (obj && typeof obj === "object") {
            var that = this;
            $.each(obj, function(key, value) {
                that.setOption(key, value);
            });
        }
        return this.$element;
    };

    var old = $.fn.fileUpload;

    $.fn.fileUpload = function(options) {
        var that = this, ret, args = Array.prototype.slice.call(arguments, 1);
        this.each(function() {
            var $this = $(this);
            var data = $this.data('fileUpload.ui');

            if (!data) $this.data('fileUpload.ui', (data = new FileUpload(this, options)));
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

    $.fn.fileUpload.noConflict = function() {
        $.fn.fileUpload = old;
        return this;
    };

});