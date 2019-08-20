define(['App', 'jquery', 'common/ui/datatables', 'common/ui/modal', 'common/ui/workflow', 'd3', 'common/ui/validator', 'common/ui/livequery', 'common/ui/draggable', 'jq/multipicker', 'common/ui/d3-tip', 'common/ui/d3-context-menu', 'bs/switcher'], function (App, $, DataTables, Modal, workflow, d3) {
    return App.View({
        id: '',
        svg: {},
        project: {},
        ready: function () {
            var self = this;
            this.id = this.getParam('id');
            //重置workflow数据
            workflow.clean();
            //初始化页面-菜单树和Flow
            this.initPageDom();
            // 绑定菜单折叠事件
            this.bindMenuFold();
            // 绑定菜单拖拽事件
            this.bindMenuDrag();
            // 绑定参数配置事件
            this.bindParamConfig();
            // 绑定Flow启动事件
            this.bind('click', '#runBtn', self.startFlow);
            // 绑定Flow停止事件
            this.bind('click', '#stopBtn', self.stopFlow);
            // 绑定Flow保存事件
            this.bind('click', '#saveBtn', self.saveFlow);
            // 绑定Flow保存事件
            this.initWebSocket();
            this.initPageEvent();
        },
        initPageDom: function initPageDom() {
            var self = this;
            self.ajax.get("/api/v1/projects/" + self.id, function (err, json) {
                if (json) {
                    self.flow_json = json;
                    self.project = json.project;
                    $("#titleName").text(self.project.name);
                    if ($.isEmptyObject(json)) return false;
                    // 还原效果
                    var svg = d3.select("svg");
                    var nodes = json.nodes;
                    for (var i = 0, len = nodes.length; i < len; i++) {
                        workflow.addNode(svg, nodes[i], self.gClickCall, self.gRemoveClickCall);
                    }
                    var connections = json.connections;
                    for (var i = 0, len = connections.length; i < len; i++) {
                        var conn = connections[i];
                        workflow.addEdge(conn);
                    }
                    setTimeout(function () {
                        $("#params-config-form").show();
                        $('svg').trigger('click');
                    }, 600);
                    var menu = [{
                        title: '<i class="fa fa-play-circle"></i>&nbsp;&nbsp;&nbsp;&nbsp;启动实验',
                        action: function (elm, d, i) {
                            self.startFlow();
                        }
                    }, {
                        title: '<i class="fa fa-floppy-o"></i>&nbsp;&nbsp;&nbsp;&nbsp;保存实验',
                        action: function (elm, d, i) {
                            self.saveFlow();
                        }
                    }];
                    d3.select('svg').on('contextmenu', d3.contextMenu(menu));
                }
            });

            // 加载节点
            self.ajax.get("/api/v1/nodes?parent_id=root", function (err, json) {
                var arr = [];
                for (var i = 0, len = json.length; i < len; i++) {
                    arr.push('<li data-id="' + json[i].id + '">');
                    arr.push('  <a>');
                    arr.push('    <i class="fa ' + json[i].icon + '"></i>');
                    arr.push('    <span>' + json[i].name + '</span>');
                    arr.push('  </a>');
                    arr.push('</li>');
                }
                $("#folder").append(arr.join(''));
            });

            self.svg = d3.select("svg").attr("width", "100%").attr("height", "100%");
        },
        bindMenuFold: function () {
            var self = this;
            $(document).on("click", "#folder>li,#folder>li>ul>li", function (e) {
                e.stopPropagation();
                var $li = $(this);
                if ($li.hasClass("node")) return;
                if ($li.find('ul').length !== 0) {
                    $li.toggleClass('open');
                    if ($li.hasClass('open')) {
                        $li.find(">a>i").removeClass('fa-folder').addClass('fa-folder-open');
                        $li.find(">ul").show();
                    } else {
                        $li.find(">a>i").removeClass('fa-folder-open').addClass('fa-folder');
                        $li.find(">ul").hide();
                    }
                    return;
                }
                if ($li.attr('data-id') === 'datasource') {
                    self.ajax.get("/api/v1/sources", function (err, sources) {
                        var arr = ["<ul>"];
                        for (var i = 0, len = sources.length; i < len; i++) {
                            var params = {
                                format: sources[i].format,
                                options: sources[i].options,
                                file_path: sources[i].file_path
                            };
                            arr.push("<li class='node' data-id='" + sources[i].id + "'");
                            arr.push(" data-module='app.ml.source_target' data-method='SourceRead'");
                            arr.push(" data-input-count='' data-output-count='df'");
                            arr.push(" data-params='" + JSON.stringify(params) + "'>");
                            arr.push("  <a>");
                            arr.push("    <i class='fa fa-file'></i>");
                            arr.push("    <span>" + sources[i].name + "</span>");
                            arr.push("  </a>");
                            arr.push("</li>");
                        }
                        arr.push("</ul>");
                        if ($li.find('ul').length !== 0) return;
                        $li.append(arr.join(''));
                        $li.addClass('open');
                        $li.find(">a>i").removeClass('fa-folder').addClass('fa-folder-open');
                        $li.find(">ul").show();
                    });
                } else if ($li.attr('data-id') === 'model') {
                    self.ajax.get("/api/v1/models", function (err, models) {
                        var arr = ["<ul>"];
                        for (var i = 0, len = models.length; i < len; i++) {
                            var params = {
                                module: models[i].module,
                                method: models[i].method,
                                model_path: models[i].model_path
                            };
                            arr.push("<li class='node' data-id='" + models[i].id + "'");
                            arr.push(" data-module='app.ml.source_target' data-method='ModelLoader'");
                            arr.push(" data-input-count='df' data-output-count='df'");
                            arr.push(" data-params='" + JSON.stringify(params) + "'>");
                            arr.push("  <a>");
                            arr.push("    <i class='fa fa-circle'></i>");
                            arr.push("    <span>" + models[i].name + "</span>");
                            arr.push("  </a>");
                            arr.push("</li>");
                        }
                        arr.push("</ul>");
                        if ($li.find('ul').length !== 0) return;
                        $li.append(arr.join(''));
                        $li.addClass('open');
                        $li.find(">a>i").removeClass('fa-folder').addClass('fa-folder-open');
                        $li.find(">ul").show();
                    });
                } else {
                    self.ajax.get("/api/v1/nodes?parent_id=" + $li.attr('data-id')).done(function (err, nodes) {
                        var arr = ['<ul>'];
                        for (var i = 0, len = nodes.length; i < len; i++) {
                            if (nodes[i].is_leaf) {
                                arr.push('<li class="node" data-id="' + nodes[i].id + '"');
                                arr.push(' data-module="' + nodes[i].module + '"');
                                arr.push(' data-method="' + nodes[i].method + '"');
                                arr.push(' data-input-count="' + nodes[i].input + '"');
                                if (nodes[i].method === 'ModelSave') {
                                    var param_str = JSON.stringify({
                                        user_id: App.cookie.getUid(),
                                        project_id: self.id,
                                    });
                                    arr.push(" data-params='" + param_str + "'");
                                }
                                arr.push(' data-output-count="' + nodes[i].output + '">');
                                arr.push('  <a>');
                                arr.push('    <i class="fa ' + nodes[i].icon + '"></i>');
                                arr.push('    <span>' + nodes[i].name + '</span>');
                                arr.push('  </a>');
                                arr.push('</li>');
                            } else {
                                arr.push('<li data-id="' + nodes[i].id + '">');
                                arr.push('  <a>');
                                arr.push('    <i class="fa ' + nodes[i].icon + '"></i>');
                                arr.push('    <span>' + nodes[i].name + '</span>');
                                arr.push('  </a>');
                                arr.push('</li>');
                            }
                        }
                        arr.push('</ul>');
                        if ($li.find('ul').length !== 0) return;
                        $li.append(arr.join(''));
                        $li.addClass('open');
                        $li.find(">a>i").removeClass('fa-folder').addClass('fa-folder-open');
                        $li.find(">ul").show();
                    });
                }
            });
        },
        bindMenuDrag: function () {
            var self = this;
            $("#left-wrapper .node").livequery(function () {
                $(this).draggable({
                    helper: "clone",
                    connectToSortable: "#idsw-bpmn",
                    appendTo: "#container-wrapper",
                    start: function (e, ui) {
                        ui.helper.addClass("ui-draggable-helper");
                    },
                    stop: function (e, ui) {
                        var node = {
                            id: new Date().getTime() + "",
                            node_definition_id: ui.helper.attr('data-id'),
                            params: ui.helper.attr('data-params') ? JSON.parse(ui.helper.attr('data-params')) : {},
                            columns: [],
                            position_x: ui.position.left - 330,
                            position_y: ui.position.top - 48 - ($("#scroll-div").offset().top - 100),
                            name: ui.helper.text().trim(),
                            module: ui.helper.attr('data-module'),
                            method: ui.helper.attr('data-method'),
                            input: ui.helper.attr('data-input-count'),
                            output: ui.helper.attr('data-output-count'),
                            icon: ui.helper.find('i').attr('class').split(' ')[1]
                        };
                        if (node.position_x < 0) {
                            return;
                        }
                        if (node.position_y < 0) {
                            return;
                        }
                        workflow.addNode(self.svg, node, self.gClickCall, self.gRemoveClickCall);
                        $('g.node[id="' + node.id + '"]').d3Click();
                        if (node.method === "SourceRead") {
                            self.ajax.get("/api/v1/sources/" + node.node_definition_id + "/fields?project_id=" + self.id, function (err, json) {
                                workflow.graph.getNodeById(node.id).columns = json;
                            });
                        }
                    }
                });
            });
        },
        gClickCall: function (arg1, arg2, e) {
            // e.stopPropagation();
            var self = this, id = e[0].id, node = workflow.graph.getNodeById(id), params = [];
            var current = d3.select("g.node[id='" + node.id + "']");
            $("#params-config-form").empty();
            if (node.method === "SourceRead") {
                var remote = App.remote("/api/v1/sources/" + node.node_definition_id + "/fields?project_id=" + self.id);
                self.render({
                    url: "+/fields_tpl.html",
                    data: node.columns.length ? node.columns : remote,
                    dataFilter: function (err, data) {
                        typeof data === "string" && (data = JSON.parse(data));
                        node.columns = data;
                        return {fields: data};
                    },
                    callback: function (err, html) {
                        $("#params-config-form").empty().append(html);
                        current.attr("validate", true);
                    }
                });
            } else {
                self.render({
                    url: "+/params_tpl.html",
                    data: App.remote("/api/v1/nodes/" + node.node_definition_id + "/params"),
                    dataFilter: function (err, data) {
                        $.each(data || [], function (i, param) {
                            param.validation = param.validation ? JSON.parse(param.validation) : {};
                            $.each(self.getJsonVal(node.params) || [], function (k, v) {
                                if (param.name === k) {
                                    param.value = v;
                                }
                            })
                        });
                        params = data;
                        return {params: data, id: id};
                    },
                    callback: function (err, html) {
                        var $params_config_form = $("#params-config-form");
                        $params_config_form.empty().append(html);
                        $('[data-toggle="switcher"]').switcher();
                        var serviceRule = {};
                        $.each(params, function (k, param) {
                            if (param.validation) {
                                serviceRule[param.name] = self.getJsonVal(param.validation);
                            }
                        });
                        $params_config_form.removeData('validator');
                        $params_config_form.validate({
                            ignore: '',
                            errorContainer: "_form",
                            errorPlacement: "bottom",
                            rules: serviceRule,
                            viewport: null
                        });
                        self.formValid(node.id);
                    }
                });
            }
        },
        bindParamConfig: function () {
            var self = this;
            let $parmsForm = $("#params-config-form");
            $parmsForm.on("click", "#fields-chosen-btn", function (e) {
                var nodeId = $(this).attr('data-node-id'),
                    param_type = $(this).attr('data-param-type'),
                    param_name = $(this).attr('name');
                self.loadColumns(nodeId, param_type, param_name, $(this));
            });
            // svg click
            $('svg').on("click", function (e) {
                e.stopPropagation();
                if ($(e.target).prop("tagName") !== "svg") return;
                $("#params-config-form").empty();
                self.render(App.remote('+/flow_tpl.html'), self.project, function (err, html) {
                    $("#params-config-form").append(html);
                });
            });
            // update params
            $parmsForm.on("blur", "input,select", function (e) {
                e.stopPropagation();
                var nodeId = $(this).attr('data-node-id'),
                    param_name = $(this).attr('name'),
                    node = workflow.graph.getNodeById(nodeId);
                if(!self.formValid(node.id)) return;
                if (param_name === 'outputCol' || param_name === 'predictionCol') {
                    node.columns = [{type: "undefined", name: $(this).val()}];
                }
                var param_json = self.getJsonVal(node.params);
                param_json[param_name] = $(this).val();
                node.params = param_json;

                if (node.method === "JDBCRead" || node.method === "FileRead") {
                    var formData = $("#params-config-form").serializeObject();
                    if (node.method === "JDBCRead") {
                        formData.options = {
                            url: "jdbc:mysql" + "://" + formData.db_host + ":" + formData.db_port + "/" + formData.db_database,
                            dbtable: formData.dbtable,
                            user: formData.user,
                            password: formData.password,
                        };
                        formData.format = 'jdbc';
                    } else {
                        formData.options = {
                            header: formData.header === "on",
                            delimiter: formData.delimiter,
                            inferSchema: true
                        };
                    }
                    self.ajax.postJSON("/api/v1/sources/fields?project_id=" + self.id, formData, function (err, json) {
                        workflow.graph.getNodeById(node.id).columns = json;
                    });
                }
            });
        },
        gRemoveClickCall: function (arg1, arg2, e) {
            var selected = d3.selectAll(".bpmn .active");
            if (selected.empty()) return;
            Modal.confirm('确定要删除选中节点吗?？', function (result) {
                if (result) {
                    workflow.removeNode(selected);
                }
            });
        },
        loadColumns: function loadColumns(nodeId, paramType, paramName, elem) {
            var self = this;
            var node = workflow.graph.getNodeById(nodeId);
            if (!node.columns) {
                Modal.error("该节点未连有数据源。");
                return false;
            }
            var nodeColumns = workflow.graph.getPreviousColumnsByNodeId(nodeId);
            var chosen_cols = [], unchosen_cols = [];
            let col_names = self.getJsonVal(node.params)[paramName];
            if (col_names) {
                $.each(nodeColumns, function (i, col) {
                    var is_chosen = false;
                    if (typeof col_names === 'string' && col.name === col_names) {
                        chosen_cols.push(col);
                        is_chosen = true;
                    } else if (typeof col_names === 'object') {
                        $.each(col_names || [], function (i, col_name) {
                            if (col_name === col.name) {
                                chosen_cols.push(col);
                                is_chosen = true;
                            }
                        });
                    }
                    if (!is_chosen) {
                        unchosen_cols.push(col);
                    }
                });
            } else {
                unchosen_cols = nodeColumns;
            }
            Modal.show({
                title: '选择字段',
                remote: function (dialog) {
                    var def = $.Deferred();
                    var options = {
                        height: 320,
                        toColumn: {
                            items: chosen_cols
                        },
                        fromColumn: {
                            items: unchosen_cols
                        }
                    };
                    dialog.setData('options', options);
                    def.resolve(nodeColumns);
                    return def;
                },
                onloaded: function (dialog) {
                    var $modalBody = dialog.getModalBody();
                    var options = dialog.getData('options');
                    options.oncreated = function () {
                        dialog.setPosition();
                    };
                    $modalBody.multiPicker(options);
                    $modalBody.removeClass('row');
                },
                buttons: [{
                    label: '取消',
                    action: function (dialog) {
                        dialog.close();
                    }
                }, {
                    label: '确定',
                    cssClass: "btn-primary",
                    action: function (dialog) {
                        var fields = [];
                        var $modalBody = dialog.getModalBody();
                        if (!$modalBody.multiPicker('isChanged')) return;
                        var data = $modalBody.multiPicker('getSelectedData');
                        $.each(data, function (i) {
                            fields.push(data[i].name);
                        });
                        if (fields.length === 0) {
                            Modal.warning("未选择字段。");
                            return;
                        } else if (fields.length > 1 && paramType === "field") {
                            Modal.warning("只能选择一个字段。");
                            return;
                        }
                        node.params[paramName] = paramType === "field" ? fields[0] : fields;
                        if (paramType === "field") {
                            $(elem).html("已选择【" + fields[0] + "】字段");
                        } else {
                            $(elem).html("已选择" + fields.length + "个字段");
                        }
                        $('input[name="' + paramName + '"]', $("#params-config-form")).val("chosen");
                        dialog.close();
                        self.formValid(node.id);
                    }
                }]
            });
        },
        formValid: function (nodeId) {
            var current = d3.select("g.node[id='" + nodeId + "']");
            if ($("#params-config-form").valid()) {
                current.select('.state').attr("fill", "#333").text("\uf017");
                current.attr("validate", true);
                return true;
            } else {
                current.select('.state').attr("fill", "#ffff00").text("\uf071");
                current.attr("validate", false);
                return false;
            }
        },
        startFlow: function () {
            var self = this;
            if (workflow.graph.isEmpty()) {
                Modal.error("流程为空。");
                return;
            }
            // 清除选中状态
            d3.selectAll("g.node").classed("active", false);
            var keywords = App.highlight('实验' + self.project.name, 2);
            Modal.confirm('确定要启动' + keywords + '吗?', function (result) {
                if (result) {
                    if (!workflow.graph.isValidate()) {
                        return false;
                    }
                    var processor = Modal.processing("正在启动" + keywords);
                    d3.select("svg").classed('edit', false);
                    self.ajax.post({
                        url: '/api/v1/projects/' + self.id + "/start",
                        data: App.json.stringify(workflow.graph.info()),
                        timeout: 30000
                    }, function (err, data) {
                        if (data) {
                            processor.success(keywords + '启动成功');
                            // $("#stopBtn").show();
                            // $("#runBtn").hide();
                        }
                        if (err) {
                            self.onError(err, function (err) {
                                processor.error(keywords + '启动失败。原因：' + err.message);
                            })
                        }
                    });

                    workflow.start();
                }
            });
        },
        stopFlow: function () {
        },
        saveFlow: function () {
            var self = this;
            var keywords = App.highlight('实验' + self.project.name, 2);
            Modal.confirm('确定要保存' + keywords + '吗?', function (result) {
                if (result) {
                    var processor = Modal.processing("正在保存" + keywords);
                    self.ajax.post({
                        url: '/api/v1/projects/' + self.id + "/save",
                        data: App.json.stringify(workflow.graph.info()),
                        timeout: 30000
                    }, function (err, data) {
                        if (data) {
                            processor.success(keywords + '保存成功');
                        }
                        if (err) {
                            self.onError(err, function (err) {
                                processor.error(keywords + '保存失败。原因：' + err.message);
                            })
                        }
                    });
                }
            });
        },
        initPageEvent: function initPageEvent() {
            var self = this;
            /*window.onbeforeunload = function (e) {
                var old = JSON.stringify(self.flow_json);
                var current = JSON.stringify(workflow.graph.info());
                if (old !== current) {
                    return 'You may lose the changes!!!\n are you sure???';
                }
            };*/
            // 删除功能
            $(document).on("keyup", function (e) {
                if (e.keyCode === 46) {
                    var selected = d3.selectAll(".bpmn .active");
                    if (!selected.empty()) {
                        var r = confirm("确定删除选中内容?");
                        if (r === true) {
                            workflow.removeNode(selected);
                        }
                    }
                }
            });
            // node节点单击时不再展开
            $(document).on("click", "#folder li.node", function (e) {
                e.stopPropagation();
            });

            /*$("#scroll-div").draggable({
                scroll: true,
                cursor: "move",
                containment: "#idsw-bpmn",
                stop: function (e, ui) {
                    var position_x = ui.position.left - 330,
                        position_y = ui.position.top - 48 - ($("#scroll-div").offset().top - 100);
                    // $("#scroll-div").css("left", position_x).css("top", position_y);
                }
            });*/
        },
        initWebSocket: function () {
            var self = this;
            self.ws.open(App.wsUrl({routingKey: "node.status"}), function (err, data, ws) {
                workflow.updateNode(data);
            });
        },
        getJsonVal: function (val) {
            return typeof val === "string" ? JSON.parse(val) : val;
        }
    });
});