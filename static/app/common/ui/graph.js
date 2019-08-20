define(['jquery', 'common/ui/modal', 'd3'], function ($, Modal, d3) {
    function Graph() {
        this._nodes = [];
        this._edges = [];
        this._nodeMap = {};
    }

    Graph.prototype = (function () {
        return {
            info: function () {
                return {
                    nodes: this._nodes,
                    connections: this._edges,
                };
            },
            isEmpty: function () {
                return this._nodes.length === 0;
            },
            getNodeById: function (id) {
                return this._nodeMap[+id];
            },
            getParentNodesById: function (id) {
                var nodes = [], that = this;
                $.each(this._edges, function (i, edge) {
                    if (edge.to.nodeId === id) {
                        nodes.push(that.getNodeById(edge.from.nodeId));
                        nodes.push.apply(nodes, that.getParentNodesById(edge.from.nodeId))
                    }
                });
                return nodes;
            },
            getJsonVal: function (val) {
                return typeof val === "string" ? JSON.parse(val) : val;
            },
            getPreviousColumnsByNodeId: function (id) {
                var that = this, columns = [], nodeIds = [];
                $.each(this.getParentNodesById(id), function (i, node) {
                    if ($.inArray(node.id, nodeIds) < 0) {
                        nodeIds.push(node.id);
                        columns.push.apply(columns, that.getJsonVal(node.columns));
                    }
                });
                return columns;
            },
            removeNode: function (id) {
                // 删除节点
                var node = this._nodeMap[+id];
                var idx = -1;
                for (var i = 0, len = this._nodes.length; i < len; i++) {
                    if (this._nodes[i]['id'] === node['id']) {
                        idx = i;
                        break;
                    }
                }
                if (idx > -1) {
                    this._nodes.splice(idx, 1);
                }
                delete this._nodeMap[+id];
                // 删除连接线
                this._edges = this._edges.filter(function (edge) {
                    return edge.from.nodeId !== id && edge.to.nodeId !== id;
                });
            },
            addNode: function (node) {
                this._nodes.push(node);
                this._nodeMap[+node.id] = node;
            },
            getNodes: function () {
                return this._nodes;
            },
            getEdges: function () {
                return this._edges;
            },
            edgeExist: function (edge) {
                if (edge.from.nodeId === edge.to.nodeId) {
                    return true;
                }
                var flag = this._edges.some(function (item) {
                    return item.from.nodeId === edge.from.nodeId &&
                        item.from.portIndex === edge.from.portIndex &&
                        item.to.nodeId === edge.to.nodeId &&
                        item.to.portIndex === edge.to.portIndex;
                });
                return flag;
            },
            toEdgeExist: function (to) {
                var flag = this._edges.some(function (item) {
                    return item.to.nodeId === to.nodeId &&
                        item.to.portIndex === to.portIndex;
                });
                return flag;
            },
            getEdgeByEndPoint: function (from, to) {
                var selected = this._edges.filter(function (edge) {
                    return edge.from.nodeId === from.nodeId &&
                        edge.from.portIndex === from.portIndex &&
                        edge.to.nodeId === to.nodeId &&
                        edge.to.portIndex === to.portIndex;
                });
                return selected.length === 1 ? selected[0] : null;
            },
            removeEdge: function (from, to) {
                this._edges = this._edges.filter(function (edge) {
                    return edge.from.nodeId !== from.nodeId ||
                        edge.from.portIndex !== from.portIndex ||
                        edge.to.nodeId !== to.nodeId ||
                        edge.to.portIndex !== to.portIndex;
                });
            },
            addEdge: function (edge) {
                this._edges.push(edge);
            },
            isValidate: function () {
                var isValid = true, that = this;
                // check not empty
                if (this._nodes.length === 0) {
                    Modal.warning("未有可运行节点");
                    return false;
                }
                $.each(that._nodes, function (idx, node) {
                    //  check whether has input
                    if (node.input) {
                        for (var i = 1; i <= node.input.split(",").length; i++) {
                            if (!that.toEdgeExist({'nodeId': node.id, 'portIndex': i})) {
                                Modal.warning("节点[" + node.name + "]未有输入");
                                isValid = false;
                            }
                        }
                    }
                    // check node param value validation
                    var current = d3.select("g.node[id='" + node.id + "']");
                    if (!current.attr('validate')) {
                        Modal.warning("节点[" + node.name + "]配置未通过校验");
                        isValid = false;
                    }
                });

                return isValid;
            },
            tsort: function () {
                if (this._edges.length === 0 && this._nodes.length === 1) {
                    return [this._nodes[0].id];
                }
                var nodes = {},
                    sorted = [],
                    visited = {};
                var Node = function (id) {
                    this.id = id;
                    this.afters = [];
                };

                this._edges.forEach(function (v) {
                    var from = v.from.nodeId;
                    var to = v.to.nodeId;
                    if (!nodes[from]) nodes[from] = new Node(from);
                    if (!nodes[to]) nodes[to] = new Node(to);
                    nodes[from].afters.push(to);
                });

                Object.keys(nodes).forEach(function visit(idstr, ancestors) {
                    var node = nodes[idstr],
                        id = node.id;

                    if (visited[idstr]) return;
                    if (!Array.isArray(ancestors)) ancestors = [];
                    ancestors.push(id);
                    visited[idstr] = true;
                    node.afters.forEach(function (afterID) {
                        if (ancestors.indexOf(afterID) >= 0)  // if already in ancestors, a closed chain exists.
                            throw new Error('closed chain : ' + afterID + ' is in ' + id);
                        visit(afterID.toString(), ancestors.map(function (v) {
                            return v
                        })); // recursive call
                    });
                    sorted.unshift(id);
                });
                return sorted;
            }
        }
    })();
    return new Graph();
});
