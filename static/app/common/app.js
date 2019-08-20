define(['jquery', 'common/status_label', 'crypto', 'moment', 'common/ui/modal'], function ($, StatusLabel, CryptoJS, Moment, Modal) {
    return {
        $doc: $(document),
        $body: $(document.body),
        is$: function (o) {
            return o && o instanceof $;
        },
        wsUrl: function (data) {
            var wsParam;
            if (data != null) {
                if (typeof data !== "object") {
                    wsParam = {};
                    wsParam['routing-key'] = $.trim(data);
                } else {
                    wsParam = $.extend({}, data);
                    wsParam['routing-key'] = $.trim(data.routingKey || data['routingKey']);
                    delete wsParam.routingKey;
                }
            }
            return this.getRootUrl('/websocket', wsParam);
        },
        setNotePos: function (top) {
            top = top || 'top';
            Modal.configDefaultOptions(
                ['processing', 'info', 'warning', 'error', 'success'],
                {
                    position: "right " + top
                }
            );
        },
        /**
         * 加亮显示文本内容
         * @param text {String}
         *          加亮文本
         * @param start {Number}
         *          起始位置。如果是负数，则该参数规定的是从字符串的尾部开始算起的位置。也就是说，-1 指字符串的最后一个字符，-2 指倒数第二个字符，以此类推。
         * @param end {Number}
         *          结束位置。若未指定此参数，则要提取的子串包括 start 到原字符串结尾的字符串。如果该参数是负数，那么它规定的是从字符串的尾部开始算起的位置。
         * @returns {String}
         *          加亮后的包含html标签的字符串
         */
        highlight: function (text, start, end) {
            if (!text || typeof text !== "string") return "";
            var stext = '<span class="text-highlight">[', etext = ']</span>';
            start = parseInt(start);
            isNaN(start) && (start = 0);
            end = parseInt(end);
            (isNaN(end) || end > text.length) && (end = text.length);
            return (text.slice(0, start) + stext + text.slice(start, end) + etext + text.slice(end, text.length));
        },
        getModelType: function (data) {
            switch (data) {
                case "NaiveBayes":
                    return '多元分类-朴素贝叶斯';
                case "DecisionTreeClassifier":
                    return '多元分类-决策树';
                case "RandomForestClassifier":
                    return '多元分类-随机森林';
                case "LogisticRegression":
                    return '多元分类-逻辑回归';
                case "MultilayerPerceptronClassifier":
                    return '多元分类-多层感知';
                case "OneVsRest":
                    return '多元分类-OneVsRest';
                case "LinearSVC":
                    return '多元分类-LinearSVC';
                case "GBTClassifier":
                    return '多元分类-GBT(梯度提升树)';
                case "RandomForestRegressor":
                    return '回归分析-随机森林';
                case "LinearRegression":
                    return '回归分析-线性回归';
                case "DecisionTreeRegressor":
                    return '回归分析-决策树回归';
                case "GBTRegressor":
                    return '回归分析-GBT(梯度提升树)';
                case "IsotonicRegression":
                    return '回归分析-保序回归';
                case "AFTSurvivalRegression":
                    return '回归分析-生存回归';
                case "GeneralizedLinearRegression":
                    return '回归分析-广义线性回归';
                case "ALS":
                    return '协同推荐-协同过滤';
                case "KMeans":
                    return '聚类分析-K均值';
                case "BisectingKMeans":
                    return '聚类分析-二分K均值';
                case "GaussianMixture":
                    return '聚类分析-高斯混合';
                case "LDA":
                    return '聚类分析-LDA';
            }
            return "N/A";
        },
        getModelMethod: function (data) {
            switch (data) {
                case "NaiveBayes":
                    return '朴素贝叶斯';
                case "DecisionTreeClassifier":
                    return '决策树';
                case "RandomForestClassifier":
                    return '随机森林';
                case "LogisticRegression":
                    return '逻辑回归';
                case "MultilayerPerceptronClassifier":
                    return '多层感知';
                case "OneVsRest":
                    return 'OneVsRest';
                case "RandomForestRegressor":
                    return '随机森林';
                case "LinearRegression":
                    return '线性回归';
                case "DecisionTreeRegressor":
                    return '决策树';
                case "GBTRegressor":
                    return 'GBT(梯度提升树)';
                case "ALS":
                    return '协同过滤';
                case "KMeans":
                    return 'K均值';
                case "BisectingKMeans":
                    return '二分K均值';
                case "GaussianMixture":
                    return '高斯混合';
                case "LinearSVC":
                    return 'LinearSVC';
                case "GBTClassifier":
                    return 'GBT(梯度提升树)';
                case "IsotonicRegression":
                    return '保序回归';
                case "AFTSurvivalRegression":
                    return '生存回归';
                case "GeneralizedLinearRegression":
                    return '广义线性回归';
                case "LDA":
                    return 'LDA';
                default:
                    break;
            }
            return "N/A";
        },
        shortContent: function (content, len, ext) {
            content = content || "";
            len = len || 50;
            ext = ext || "…";
            var l = -1;
            for (var i = 0; i < content.length; i++) {
                var ch = content.charAt(i);
                if (/^[\x00-\xff]$/.test(ch)) {
                    l += 1;
                } else {
                    l += 0.5;
                }
                if (l >= len) {
                    break;
                }
            }
            if (l < 0) l = 0;
            return content.substr(0, l) + ext;
        },
        statusLabel: function (status, label) {
            return StatusLabel.compile(status, label);
        },
        statusLabelTitle: function (status, label) {
            return StatusLabel.compile2Title(status, label);
        },
        parseStatus: function (status) {
            return StatusLabel.parseStatus(status);
        },
        /**
         * 加密文本显示，用于html元素中
         * @param text
         * @returns {*}
         */
        pwdHtml: function (text, withoutControl) {
            if (!text) return "";
            text = $.trim(text + "");
            withoutControl = withoutControl || false;
            var masked = text.substr(0, 10).replace(/./g, "&bull;");
            return (
                withoutControl ? masked :
                    '<span class="pwd-masked-static" data-original-pwd="' + this.Base64.encode(text) + '">' + masked + '</span>' +
                    '<a class="btn-icon btn-pwd-masked"></a>'
            );
        },
        /**
         * 加密文本显示，用于text文本中
         * @param text
         * @returns {*}
         */
        pwdText: function (text) {
            if (!text) return "";
            text = text + "";
            return text.substr(0, 10).replace(/./g, "*");
        },
        Base64: {
            encode: function (a) {
                var wordArray = CryptoJS.enc.Utf8.parse(a);
                return CryptoJS.enc.Base64.stringify(wordArray);
            },
            decode: function (a) {
                var wordArray = CryptoJS.enc.Base64.parse(a);
                return CryptoJS.enc.Utf8.stringify(wordArray);
            }
        },
        /**
         * 容量单位
         */
        BytesUnit: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        /**
         * 基于 1000 格式化 “数据传输速度” 和 “硬盘存储空间” 等概念性的容量单位
         * @param bytes {Number|String}
         *          要转换的容量数据，可为数字或字符串，字符串时可附缀容量单位
         * @param toUnit {String}
         *          要转换成的单位，有效值为 BytesUnit 中的数组项，大小写不限
         * @returns {String}
         *          格式化后的字符串
         */
        formatBytes: function (bytes, toUnit) {
            return this.formatBytesByRadixUnit(bytes, 1000, toUnit);
        },
        /**
         * 基于 1024 格式化 “内存” 或者 “CPU高速缓存容量” 等实际存储类的容量单位
         * @param bytes {Number|String}
         *          要转换的容量数据，可为数字或字符串，字符串时可附缀容量单位
         * @param toUnit {String}
         *          要转换成的单位，有效值为 BytesUnit 中的数组项，大小写不限
         * @returns {String}
         *          格式化后的字符串
         */
        formatBytesStrict: function (bytes, toUnit) {
            return this.formatBytesByRadixUnit(bytes, 1024, toUnit);
        },
        /**
         * 按照指定的基数 radix 和 单位 toUnit 格式化容量单位
         * @param bytes {Number|String}
         *          要转换的容量数据，可为数字或字符串，字符串时可附缀容量单位
         * @param radix {Number}
         *          转换基数，常见为 1000 或 1024
         * @param toUnit {String}
         *          要转换成的单位，有效值为 BytesUnit 中的数组项，非法单位参数将自由转换结果单位。大小写不限
         * @returns {String}
         *          格式化后的字符串
         */
        formatBytesByRadixUnit: function (bytes, radix, toUnit) {
            var _NAN_ = "N/A";
            if (typeof bytes === "undefined") {
                return _NAN_;
            }
            if (typeof radix === "string" && !toUnit) {
                toUnit = radix;
                radix = 1000;
            } else {
                radix = parseInt(radix) || 1000;
            }
            if (!~$.inArray(toUnit, this.BytesUnit)) {
                toUnit = "";
            }
            var suffixIndex = 0, suffix = toUnit;
            if (typeof bytes !== "number") {
                var bytesTmp = parseFloat(bytes);
                if (isNaN(bytesTmp)) {
                    return _NAN_;
                }
                var regexp = new RegExp("^-?(\\d*(?:\\.\\d+)?)\\s*(" + this.BytesUnit.join("|") + ")$", "i"),
                    matches;
                if (matches = bytes.match(regexp)) {
                    if (suffix = matches[2]) {
                        suffix = suffix.toUpperCase();
                        suffixIndex = $.inArray(suffix, this.BytesUnit);
                    }
                    if (suffixIndex < 0) {
                        suffixIndex = 0;
                    }
                    bytesTmp *= Math.pow(radix, suffixIndex);
                }
                bytes = bytesTmp;
            }
            if (!bytes) {
                return '0' + (suffix ? " " + suffix : "");
            }
            var round = function (num, precision) {
                if (typeof num !== "number" || typeof precision !== "number") {
                    return Number.NaN;
                }
                try {
                    if (Math.abs(num) >= Math.pow(10, 8) || Math.abs(num) < Math.pow(10, -precision)) {
                        return num.toExponential(precision);
                    }
                    return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
                } catch (e) {
                    return Number.NaN;
                }
            };
            var toSuffixIndex = toUnit ? $.inArray(toUnit, this.BytesUnit) : -1,
                index = toSuffixIndex < 0 ? this.BytesUnit.length - 1 : toSuffixIndex,
                boundary = Math.pow(radix, index);
            if (toSuffixIndex < 0) {
                // 自动计算单位
                while (bytes < boundary && index > 0) {
                    boundary /= radix;
                    index--;
                }
            }
            var rounded = round(bytes / boundary, 2);
            if (isNaN(rounded)) {
                return _NAN_;
            }
            return rounded + " " + this.BytesUnit[index];
        },
        createUuid: function () {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
                uuid = new Array(36), rnd = 0, r;
            for (var i = 0; i < 36; i++) {
                if (i == 8 || i == 13 || i == 18 || i == 23) {
                    uuid[i] = '-';
                } else if (i == 14) {
                    uuid[i] = '4';
                } else {
                    if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                    r = rnd & 0xf;
                    rnd = rnd >> 4;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
            return uuid.join('');
        },
        uiSelect: function (options, renderTo) {
            var defaults = {wrapper: true, className: "form-control"};
            if (!$.isPlainObject(options)) {
                options = $.extend({}, {list: options}, defaults);
            } else {
                options = $.extend({}, defaults, options);
            }
            var inHtml = this.template.render('ui-select', options);
            try {
                if (renderTo) {
                    if (!(renderTo instanceof $)) {
                        renderTo = $(renderTo);
                    }
                    renderTo.append(inHtml);
                }
            } catch (e) {
            }
            return inHtml;
        },
        loginCache: function () {
            // 缓存用户信息
            this.setCache('user', this.cookie.get('user_ml') || null);
            this.setCache('uid', this.cookie.getUid() || '');
            this.setCache('uname', this.cookie.getUname() || '');
            this.setCache('login_model', this.cookie.get('login_model_ml') || '');
        },
        getUser: function () {
            return this.getCache('user');
        },
        setUser: function (user) {
            this.setCache('user', user);
        },
        getUid: function () {
            return this.getCache('user_id');
        },
        getUname: function () {
            return this.getCache('uname');
        },
        getLoginMode: function () {
            return this.getCache('login_model');
        },
        permission: {
            compile: function (html) {
                var self = this, $html;
                if (!self.is$(html)) {
                    if (!/<[\w\W]+>/.test(html)) {
                        // 非html字符串不处理
                        return html;
                    }
                    if (typeof html === "string") {
                        // 处理模板语法
                        html = $.trim(html)
                            .replace(/\{\{([^\}]*)\}\}/g, '<template>{{$1}}</template>');
                    }
                    try {
                        $html = $(html);
                    } catch (e) {
                        $html = html;
                    }
                    if (!$html.length) {
                        $html = html;
                    }
                } else {
                    $html = html;
                }

                if (self.is$($html)) {
                    $html.find('[data-permission]').each(function () {
                        var $this = $(this);
                        if (!self.permission.has($this) && !$this.is("th") && !$this.is("td")) {
                            $this.remove();
                        }
                    });
                    var htmlText = '';
                    $html.each(function () {
                        var $this = $(this);
                        htmlText += ($this.prop('outerHTML') || $this.text() || '');
                    });
                    $html = htmlText;
                } else {
                    $html = $.trim($html);
                }

                // 处理模板语法
                $html = $html.replace(/<template>\{\{([^\}]*)\}\}<\/template>/g, "{{$1}}");

                return $html;
            },
            has: function (dataPermission) {
                if (this.is$(dataPermission)) {
                    dataPermission = dataPermission.data('permission');
                }
                var loginMode = this.getLoginMode(),
                    permissions = (dataPermission || '').split(',');
                return ($.inArray(loginMode, permissions) > -1);
            }
        },
        logout: function () {
            this.clearLogin();
            this.loginCache();
            var curUrl = this.getState('url');
            this.go(this.getUrl('/login'));
        }
    };
});
