define(['jquery', 'd3', './graph', 'common/ui/modal', 'common/ui/d3-tip'], function ($, d3, graph, Modal) {
    function WorkFlow() {
        this.graph = graph;
        this._ICON_UNICODE = {
            'fa-database': '\uf1c0',
            'fa-diamond': '\uf219',
            'fa-random': '\uf074',
            'fa-crosshairs': '\uf05b',
            'fa-circle-o': '\uf10c',
            'fa-life-ring': '\uf1cd',
            'fa-file-o': '\uf016',
            'fa-table': '\uf0ce',
            'fa-dot-circle-o': '\uf192',
            'fa-cubes': '\uf1b3',
            'fa-file': '\uf15b',
            'fa-file-text-o': '\uf0f6',
            'fa-columns': '\uf0db',
            'fa-exchange': '\uf0ec',
            'fa-list-ul': '\uf0ca',
            'fa-neuter': '\uf22c',
            'fa-paper-plane': '\uf1d8',
            'fa-circle': '\uf111',
        };
        this._WIDTH = 150;
        this._HEIGHT = 30;
    }

    WorkFlow.prototype = (function () {
        var _WIDTH = 150;
        var _HEIGHT = 30;
        var activeLine = null;
        var points = [];
        var translate = null;
        var drawLine = false;

        function linestarted() {
            drawLine = false;
            // 当前选中的circle
            var anchor = d3.select(this);
            // 当前选中的节点
            var node = d3.select(this.parentNode);
            var dx = _WIDTH * (+anchor.attr("output")) / (+node.attr("outputs") + 1);
            var dy = _HEIGHT;
            var transform = node.attr("transform");
            translate = getTranslate(transform);
            points.push([dx + translate[0], dy + translate[1]]);
            activeLine = d3.select("svg")
                .append("path")
                .attr("class", "cable")
                .attr("from", node.attr("id"))
                .attr("start", dx + ", " + dy)
                .attr("output", d3.select(this).attr("output"))
                .attr("marker-start", "url(#marker-circle)")
                .attr("marker-end", "url(#marker-circle)");
        }

        function linedragged() {
            drawLine = true;
            points[1] = [d3.event.x + translate[0], d3.event.y + translate[1]];
            activeLine.attr("d", function () {
                return "M" + points[0][0] + "," + points[0][1]
                    + "C" + points[0][0] + "," + (points[0][1] + points[1][1]) / 2
                    + " " + points[1][0] + "," + (points[0][1] + points[1][1]) / 2
                    + " " + points[1][0] + "," + points[1][1];
            });
        }

        function lineended(d) {
            drawLine = false;
            var anchor = d3.selectAll("g.end");
            if (anchor.empty()) {
                activeLine.remove();
            } else {
                var pNode = d3.select(anchor.node().parentNode);
                var offsetX = _WIDTH * (+anchor.attr("input")) / (+pNode.attr("inputs") + 1);
                anchor.classed("end", false);
                activeLine.attr("to", pNode.attr("id"));
                activeLine.attr("input", anchor.attr("input"));
                activeLine.attr("end", offsetX + ", 0");

                // 实现连接点吸附效果
                var t = getTranslate(pNode.attr("transform"));
                points[1] = [t[0] + offsetX, t[1]];
                activeLine.attr("d", function () {
                    return "M" + points[0][0] + "," + points[0][1]
                        + "C" + points[0][0] + "," + (points[0][1] + points[1][1]) / 2
                        + " " + points[1][0] + "," + (points[0][1] + points[1][1]) / 2
                        + " " + points[1][0] + "," + points[1][1];
                });

                // 添加connection
                var conn = {
                    "from": {
                        "nodeId": activeLine.attr("from"),
                        "portIndex": +activeLine.attr("output")
                    },
                    "to": {
                        "nodeId": activeLine.attr("to"),
                        "portIndex": +activeLine.attr("input")
                    }
                };
                var output_type = workflow.graph.getNodeById(conn.from.nodeId).output.split(",")[conn.from.portIndex - 1];
                var input_type = workflow.graph.getNodeById(conn.to.nodeId).input.split(",")[conn.to.portIndex - 1];
                // 判断是否已经存在连接线
                if (workflow.graph.edgeExist(conn)) {
                    Modal.warning('不能重复添加连接线');
                    activeLine.remove();
                } else if (workflow.graph.toEdgeExist(conn.to)) {
                    Modal.warning('该节点已经存在输入');
                    activeLine.remove();
                } else if (output_type !== input_type) {
                    Modal.warning('输入与输出不一致');
                    activeLine.remove();
                } else {
                    workflow.graph.addEdge(conn);
                }
            }

            activeLine = null;
            points.length = 0;
            translate = null;
        }

        function getTranslate(transform) {
            // IE浏览器下transorflow使用空格分割,chrome使用逗号分割
            if (transform.indexOf(',') !== -1) {
                var arr = transform.substring(transform.indexOf("(") + 1, transform.indexOf(")")).split(",");
                return [+arr[0], +arr[1]];
            } else {
                var arr = transform.substring(transform.indexOf("(") + 1, transform.indexOf(")")).split(" ");
                return [+arr[0], +arr[1]];
            }
        }

        var dx = 0;
        var dy = 0;
        var dragElem = null;

        function dragstarted() {
            var transform = d3.select(this).attr("transform");
            var translate = getTranslate(transform);
            dx = d3.event.x - translate[0];
            dy = d3.event.y - translate[1];
            dragElem = d3.select(this);

            d3.selectAll("g.node").classed('active', false);
            dragElem.classed('active', true);

            $("#" + dragElem.attr("id")).click();
        }

        function dragged() {
            dragElem.attr("transform", "translate(" + (d3.event.x - dx) + ", " + (d3.event.y - dy) + ")");
            updateCable(dragElem);
        }

        function updateCable(elem) {
            var width = this._WIDTH;
            var height = this._HIGHT;
            var id = elem.attr("id");
            var transform = elem.attr("transform");
            var t1 = getTranslate(transform);

            // 更新输出线的位置
            d3.selectAll('path[from="' + id + '"]')
                .each(function () {
                    var start = d3.select(this).attr("start").split(",");
                    start[0] = +start[0] + t1[0];
                    start[1] = +start[1] + t1[1];

                    var path = d3.select(this).attr("d");
                    if (path.indexOf(",") !== -1) {
                        var end = path.substring(path.lastIndexOf(" ") + 1).split(",");
                    } else {
                        var end = path.split(" ").slice(-2);
                    }
                    end[0] = +end[0];
                    end[1] = +end[1];

                    d3.select(this).attr("d", function () {
                        return "M" + start[0] + "," + start[1]
                            + " C" + start[0] + "," + (start[1] + end[1]) / 2
                            + " " + end[0] + "," + (start[1] + end[1]) / 2
                            + " " + end[0] + "," + end[1];
                    });
                });

            // 更新输入线的位置
            d3.selectAll('path[to="' + id + '"]')
                .each(function () {
                    var path = d3.select(this).attr("d");
                    // IE下使用空格分割,chrome使用逗号分割
                    if (path.indexOf(",") !== -1) {
                        var start = path.substring(1, path.indexOf("C")).split(",");
                    } else {
                        var start = path.split(" ").slice(1, 3);
                    }

                    start[0] = +start[0];
                    start[1] = +start[1];

                    var end = d3.select(this).attr("end").split(",");
                    end[0] = +end[0] + t1[0];
                    end[1] = +end[1] + t1[1];
                    d3.select(this).attr("d", function () {
                        return "M" + start[0] + "," + start[1]
                            + " C" + start[0] + "," + (start[1] + end[1]) / 2
                            + " " + end[0] + "," + (start[1] + end[1]) / 2
                            + " " + end[0] + "," + end[1];
                    });
                });

        }

        function dragended() {
            dx = dy = 0;
            // 更新node坐标
            if (dragElem) {
                var nodeId = dragElem.attr("id");
                var t = getTranslate(dragElem.attr("transform"));

                var node = workflow.graph.getNodeById(nodeId);
                node.position_x = t[0];
                node.position_y = t[1];
            }
            dragElem = null;
        }

        return {
            graph: this.graph,
            clean: function () {
                this.graph._nodes = [];
                this.graph._edges = [];
                this.graph._nodeMap = {};
            },
            updateNode: function (node) {
                var current = d3.select("g.node[id='" + node.id + "']");
                if ('running' === node.status) {
                    current.classed(node.status, true);
                    current.select('.state').attr("fill", "#0275d8").text("\uf013");
                    d3.selectAll("path.cable[from='" + node.id + "']").classed(node.status, true);
                } else {
                    current.classed("running", false);
                    d3.selectAll("path.cable").classed("running", false);
                    if ('success' === node.status) {
                        current.select('.state').attr("fill", "#5cb85c").text("\uf058");
                    } else if ('error' === node.status) {
                        current.select('.state').attr("fill", "#d9534f").text("\uf06a");
                    } else {
                        current.select('.state').attr("fill", "#333").text("\uf017");
                    }
                    this.graph.getNodeById(node.id)['result'] = node.result;
                    this.graph.getNodeById(node.id)['log'] = node.log;
                }
            },
            removeNode: function (selected) {
                var that = this;
                selected.each(function (d, i) {
                    var id = d3.select(this).attr("id");
                    if (id) {
                        d3.selectAll('.bpmn path.cable[from="' + id + '"]').remove();
                        d3.selectAll('.bpmn path.cable[to="' + id + '"]').remove();

                        that.graph.removeNode(id);
                    }
                });
                selected.remove();
            },
            addNode: function (svg, node, gClickCall, removeClickCall) {
                var that = this;
                this.graph.addNode(node);
                var menu = [
                    {
                        title: '<i class="fa fa-pencil-square-o"></i>&nbsp;&nbsp;&nbsp;&nbsp;重命名',
                        action: that.renameNode
                    },
                    {
                        title: '<i class="fa fa-trash-o"></i>&nbsp;&nbsp;&nbsp;&nbsp;删除',
                        action: function (elm, d, i) {
                            var selected = d3.select(elm);
                            if (selected.empty()) return;
                            that.removeNode(selected);
                        }
                    },
                    {title: '<i class="fa fa-search"></i>&nbsp;&nbsp;&nbsp;&nbsp;查看日志', action: that.showLog},
                    {title: '<i class="fa fa-search"></i>&nbsp;&nbsp;&nbsp;&nbsp;查看数据预览', action: that.showData},
                ];
                if (node.module === 'app.ml.evaluation') {
                    menu.push({
                        title: '<i class="fa fa-eye"></i>&nbsp;&nbsp;&nbsp;&nbsp;查看评估报告',
                        action: that.showReport
                    });
                } else if (node.module === 'app.ml.statistic') {
                    menu.push({
                        title: '<i class="fa fa-eye"></i>&nbsp;&nbsp;&nbsp;&nbsp;查看统计报告',
                        action: that.showStatistic
                    });
                }
                var g = svg.append("g")
                    .attr("class", "node")
                    .attr("data-id", node.node_definition_id)
                    .attr("id", node.id)
                    .attr("transform", 'translate(' + node.position_x + ', ' + node.position_y + ')')
                    .on('click', gClickCall)
                    .on('contextmenu', d3.contextMenu(menu));
                var rect = g.append("rect")
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("stroke-width", 2)
                    .attr("stroke", "#333")
                    .attr("fill", "#fff")
                    .attr("width", this._WIDTH)
                    .attr("height", this._HEIGHT);

                // text
                g.append("text")
                    .text(node.name)
                    .attr("x", this._WIDTH / 2)
                    .attr("y", this._HEIGHT / 2)
                    .attr("text-anchor", "middle")
                    .style('pointer-events', 'none')
                    .attr('dy', '0.5ex')
                    .attr("clip-path", "url(#clip)");

                // left icon
                g.append('text')
                    .attr("x", 18)
                    .attr("y", this._HEIGHT / 2)
                    .attr("text-anchor", "middle")
                    .attr('font-family', 'FontAwesome')
                    .text(this._ICON_UNICODE[node.icon])
                    .style('pointer-events', 'none')
                    .attr('dy', '0.7ex');

                //right icon
                var g2 = g.append("g")
                    .attr("transform", 'translate(' + (this._WIDTH - 18) + ', ' + (this._HEIGHT / 2) + ')')
                    .style('pointer-events', 'none');

                g2.append('text')
                    .attr("class", "state")
                    .attr("text-anchor", "middle")
                    .attr('font-family', 'FontAwesome')
                    .text('\uf017')
                    .style('pointer-events', 'none')
                    .attr('dy', '0.7ex');

                // input circle
                var input = node.input || '',
                    inputs = input.length && input.split(',').length;
                g.attr("inputs", inputs);
                for (var i = 0; i < inputs; i++) {
                    var endpoint = g.append("g")
                        .attr("class", "input")
                        .attr("input", (i + 1))
                        .attr("inputtype", input.split(',')[i])
                        .attr("transform", "translate(" + (this._WIDTH * (i + 1) / (inputs + 1)) + ", 0)");
                    endpoint.append("circle")
                        .attr("class", "inner")
                        .attr("r", 3)
                        .attr("fill", "none")
                        .attr("stroke", '#333');
                }

                // output circle
                var output = node.output || '',
                    outputs = output.length && output.split(',').length;
                g.attr("outputs", outputs);
                for (i = 0; i < outputs; i++) {
                    var endpoint = g.append("g")
                        .attr("class", "output")
                        .attr("output", (i + 1))
                        .attr("outputtype", output.split(',')[i])
                        .attr("transform", "translate(" + (this._WIDTH * (i + 1) / (outputs + 1)) + ", " + this._HEIGHT + ")");
                    endpoint.append("circle")
                        .attr("class", "inner")
                        .attr("r", 3)
                        .attr("fill", "none")
                        .attr("stroke", '#333');
                }

                // remove icon
                var gr = g.append('g')
                    .attr("class", "remove")
                    .attr("node", node.id)
                    .attr("transform", "translate(" + (this._WIDTH + 8) + ", 10)")
                    .on('click', removeClickCall);
                gr.append('text')
                    .attr("text-anchor", "middle")
                    .attr('font-family', 'FontAwesome')
                    .text('\uf00d');

                g.call(
                    d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended)
                );
                var tool_tip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([-12, 0])
                    .html(function (d) {
                        return d;
                    });
                svg.call(tool_tip);
                g.selectAll("g.output").call(
                    d3.drag()
                        .on("start", linestarted)
                        .on("drag", linedragged)
                        .on("end", lineended)
                );

                g.selectAll("g.input")
                    .on("mouseover", function (arg1, idx, nodeList) {
                        var input_type = "";
                        switch ($(nodeList[idx]).attr("inputtype")) {
                            case "df":
                                input_type = "数据";
                                break;
                            case "model":
                                input_type = "模型";
                                break;
                        }
                        tool_tip.show("输入" + input_type);
                        if (drawLine) {
                            d3.selectAll("g.end").classed("end", false);
                            d3.select(this).classed("end", true);
                        }
                    })
                    .on('mouseout', function (arg1, idx, nodeList) {
                        setTimeout(function () {
                            tool_tip.hide();
                        }, 500);
                    });

                g.selectAll("g.output")
                    .on("mouseover", function (arg1, idx, nodeList) {
                        var input_type = "";
                        switch ($(nodeList[idx]).attr("outputtype")) {
                            case "df":
                                input_type = "数据";
                                break;
                            case "model":
                                input_type = "模型";
                                break;
                        }
                        tool_tip.show("输出" + input_type);
                    })
                    .on('mouseout', function (arg1, idx, nodeList) {
                        setTimeout(function () {
                            tool_tip.hide();
                        }, 500);
                    });
                $('g.node[id="' + node.id + '"]').d3Click();
                return g;
            },
            addEdge: function (conn) {
                var fromNode = this.graph.getNodeById(conn.from['nodeId']);
                var toNode = this.graph.getNodeById(conn.to['nodeId']);

                var points = [];
                var output = fromNode.output || '',
                    outputs = output.length && output.split(',').length;
                var dx1 = this._WIDTH * (conn.from.portIndex) / (outputs + 1);
                points.push([dx1 + fromNode.position_x, this._HEIGHT + fromNode.position_y]);
                var input = toNode.input || '',
                    inputs = input.length && input.split(',').length;
                var dx2 = this._WIDTH * (conn.to.portIndex) / (inputs + 1);
                points.push([dx2 + toNode.position_x, toNode.position_y]);
                var line = d3.select("svg")
                    .append("path")
                    .attr("class", "cable")
                    .attr("from", conn.from.nodeId)
                    .attr("start", dx1 + ", " + this._HEIGHT)
                    .attr("output", +conn.from.portIndex)
                    .attr("to", conn.to.nodeId)
                    .attr("end", dx2 + ", 0")
                    .attr("input", +conn.to.portIndex)
                    .attr("marker-start", "url(#marker-circle)")
                    .attr("marker-end", "url(#marker-circle)")
                    .attr("d", function () {
                        return "M" + points[0][0] + "," + points[0][1]
                            + "C" + points[0][0] + "," + (points[0][1] + points[1][1]) / 2
                            + " " + points[1][0] + "," + (points[0][1] + points[1][1]) / 2
                            + " " + points[1][0] + "," + points[1][1];
                    });
                this.graph.addEdge(conn);
            },
            renameNode: function (elm, d, i) {
                var id = elm.id, that = this;
                Modal.show({
                    title: '重命名',
                    size: {
                        width: '300px'
                    },
                    message: "<form class='form-horizontal'><input name='name' class='form-control'/></form>",
                    onshown: function (dialog) {
                        $(".form-horizontal", dialog.getModalDialog()).validate({
                            errorContainer: ".modal-dialog",
                            errorPlacement: "left bottom",
                            rules: {
                                'name': {
                                    required: true,
                                    maxlength: 12
                                }
                            }
                        });
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
                            var $modal = dialog.getModal();
                            var valid = $(".form-horizontal", $modal).valid();
                            if (!valid) return false;
                            dialog.close();
                            var formData = $(".form-horizontal", $modal).serializeObject();
                            var node = workflow.graph.getNodeById(id);
                            node.name = formData.name;
                            d3.select("g.node[id='" + node.id + "']").select('text').text(node.name);
                        }
                    }]
                });
            },
            showLog: function (elm, d, i) {
                var id = elm.id, node = workflow.graph.getNodeById(id);
                Modal.show({
                    title: "查看日志",
                    size: {width: 800},
                    message: '<textarea  class="form-control" id="message" readonly style="height:460px"/>',
                    onshown: function (dialog) {
                        $("#message", dialog.getModalDialog()).val(node.log);
                    },
                    buttons: [{
                        label: "关闭",
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
                });
            },
            showReport: function (elm, d, i) {
                var id = elm.id, node = workflow.graph.getNodeById(id);
                Modal.show({
                    title: "查看评估报告",
                    size: {width: 800},
                    message: function (dialog) {
                        var html = '<form class="form-horizontal">';
                        var report = [];
                        if (node.result) {
                            report = JSON.parse(node.result);
                        }
                        $.each(report, function (i, kv) {
                            $.each(kv || [], function (k, v) {
                                html += '<div class="form-group">' +
                                    '       <label class="control-label col-sm-3">' + k + '：</label>' +
                                    '       <div class="col-sm-8">' +
                                    '           <input class="form-control" readonly value="' + v + '"/>' +
                                    '       </div>' +
                                    '    </div>';
                            });
                        });
                        html += '</form>';
                        return html;
                    },
                    buttons: [{
                        label: "关闭",
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
                });
            },
            showData: function (elm, d, i) {
                var id = elm.id, node = workflow.graph.getNodeById(id);
                Modal.show({
                    title: "查看数据预览",
                    size: {width: 800},
                    message: function (dialog) {
                        var html = '<table class="table table-condensed table-striped"><tbody><caption>仅显示前20条</caption>';
                        var dataList = [];
                        if (node.result) {
                            dataList = JSON.parse(node.result);
                        }
                        $.each(dataList, function (i, data) {
                            html += '<tr>';
                            $.each(data || [], function (k, v) {
                                html += '<td>' + v + '</td>';
                            });
                            html += '</tr>';
                        });
                        html += '</tbody></table>';
                        return html;
                    },
                    buttons: [{
                        label: "关闭",
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
                });
            },
            showStatistic: function (elm, d, i) {
                var id = elm.id, node = workflow.graph.getNodeById(id);
                Modal.show({
                    title: "查看统计报告",
                    size: {width: 800},
                    message: function (dialog) {
                        var report = {};
                        if (node.result) {
                            report = JSON.parse(node.result);
                        }
                        return '<img src="resources/ml_images/' + report.image + '">';
                    },
                    buttons: [{
                        label: "关闭",
                        action: function (dialog) {
                            dialog.close();
                        }
                    }]
                });
            }
        }
    })();
    var workflow = new WorkFlow();
    return workflow;
});
