define(['App', 'jquery', 'common/ui/datatables', 'common/ui/modal', 'common/ui/validator', 'bs/datetimepicker'], function (App, $, DataTables, Modal) {
    return App.View({
        $table: $([]),
        ready: function () {
            var self = this;
            //dataTables
            var $table = $('#AuditTable');
            this.set('$table', $table);
            self.initTable(function () {
                //self.bind($('.btn-add', $tableTop), 'click', self.add);
                self.formDate()
            });
        },
        initTable: function (callback) {
            var self = this;
            DataTables.init(self.$table, {
                "serverSide": true,  //页面在加载时就请求后台，以及每次对 datatable 进行操作时也是请求后台
                "ajax": DataTables.parseAjax(
                    self,
                    self.$table,
                    '/api/v1/audit_logs/page/{pageNo}/{pageSize}'
                ), //ajax源，后端提供的分页接口
                "columns": [
                    {
                        "width": "check",
                        "defaultContent": "<label><input type='checkbox'></label>"
                    },
                    {"data": "login_name", "width": "8em"},
                    {"data": "request_url"},
                    {"data": "request_method", "width": "8em"},
                    {"data": "result", "width": "5em"},
                    {
                        "data": "create_time", "width": "datetime",
                        render: function (data, type, rowData, cellApi) {
                            return data.substring(0, 19);
                        }
                    },
                    {
                        "data": {},
                        "width": "3em",
                        "render": function (data, type, row) {
                            return '<a href="' + self.getUrl('/sysmanagement/audit/detail', {id: data.id}) + '" data-toggle="tooltip" title="查看详细"><i class="fa fa-list"></i></a>'
                        }
                    }
                ]
            }, callback)
        },
        formDate: function () {
            $('.form_datetime').datetimepicker({
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                forceParse: 0,
                showMeridian: 1
            });
        }
    })
})
