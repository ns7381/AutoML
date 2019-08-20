define(['App', 'common/util/ellipsis'], function(App) {
    return App.View({
        title: "Insight ML",
		ready: function () {
			this.$(".media-list").find(".media-desc").ellipsis({row: 3});
		}
    });
});