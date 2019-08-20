define(['App'], function(App) {
    return App.View({
    	data: function() {
    		var id = this.getParam('id');
            return App.remote("/api/v1/audit_logs/"+id);
        }
    });
});
