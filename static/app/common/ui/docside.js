define(['jquery', 'bs/collapse'], function($) {

    $.fn.docSideMenu = function() {

        var $sideMenu,
        	$sideBar = $('aside'),
            $body = $('.article-body:first'),
            $pageMain = $('#page-main');

        if (this.is('#side-menu')) {
            $sideMenu = this;
        } else {
            $sideMenu = this.find('#side-menu');
        }

        $sideMenu.metisMenu().on("click", "li > a", function(e) {
            e.preventDefault();

            var href = $(this).attr('href'),
                posHash = href.lastIndexOf('#'),
                id = href.substring(posHash + 1);

            var $toEl = id ? $('#' + id, $body) : $([]);

            if ($toEl.length) {
                var bodyOffset = $body.offset() || {},
                    bodyTop = bodyOffset.top || 0;

                bodyTop += (parseInt($body.css('padding-top')) || 0);

                var toTop = $toEl.offset().top || 0,
                    posTop = toTop - bodyTop;

                $pageMain.scrollTop(posTop);
            }

            return false;
        });
        
        var resetScrollbar = function() {
        	var scrollbarSide = $sideBar.getNiceScroll();
            if (!scrollbarSide || !scrollbarSide.length) {
            	$sideBar.niceScroll({
                    smoothscroll: false,
                    horizrailenabled: false,
                    cursoropacitymin: 0.65,
                    cursoropacitymax: 0.75,
                    cursorcolor: "#999",
                    cursorwidth: "4px",
                    cursorborder: "0 none",
                    cursorborderradius: "0"
                });
            } else {
                scrollbarSide.resize();
            }
        };
        
        $(window).resize(resetScrollbar);
        
        resetScrollbar();

        return this;
    };

});