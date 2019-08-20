define(['App', 'jquery', 'common/ui/datatables', 'common/ui/modal', 'common/ui/validator', 'jq/chosen', 'common/ui/filedownload'], function (App, $, DataTables, Modal, Bind) {
    return App.View({
        $table: $([]),
        sources: {},
        cols: ['abc', 'def'],
        ready: function () {
            var self = this;
            var $table = this.$("#table-model-overview");
            this.set('$table', $table);
            this.initTablePrivate(function () {
                self.bind('click', $('.btn-download', $table), self.downloadModel);
                $table.on('draw.dt', function () {
                    $('[data-toggle="popover_context"]').popover();
                });
                $('[data-toggle="popover_context"]').popover();
            });
        },
        initTablePrivate: function (callback) {
            DataTables.init(this.$table, {
                    serverSide: true,
                    ajax: this.tableAjax(),
                    columns: [{
                        'data': "",
                        'width': "check",
                        'defaultContent': '<label><input type="checkbox"></label>'
                    }, {
                        'data': "id",
                        'width': "8em"
                    }, {
                        'data': "name",
                        'width': "4em"
                    }, {
                        'data': "method",
                        'width': "5em",
                    }, {
                        'data': "project_name",
                        'width': "5em"
                    }, {
                        'data': "create_time",
                        'width': "5em",
                        render: function (data, type, rowData, cellApi) {
                            return data ? data.substring(0, 19) : "";
                        }
                    }, {
                        'data': "",
                        'width': "3em",
                        'render': function (data, type, rowData, cellApi) {
                            return (
                                '<a class="btn btn-opt btn-download" title="模型下载" data-toggle="tooltip">' +
                                '<i class="fa fa-download"></i>' +
                                '</a>'
                            );
                        }
                    }]
                },
                callback);
        },
        tableAjax: function () {
            var self = this;
            return DataTables.parseAjax(this, this.$table, {
                url: '/api/v1/models/page/{pageNo}/{pageSize}'
            });
        },
        formValidator: function ($form) {
            return $form ? $form.validate({
                errorContainer: "_form",
                errorPlacement: "left bottom",
                rules: {
                    'model_name': {
                        required: true,
                        maxlength: 255,
                        minlength: 2
                    },
                    'model_type': {
                        required: true
                    },
                    'read_type': {
                        required: true
                    },
                    'split_rate': {
                        required: true
                    }
                }
            }) : null;
        },
        downloadModel: function (e) {
            var self = this;
            var row = $(e.currentTarget).data("row.dt"),
                rowData = row.data(),
                id = rowData.id,
                name = rowData.name;
            var keywords = App.highlight('模型' + name, 2);
            Modal.confirm({
                title: "下载模型",
                message: '确定要下载' + keywords + '吗?',
                callback: function (result) {
                    if (result) {
                        var processor = Modal.success("开始下载" + keywords);
                        $.fileDownload(App.getRootUrl('/api/v1/models/' + id + "/download"), {
                            successCallback: function (url) {
                                // processor.success(keywords + '下载成功');
                            },
                            failCallback: function (html, url) {
                                // processor.error(keywords + '下载失败');
                            }
                        });
                    }
                }
            });
        },
    });
});