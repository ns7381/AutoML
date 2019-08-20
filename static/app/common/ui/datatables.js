/**
 * 表格初始化
 */
define([
    'App', 'jquery', 'jq/dataTables-bs3', 'jq/dataTables/addon/fixedColumns', 'bs/tooltip'
], function(App, $) {

    var window = window || this || {},
        document = document || window.document || {};

    var $doc = $(document);

    var CELL_WIDTH = {
        'check': 16,
        'opt': "8em",
        'opt-2': '6em',
        'opt-1': '4em',
        'datetime': "10em",
        'date': "5em",
        'time': "4em",
        'name': "15em",
        'ip': "8em",
        'host': "11em"
    };

    var cellWidth = function(key) {
        var w;
        key = $.trim(key);
        if (key) {
            w = CELL_WIDTH[key] || key;
        }
        return w;
    };

    // 全局 dataTable 设置
    if ($.fn.dataTable) {
        $.extend(true, $.fn.dataTable.defaults, {
            "dom": 'rt<"table-bottom clearfix"<"pull-left"il><"pull-right"p>>',
            "language": {
                "processing": '<i class="fa fa-spinner fa-spin"></i>&ensp;正在加载...',
                "loadingRecords": '<i class="fa fa-spinner fa-spin"></i>&ensp;正在加载...',
                "search": '_INPUT_<a class="btn-search"><i class="fa fa-search"></i></a>',
                "lengthMenu": "每页显示 _MENU_ 条",
                "info": "显示第 _START_~_END_ 条记录 / 共 <span class='nums'>_TOTAL_</span> 条",
                "infoEmpty": "显示 0 条记录",
                "paginate": {
                    "previous": '<i class="fa fa-angle-left"></i>',
                    "next": '<i class="fa fa-angle-right"></i>'
                },
                "paginationType": "two_button",
                "emptyTable": '<div class="text-center"><i class="fa fa-info-circle text-warning"></i>&ensp;没有记录</div>',
                "zeroRecords": '<div class="text-center"><i class="fa fa-info-circle text-warning"></i>&ensp;没有查询到符合条件的记录</div>',
                "infoFiltered": ""//"(总 _MAX_ 条)"
            }
        });
    }

    /**
     * 使用 dataTables 组件初始化表格
     * @param tableSelector
     *          表格选择器 或 表格的jQuery对象
     * @param options
     *          初始化表格时的配置项，若为零配置此参数可忽略，后一个参数往前提
     * @param complete
     *          初始化后的回调方法，此参数也可直接写在options中，对应键是initComplete
     *          function($table, settings, json) {
     *              // do something
     *          }
     * @returns dataTable API实例，为 NULL 则表示表格未找到或未初始化成功
     */
    var initDataTable = function(tableSelector, options, complete) {
        if($.isFunction(options)) {
            complete = options;
            options = null;
        }
        if(tableSelector != null) {
            var $table;

            try {
                if (tableSelector instanceof $) {
                    $table = tableSelector;
                } else {
                    $table = $(tableSelector);
                }
            } catch (e) {
                $table = null;
            }

            if (!$table || !$table.length) return null;

            var tableId = $table.attr('id');

            if (tableId) {
                $table.siblings('.table-top:first').attr('id', tableId + "_top");
            }

            var th_num = $table.find("thead th").length;

            if ($table.find("tfoot")) {
                var td_num = $table.find("tfoot td").length;
                if (td_num > 0) {
                    if (th_num > td_num) {
                        $table.find("tfoot td:last").attr("colspan",th_num-td_num+1);
                    } else if (th_num < td_num) {
                        $table.find("thead th:last").attr("colspan",td_num-th_num+1);
                    }
                }
            }

            // init options
            if(options && $.isFunction(options.initComplete)) {
                complete = options.initComplete;
                delete options.initComplete;
            }

            var baseOptions = {
                'autoWidth': true,
                'ordering': false, // 禁用排序
                'processing': true,  // 显示加载效果
                // 保存表格状态
                /*
                 'stateSave' : true,
                 'stateSaveCallback': function(settings, data) {
                 $(settings.nTable).data('saveData.dt', data);
                 },
                 'stateLoadCallback': function(settings) {
                 return $(settings.nTable).data('saveData.dt');
                 },
                 */
                // 设置显示滚动条
                'scrollX': true,
                'scrollCollapse': true,
                'createdRow': function (row, data, index) {
                    var $row = $(row), rowApi = this.api().row(index);
                    $row.attr('index', data.id || index).data('rowData.dt', rowApi.data());
                    var btnOptSelector = ".btn-opt, .btn-opt a, .btn-opt ~ .dropdown a";
                    $row.find(btnOptSelector).each(function () {
                        $(this).data('row.dt', rowApi);
                    });
                    $row.on("click", btnOptSelector, rowApi, function (e) {
                        if (!$(this).data('row.dt')) {
                            $(this).data('row.dt', e.data);
                        }
                    });
                    $row.on('mouseleave', '.btn-opt', function(e) {
                        $('.tooltip').hide();
                    });
                    $row = null;
                    rowApi = null;
                },
                'initComplete': function () {
                    var tableApi = this.api(),
                        settings = this.fnSettings();
                    if (!settings) return false;
                    var firstColumn = settings.aoColumns[0];
                    if (firstColumn && !firstColumn.orderable) {
                        $(firstColumn.nTh).removeClass("sorting sorting_asc sorting_desc").addClass(firstColumn.sSortingClass || "sorting_disabled");
                    }
                    var $table = $(settings.nTable),
                        $tBody = $(settings.nTBody),
                        $tableWrapper = $(settings.nTableWrapper),
                        $tableTop = $tableWrapper.siblings(".table-top"),
                        $tableBottom = $tableWrapper.find(".table-bottom");
                    if ($tBody.children().length <= 0) {
                        $tableWrapper.addClass("no-body");
                    } else {
                        $tableWrapper.removeClass("no-body");
                    }
                    settings.sTableId && $tableTop.attr('id', settings.sTableId + "_top");
                    $(".btn-reload", $tableTop).off("click").on("click", function (e) {
                        $table.reloadTable();
                    });
                    $(".btn-search", $tableTop).off("click").on('click', function () {
                        var $search = $(this).siblings('input[type="search"],input.input-search');
                        tableApi.search($search.val()).draw();
                    });
                    $(".table-filter", $tableTop).each(function (i, el) {
                        var $el = $(this);
                        $el.data('valueOrg', $el.val());
                        if ($el.is("select")) {
                            $el.off("change").on('change', function (e) {
                                tableApi.search($(this).val()).draw();
                            });
                        } else if ($el.is('input[type="search"],input.input-search')) {
                            $el.off("keypress").on('keypress', function (e) {
                                if (e.keyCode == 13) {
                                    tableApi.search($(this).val()).draw();
                                }
                            });
                        }
                    });
                    var args = [];
                    $.each(arguments, function (i, arg) {
                        args.push(arg);
                    });
                    args.unshift($table);
                    $.isFunction(complete) && complete.apply(this, args);
                },
                'drawCallback': function (settings) {
                    settings = settings || this.fnSettings();
                    var $tableWrapper = $(settings.nTableWrapper),
                        $table = $(settings.nTable),
                        $tableBody = $(settings.nTBody);
                    if ($("td.dataTables_empty", $tableBody).length) {
                        $(".dataTables_processing", $tableWrapper).hide();
                    }
                }
            };

            options = $.extend(true, {}, baseOptions, options);

            var dataSrc = options.dataSrc;
            delete options.dataSrc;

            if (options.ajax && options.ajax.dataSrc == null && dataSrc != null) {
                options.ajax.dataSrc = dataSrc;
            }

            // 表格列权限控制
            var hiddenColumns = [];
            $table.find('th[data-permission], td[data-permission]').each(function() {
                var $this = $(this), index = $this.index();
                if (!App.permission.has($this.data('permission')) && $.inArray(index, hiddenColumns) == -1) {
                    hiddenColumns.push(index);
                }
                index = null;
                $this = null;
            });

            var columnsDef = [], targets, i, j, k;
            if (options.columnDefs) {
                if ($.isArray(options.columnDefs)) {
                    var columnDef;
                    for (i=0; i<options.columnDefs.length; i++) {
                        columnDef = options.columnDefs[i];
                        if (columnDef && $.isArray(targets = columnDef.targets)) {
                            delete columnDef.targets;
                            for (j=0; j<targets.length; j++) {
                                k = targets[j];
                                columnsDef[k] = $.extend({}, columnsDef[k], columnDef);
                            }
                        }
                    }
                }
                delete options.columnDefs;
            }

            if (columnsDef.length && !options.columns) {
                options.columns = columnsDef;
            }

            if ($.isArray(options.columns)) {
                var columnOpt,
                    className, regexpCellW = /cell-(\w+)(?:-(\d+))?/, match,
                    _cellWidth, _cellMinWidth, _render = null;
                for (i=0; i<options.columns.length; i++) {
                    columnOpt = $.extend({}, columnsDef[i], options.columns[i]);
                    // visible
                    if ($.inArray(i, hiddenColumns) > -1) {
                        columnOpt.visible = false;
                    }
                    // class to width
                    if (columnOpt.class != null) {
                        className = $.trim(columnOpt.class);
                        if (className && (match = className.match(regexpCellW)) != null) {
                            _cellWidth = cellWidth(match[1]);
                            if (_cellWidth === match[1]) {
                                if (match[2] != null) {
                                    if (match[1] == "percent") {
                                        _cellWidth = match[2] + '%';
                                    } else {
                                        _cellWidth = match[2] + match[1];
                                    }
                                } else {
                                    _cellWidth = '';
                                }
                            }
                            if (_cellWidth) {
                                columnOpt.width = _cellWidth;
                            }
                        }
                    }
                    // width
                    if (columnOpt.width != null) {
                        _cellWidth = columnOpt.width;
                    }
                    if (typeof _cellWidth === "string") {
                        _cellWidth = cellWidth(_cellWidth);
                        columnOpt.width = _cellWidth;
                    }
                    _cellWidth = null;
                    // minWidth
                    if (columnOpt.minWidth != null) {
                        _cellMinWidth = columnOpt.minWidth;
                    }
                    if (typeof _cellMinWidth === "string") {
                        _cellMinWidth = cellWidth(_cellMinWidth);
                        columnOpt.minWidth = _cellMinWidth;
                    }
                    _cellMinWidth = null;
                    // render
                    if (typeof columnOpt.render === "function") {
                        _render = columnOpt.render;
                    }
                    columnOpt.render = function(data, type, rowData, cellApi) {
                        var settings = cellApi.settings || {},
                            columns = settings.aoColumns || [],
                            colSettings = columns[cellApi.col] || {};
                        var render = colSettings.mRender || {};
                        render = render.__render__;
                        if (typeof render === "function") {
                            data = render.apply(this, arguments);
                        }
                        if (data != null && typeof data === "string") {
                            data = App.permission.compile(data);
                        }
                        return data;
                    };
                    columnOpt.render.__render__ = _render;
                    _render = null;

                    options.columns[i] = columnOpt;
                }
            }

            // 表格错误处理
            if ($.fn.dataTableExt) {
                $.fn.dataTableExt.errMode = function(table, errCode, errText) {
                    var errMsg = 'DataTables Error: table id="' + $table.selector+'"';
                    if (typeof errCode === "string" && !/^\d+$/.test(errCode)) {
                        errMsg += (" - " + errCode);
                    } else {
                        if (errCode == 3) {
                            errMsg += " has already been initialised.";
                        } else {
                            errMsg = errText.replace("warning:", "Error:");
                        }
                    }
                    $doc.trigger($.Event("error.dt"), errMsg);
                };
            }

            var tableApi = $table.DataTable(options);

            if (!tableApi) return null;

            var settings = tableApi.settings()[0];

            if (settings) {
                var $tbody        = $(settings.nTBody),
                    $tableWrapper = $(settings.nTableWrapper);
                if ($tbody.children().length <= 0) {
                    $tableWrapper.addClass("no-body");
                } else {
                    $tableWrapper.removeClass("no-body");
                }
            }

            // 第一列包含选择框时，固定显示第一列
            var checkSelector = 'input[type="checkbox"], input[type="radio"]',
                hasCheck = false;
            if (
                $(".dataTables_scrollHead table>thead>tr>th:first", $table.parents(".dataTables_wrapper")).find(checkSelector).length
            ) {
                hasCheck = true;
            } else {
                var firstColumnOption = $.extend({}, $.isArray(options.columns) && options.columns.length ? options.columns[0] : null),
                    $firstColumnContent;
                if (typeof firstColumnOption.defaultContent === "string") {
                    $firstColumnContent = $(firstColumnOption.defaultContent);
                } else if (typeof firstColumnOption.render === "function") {
                    try {
                        $firstColumnContent = $(firstColumnOption.render.call(tableApi, '', '', {}, {col:0, row: 0}));
                    } catch (e) {
                        $firstColumnContent = $([]);
                    }
                }
                if ($firstColumnContent && $firstColumnContent.find(checkSelector).length) {
                    hasCheck = true;
                }
            }
            new $.fn.dataTable.FixedColumns(tableApi, {
                leftColumns: hasCheck ? 1 : 0,
                drawCallback: function(leftObj, rightObj) {
                    var dtSettings = this.s.dt;
                    var $tableWrapper = $(dtSettings.nTableWrapper),
                        $table        = $(dtSettings.nTable),
                        $tableHead    = $(dtSettings.nTHead),
                        $tableBody    = $(dtSettings.nTBody),
                        $tableScroll = $(".dataTables_scroll", $tableWrapper),
                        $tableLeftHead = $(leftObj.header),
                        $tableLeftBody = $(leftObj.body),
                        $tableLeft = $tableLeftHead.parents(".DTFC_LeftWrapper:first"),
                        $tableRightHead = $(rightObj.header),
                        $tableRightBody = $(rightObj.body),
                        $tableRight = $tableRightHead.parents(".DTFC_RightWrapper:first");
                    // last-child
                    $('tr:last-child', $tableBody)
                        .add($('tbody > tr:last-child', $tableLeftBody))
                        .add($('tbody > tr:last-child', $tableRightBody))
                        .addClass('last-child');
                    $('th:last-child', $tableHead)
                        .add($('td:last-child', $tableBody))
                        .add($('th:last-child, td:last-child', $tableLeftHead))
                        .add($('th:last-child, td:last-child', $tableLeftBody))
                        .add($('th:last-child, td:last-child', $tableRightHead))
                        .add($('th:last-child, td:last-child', $tableRightBody))
                        .addClass('last-child');

                    // class cell-check
                    if (hasCheck) {
                        $('th:first-child', $tableHead)
                            .add($('td:first-child', $tableBody))
                            .add($('th:first-child, td:first-child', $tableLeftHead))
                            .add($('th:first-child, td:first-child', $tableLeftBody))
                            .add($('th:first-child, td:first-child', $tableRightHead))
                            .add($('th:first-child, td:first-child', $tableRightBody))
                            .addClass('cell-check');
                    }

                    var tableApi = $table.dataTable().api();

                    var checkboxSelector = 'input[type="checkbox"]';
                    var getFirstCellCheckbox = function($wrapper) {
                        var $checkbox = $([]);
                        if ($wrapper && $wrapper instanceof $) {
                            $wrapper.find("tr").each(function() {
                                $checkbox = $checkbox.add($(this).children("th:first, td:first").find(checkboxSelector));
                            });
                        }
                        return $checkbox;
                    };
                    // content table checkbox
                    getFirstCellCheckbox($tableScroll).iCheck({
                        checkboxClass: "icheckbox-info"
                    }).on('ifChecked', {$tbody: $tableBody}, function (e) {
                        if ($(this).hasClass('selectAll')) {
                            var $tbody = e.data.$tbody;
                            getFirstCellCheckbox($tbody).iCheck('check');
                        }
                    }).on('ifUnchecked', {$tbody: $tableBody}, function (e) {
                        var $this = $(this);
                        $this.removeAttr("checked");
                        if ($this.hasClass('selectAll')) {
                            var $tbody = e.data.$tbody;
                            getFirstCellCheckbox($tbody).iCheck('uncheck').removeAttr('checked');
                        }
                    });
                    // content table radio
                    var radioSelector = 'input[type="radio"]';
                    $(radioSelector, $tableScroll).iCheck({
                        radioClass: "iradio-info"
                    }).on('ifUnchecked', function (e) {
                        $(this).removeAttr('checked');
                    });
                    // tooltip
                    $('[data-toggle="tooltip"]', $tableScroll).tooltip({container: "#page-main .page-content:first"});
                    // left table checkbox
                    $(checkboxSelector, $tableLeft).iCheck({
                        checkboxClass: "icheckbox-info"
                    }).on('ifChecked', {$tbody: $tableLeftBody}, function (e) {
                        var $this = $(this);
                        if ($this.hasClass('selectAll')) {
                            var $tbody = e.data.$tbody;
                            getFirstCellCheckbox($tableHead).iCheck('check');
                            getFirstCellCheckbox($tbody).iCheck('check');
                        } else {
                            var $tr = $this.parents("tr:first"),
                                $td = $this.parents("td:first"),
                                rowIndex = $tr.index(),
                                columnIndex = $td.index(),
                                settings = tableApi.settings()[0];
                            if (!(settings.oFeatures.bServerSide && settings.oFeatures.bPaginate)) {
                                rowIndex = tableApi.page() * tableApi.page.len() + rowIndex;
                            }
                            var $cell = $(tableApi.cell(rowIndex, columnIndex).node());
                            $(checkboxSelector, $cell).iCheck('check');
                        }
                    }).on('ifUnchecked', {$tbody: $tableLeftBody}, function (e) {
                        var $this = $(this);
                        $this.removeAttr("checked");
                        if ($this.hasClass('selectAll')) {
                            var $tbody = e.data.$tbody;
                            getFirstCellCheckbox($tableHead).iCheck('uncheck');
                            getFirstCellCheckbox($tbody).iCheck('uncheck');
                        } else {
                            var $tr = $this.parents("tr:first"),
                                $td = $this.parents("td:first"),
                                rowIndex = $tr.index(),
                                columnIndex = $td.index(),
                                settings = tableApi.settings()[0];
                            if (!(settings.oFeatures.bServerSide && settings.oFeatures.bPaginate)) {
                                rowIndex = tableApi.page() * tableApi.page.len() + rowIndex;
                            }
                            var $cell = $(tableApi.cell(rowIndex, columnIndex).node());
                            $(checkboxSelector, $cell).iCheck('uncheck').removeAttr('checked');
                        }
                    });
                    // left table radio
                    $(radioSelector, $tableLeft).iCheck({
                        radioClass: "iradio-info"
                    }).on('ifChecked', {$tbody: $tableLeftBody}, function (e) {
                        var $this = $(this),
                            $tr = $this.parents("tr:first"),
                            $td = $this.parents("td:first"),
                            rowIndex = $tr.index(),
                            columnIndex = $td.index(),
                            settings = tableApi.settings()[0];
                        if (!(settings.oFeatures.bServerSide && settings.oFeatures.bPaginate)) {
                            rowIndex = tableApi.page() * tableApi.page.len() + rowIndex;
                        }
                        var $cell = $(tableApi.cell(rowIndex, columnIndex).node());
                        $(radioSelector, $cell).iCheck('check');
                    }).on('ifUnchecked', {$tbody: $tableLeftBody}, function (e) {
                        var $this = $(this),
                            $tr = $this.parents("tr:first"),
                            $td = $this.parents("td:first"),
                            rowIndex = $tr.index(),
                            columnIndex = $td.index(),
                            settings = tableApi.settings()[0];
                        if (!(settings.oFeatures.bServerSide && settings.oFeatures.bPaginate)) {
                            rowIndex = tableApi.page() * tableApi.page.len() + rowIndex;
                        }
                        $this.removeAttr('checked');
                        var $cell = $(tableApi.cell(rowIndex, columnIndex).node());
                        $(radioSelector, $cell).iCheck('uncheck').removeAttr('checked');
                    });
                    // hover
                    $('tr', $tableBody).hover(function() {
                        var $tr = $(this), rowIndex = $tr.index();
                        var $fixedTr = $('tbody>tr:eq('+rowIndex+')', $tableLeftBody);
                        $fixedTr = $fixedTr.add($('tbody>tr:eq('+rowIndex+')', $tableRightBody));
                        $fixedTr.addClass('hover');
                    }, function() {
                        var $tr = $(this), rowIndex = $tr.index();
                        var $fixedTr = $('tbody>tr:eq('+rowIndex+')', $tableLeftBody);
                        $fixedTr = $fixedTr.add($('tbody>tr:eq('+rowIndex+')', $tableRightBody));
                        $fixedTr.removeClass('hover');
                    });
                    $('tbody>tr', $tableLeftBody).add($('tbody>tr', $tableRightBody)).hover(function() {
                        var $tr = $(this), rowIndex = $tr.index();
                        $('tr:eq('+rowIndex+')', $tableBody).addClass('hover');
                    }, function() {
                        var $tr = $(this), rowIndex = $tr.index();
                        $('tr:eq('+rowIndex+')', $tableBody).removeClass('hover');
                    });
                    // tooltip
                    $('[data-toggle="tooltip"]', $tableLeft).tooltip({container: "#page-main .page-content:first"});
                    $('[data-toggle="tooltip"]', $tableRight).tooltip({container: "#page-main .page-content:first"});
                    // dropdown
                    initDropdown($tableWrapper);
                }
            });
            return tableApi;
        }

        return null;
    };

    function initDropdown($wrapper) {
        var toggleFlag = "toggled";
        if ($wrapper && $wrapper instanceof $ && !$wrapper.data(toggleFlag)) {
            var backdrop = '.dropdown-backdrop';
            var toggle = '[data-toggle="dropdown"]';
            var dataKey = 'menu.ui.dropdown';
            function dropdownToggle(e) {
                var $this = $(e.currentTarget || e.target);

                if ($this.is('.disabled, :disabled')) return false;

                var $parent  = getParent($this);
                var $menu = $this.data(dataKey);
                var isActive = $menu ? true : false;

                clearMenus();

                if (!isActive) {
                    if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                        // if mobile we use a backdrop because click events don't delegate
                        $('<div class="dropdown-backdrop"/>').appendTo($wrapper).on('click', clearMenus);
                    }

                    var $dropDownMenu = $this.siblings(".dropdown-menu:first");

                    $this.data(dataKey, ($menu = $dropDownMenu.clone(true)));
                    $menu.appendTo($wrapper).hide();

                    $menu.find("a").off("click").on("click", function(e) {
                        if (!this.href || (this.href && (
                                ~this.baseURI.indexOf(this.href) || !/^https?:\/\//.test(this.href))
                            )) {
                            if (this.hash) {
                                $.History.setHash(this.hash);
                            } else if (this.href && !/^javascript:/.test(this.href)) {
                                window.location.assign(this.href);
                            } else if(!$(this).is(":disabled")) {
                                var index = $(this).parents("li:first").index(),
                                    indexA = $(this).index();
                                $dropDownMenu.find('li:eq('+index+') ' + 'a:eq('+indexA+')').trigger("click");
                            }
                            return false;
                        }
                    });

                    $menu.css($.extend({display: "block", right: "auto"}, getMenuPos($this, $menu)));

                    var relatedTarget = { relatedTarget: $this[0] };
                    $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

                    if (e.isDefaultPrevented()) return;

                    $this
                        .trigger('focus')
                        .attr('aria-expanded', 'true');

                    $parent
                        .trigger('shown.bs.dropdown', relatedTarget)
                }

                return false;
            }
            function clearMenus(e) {
                if (e && e.which === 3) return;
                $(backdrop).remove();

                $wrapper.find(toggle).removeData(dataKey).each(function() {
                    var $this         = $(this);
                    var $parent       = getParent($this);
                    var relatedTarget = { relatedTarget: this };

                    if (!$this.data(dataKey)) return;

                    $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

                    if (e.isDefaultPrevented()) return;

                    $this.attr('aria-expanded', 'false');
                    $parent.trigger('hidden.bs.dropdown', relatedTarget);
                });
                $wrapper.children(".dropdown-menu").remove();
            }
            function getParent($this) {
                var selector = $this.attr('data-target');

                if (!selector) {
                    selector = $this.attr('href');
                    selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
                }

                var $parent = selector && $(selector);

                return $parent && $parent.length ? $parent : $this.parent();
            }
            function getMenuPos($this, $menu) {
                var $pageMain = $('#page-main'),
                    posMain = $pageMain.offset(),
                    mainH = $pageMain.innerHeight();
                var posTarget = $this.offset(),
                    posWrapper = $wrapper.offset(),
                    thisW = $this.outerWidth(),
                    thisH = $this.outerHeight(),
                    menuW = $menu.outerWidth(),
                    menuH = $menu.outerHeight(),
                    pos = {};
                var posLeft2Wrapper = posTarget.left - posWrapper.left,
                    posWrapperTop2Main = posWrapper.top - posMain.top,
                    posTop2Wrapper = posTarget.top - posWrapper.top,
                    posTop2Main = posTop2Wrapper + posWrapperTop2Main;
                if (mainH > menuH + posTop2Main) {
                    var thisHalfW = thisW / 2;
                    $menu.removeClass("left left-top left-bottom");
                    pos.top = posTop2Wrapper + thisH;
                    pos.left = posLeft2Wrapper - (menuW - thisW) + thisHalfW;
                } else {
                    var thisHalfH = thisH / 2,
                        menuHalfH = menuH / 2;
                    pos.left = posLeft2Wrapper - menuW - 7;
                    var posTopMiddle2Main = posTop2Main + thisHalfH;
                    if (posTopMiddle2Main >= menuH/2 && mainH - posTopMiddle2Main >= menuH/2) {
                        $menu.addClass("left");
                        pos.top =  posTop2Wrapper - menuHalfH + thisHalfH - 6;
                    } else if (posTopMiddle2Main < menuH/2) {
                        $menu.addClass("left-top");
                        pos.top =  posTop2Wrapper - 6;
                    } else {
                        $menu.addClass("left-bottom");
                        pos.top =  posTop2Wrapper - menuH + thisH;
                    }
                }
                return pos;
            }
            $(document).on('click.bs.dropdown.data-api', clearMenus);
            $wrapper
                .on('click.bs.dropdown.data-api', clearMenus)
                .on('click.bs.dropdown.data-api', toggle, dropdownToggle)
                .on('keydown.bs.dropdown.data-api', toggle, dropdownToggle)
                .data(toggleFlag, true);
        }
    }

    /**
     * 判断是否是dataTable
     */
    $.fn.isDataTable = function() {
        var flag;
        this.each(function() {
            var $this = $(this);
            if (!$this.is("table") || !$.fn.dataTable.isDataTable(this)) {
                flag = false;
                return false;
            } else {
                flag = true;
            }
        });
        return !!flag;
    };

    /**
     * 使用dataTable插件后的表格刷新重新加载
     * @param ajax {String|Object}
     *              使用新的ajax配置项。
     *              为字符串时将作为新的请求地址。
     *              为对象时，如果含有属性url及相应值，同$.ajax配置项规则。否则，作为新的请求参数
     * @param clear {Boolean}
     *              是否清空查询条件、当前页数等状态，默认为false
     * @returns {$.fn}
     */
    $.fn.reloadTable = function (ajax, clear) {
        this.each(function() {
            var $this = $(this);
            if (typeof clear !== "boolean") {
                clear = !!clear;
            }
            var tableApi = $this.dataTable().api(),
                settings = tableApi.settings()[0],
                $tableWrapper = $(settings.nTableWrapper),
                $tableTop = $tableWrapper.siblings(".table-top"),
                $tableHead = $tableWrapper.find(".DTFC_LeftHeadWrapper:first table:first");
            var dataSrc = settings.ajax ? settings.ajax.dataSrc : null;
            if (!$tableHead.length) {
                $tableHead = $(settings.nTHead);
            }
            if (settings.oFeatures.bServerSide || settings.ajax) {
                var sVal = '';
                if (clear) {
                    $(".table-filter", $tableTop).each(function (i, el) {
                        var $el = $(this);
                        var valOrg = $el.data('valueOrg');
                        typeof valOrg != "undefined" && $el.val(valOrg);
                        $el = null;
                    });
                } else {
                    sVal = $('input[type="search"],input.input-search', $tableTop).val();
                }
                if (!settings.oFeatures.bServerSide) {
                    tableApi.search(sVal);
                }
                if (ajax != null) {
                    if (!$.isFunction(ajax) && !$.isPlainObject(ajax)) {
                        ajax = {url: ajax};
                    }
                    if (settings.ajax && !$.isFunction(settings.ajax)) {
                        if (ajax.url) {
                            tableApi.ajax.url(App.getFullUrl(ajax.url));
                            settings.ajax.data = ajax.data;
                        } else {
                            settings.ajax.data = ajax;
                        }
                    } else {
                        settings.ajax = ajax;
                    }
                    if (dataSrc != null) {
                        settings.ajax.dataSrc = dataSrc;
                    }
                }
                tableApi.ajax.reload(null, clear);
                $('input[type="checkbox"]', $tableHead).iCheck("uncheck");
            } else {
                App.go();
            }
        });
        $('.tooltip').hide();
        return this;
    };

    /**
     * 获取datatable选中行数据
     * @returns [
     *   {
     *     api,     // 当前table的api对象
     *     nTable,  // 当前table的dom对象
     *     nTr,     // 当前行dom对象
     *     row,     // 当前行的api对象
     *     data     // 当前行的数据
     *   }
     * ]
     */
    $.fn.getTableSelected = function() {
        var selected;
        this.each(function() {
            var $this = $(this);

            if (!$this.isDataTable()) {
                return true;
            }

            var tableApi = $this.dataTable().api();
            var settings = tableApi.settings()[0];

            var $rows = tableApi.rows().nodes().to$();
            $rows.each(function() {
                var $row = $(this),
                    $checkCell = $('td:first, th:first', $row);
                var $check = $checkCell.find('input[type="checkbox"], input[type="radio"]');
                if ($check.prop('checked') || $check.attr('checked') === "checked") {
                    var $tr = $check.parents("tr:first"),
                        rowIndex = $tr.index();
                    if (!(settings.oFeatures.bServerSide && settings.oFeatures.bPaginate)) {
                        rowIndex = tableApi.page() * tableApi.page.len() + rowIndex;
                    }
                    var rowApi = tableApi.row(rowIndex);

                    var obj = {
                        api: tableApi,
                        nTable: $this.get(0),
                        nTr: $tr.get(0),
                        row: rowApi,
                        data: rowApi.data()
                    };

                    !selected && (selected = []);
                    selected.push(obj);
                }
            });
        });
        return selected;
    };

    var DataTables = {
        init: initDataTable,
        parseAjax: function(context, $table, url, param) {

            var self = context || this || {};
            try {
                if (!($table instanceof $)) {
                    $table = $($table);
                }
                return function(data, callback, settings) {
                    if (self.ajax && $.isFunction(self.ajax.send)) {
                        return self.ajax.send(
                            DataTables.parseUrl($table, url, param),
                            function(err, resp) {
                                if (err) {
                                    App.onError(err, function(err) {
                                        App.assignError(err, {level: 'app'});
                                    });
                                    callback(DataTables.parseResult($table));
                                } else {
                                    callback(DataTables.parseResult($table, resp));
                                }
                            }
                        );
                    } else {
                        callback(DataTables.parseResult($table));
                    }
                };
            } catch (e) {}
            return null;
        
        },
        parseUrl: function($table, url, param) {
            if ($.fn.dataTable.isDataTable($table)) {
                try {
                    if (!($table instanceof $)) {
                        $table = $($table);
                    }

                    var tableApi = $table.dataTable().api();

                    if (tableApi) {
                        var parseUrl = function(url, level) {

                            level = level || 0;

                            if (level > 1000) return url;

                            if ($.isArray(url)) {
                                level = level + 1;
                                url = [].concat(url);
                                $.each(url, function(i, _url) {
                                    url[i] = parseUrl(_url, level);
                                });
                            } else if (url != null) {
                                if (typeof url !== "object") {
                                    url = {name: url};
                                } else {
                                    url = $.extend({}, url);
                                }
                                url.args = url.args || {};
                                url.data = $.extend({}, url.data, DataTables.parseParam($table, param));
                                url.args = $.extend({pageNo: tableApi.page() + 1, pageSize: tableApi.page.len()}, url.args, url.data);
                            }

                            return url;
                        };
                        url = parseUrl(url);
                    }
                } catch (e) {}
            }
            return url;
        },
        parseParam: function($table, params) {
            var _params;

            if (params) {
                _params = $.extend({}, params);
            }

            if ($.fn.dataTable.isDataTable($table)) {
                try {
                    if (!($table instanceof $)) {
                        $table = $($table);
                    }

                    var settings = $table.fnSettings() || {};

                    // 前端处理搜索关键字的转换
                    var $tableWrapper = $(settings.nTableWrapper),
                        $tableTop     = $tableWrapper.siblings(".table-top"),
                        $tableFilter  = $tableTop.find(".table-filter").add($table.prev().find(".dataTables_filter").find("select,input"));
                    _params = _params || {};
                    $tableFilter.each(function(){
                        var filterKey = $(this).attr('name'),
                            filterVal = $(this).val();
                        _params[filterKey] = filterVal;
                    });
                } catch (e) {}
            }

            return _params;
        },
        parseResult: function($table, data) {
            var result = {};

            var dataSrc, settings = {};

            if ($.fn.dataTable.isDataTable($table)) {
                try {
                    if (!($table instanceof $)) {
                        $table = $($table);
                    }

                    settings = $table.fnSettings() || {};

                    if (settings.ajax && settings.ajax.dataSrc) {
                        dataSrc = settings.ajax.dataSrc;
                    }
                } catch (e) {}
            }

            data = data || {};

            var _data = [];

            if ($.isFunction(dataSrc)) {
                _data = data.result || data;
                try {
                    _data = dataSrc(_data);
                    if (_data && !$.isArray(_data) && typeof _data === "object") {
                        data = _data;
                        _data = data.result || data[dataSrc] || data;
                    }
                } catch (e) {
                    _data = [];
                    $doc.trigger($.Event("error.dt"), 'dataSrc - ' + e.message);
                }
                dataSrc = 'data';
            } else {
                dataSrc = $.trim(dataSrc);
                dataSrc = dataSrc || 'data';
                _data = data.result || data[dataSrc] || data;
                if ($.isFunction(settings.ajax)) {
                    dataSrc = 'data';
                }
            }

            _data = _data || [];

            var recordsTotal = data.totalCount || _data.length || 0,
                recordsFiltered = data.totalCount || _data.length || 0;

            result[dataSrc] = _data;
            result['recordsTotal'] = recordsTotal;
            result['recordsFiltered'] = recordsFiltered;

            return result;
        },
        width: cellWidth
    };

    return DataTables;
});
