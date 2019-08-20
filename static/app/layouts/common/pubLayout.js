define(['App', 'jq/nicescroll'], function(App) {
    return {
        $pageMain: $([]),
        $pageContent: $([]),
        $window: $(window),
        overflow_x: '',
        overflow_y: '',
        overflow: '',
        $body: $([]),
        init: function(view) {
            var self = this;
            self.resize(view);
            this.$window.off('resize').on('resize', function(e) {
                self.resize(view);
            });
            var $li = view.$('aside > ul > li');
            var $li1 = $li.filter(function() {
                var $ul = $('ul', this);
                return $ul.length;
            });
            $li1.off('click').on('click', function() {
                var $this = $(this);
                setTimeout(function() {
                    var scrollbar = view.$sideBar.getNiceScroll(0);
                    var $ul = $('ul', $this),
                        $firstLi = view.$sideBar.children('li:first');
                    var selfHeight = $ul.height(),
                        liHeight = $firstLi.innerHeight();
                    var ulOffset = $ul.offset() || {},
                        sideOffset = $firstLi.offset() || {};
                    var sideHeight = view.$sideBar.innerHeight();
                    var diffHeight = ulOffset.top - sideOffset.top + selfHeight - sideHeight;
                    if (diffHeight > 0) {
                        var scrollHeight = diffHeight + selfHeight;
                        if (view.$sideBar.scrollTop() < scrollHeight) {
                            if (sideHeight < scrollHeight) {
                                scrollbar.doScrollTop(ulOffset.top - sideOffset.top - liHeight);
                            } else {
                                scrollbar.doScrollTop(scrollHeight);
                            }
                        }
                    }
                }, 400);
            });
        },
        getCss: function() {
            var body = document.getElementsByTagName('body')[0];
            this.overflow_x = body.style['overflow-x'];
            this.overflow_y = body.style['overflow-y'];
            this.overflow = body.style['overflow'];
        },
        setCss: function() {
            var $body = $('body');
            $body.css('overflow-x', this.overflow_x || 'auto');
            $body.css('overflow-y', this.overflow_y || 'auto');
            $body.css('overflow', this.overflow || 'auto');
        },
        resize: function(view) {
            this.$pageMain = $('#page-main');
            this.$pageContent = $('.page-content:first', this.$pageMain);
            this.adjustMainHeight(view, window);
            this.adjustMainScrollbar(view);
            this.adjustContentLeft(view);
            this.adjustContentHeight(view);
            this.adjustSideScrollbar(view, window);
        },
        adjustMainHeight: function(view, win) {
            var $win = win ? $(win) : this.$window,
                winH = $win.height(),
                mainOffset = this.$pageMain.offset() || {},
                mainH = winH - (mainOffset.top || 0);
            mainH = mainH <=0 ? 1 : mainH;
            this.$pageMain.css('height', mainH + 'px');
        },
        adjustContentLeft: function(view) {
            var $headerNav2 = $('#header-nav > nav[index="2"] > ul');
            var $headerVdc = $('#header-nav [index="vdc-cur"]');
            if (!view.$aside.length) {
                $headerVdc.length && $headerNav2.css('margin-left', "0");
                this.$pageContent.css('margin-left', "0");
            } else {
                var asideW = view.$aside.outerWidth(true) || 0,
                    asideMinW = parseFloat(view.$aside.css('min-width')) || 1,
                    contentMgL = parseFloat(this.$pageContent.css('margin-left')) || 1;
                // set margin
                if (contentMgL < asideMinW) {
                    $headerVdc.length && $headerNav2.css('margin-left', asideMinW+"px");
                    this.$pageContent.css('margin-left', asideMinW+"px");
                } else {
                    $headerVdc.length && $headerNav2.css('margin-left', asideW+"px");
                    this.$pageContent.css('margin-left', asideW+"px");
                }
            }
        },
        adjustContentHeight: function() {
            var contentMinH = this.$pageMain.height(),
                $contentParent = this.$pageContent.parent(),
                contentBorderH = $contentParent.outerHeight() - $contentParent.innerHeight();
            contentMinH -= contentBorderH;
            contentMinH = contentMinH <=0 ? 1 : contentMinH;
            this.$pageContent.css('min-height',contentMinH);
        },
        adjustMainScrollbar: function() {
            var scrollbar = this.$pageMain.getNiceScroll();
            if (!scrollbar || !scrollbar.length) {
                // 初始化滚动条
                this.$pageMain.niceScroll({
                    smoothscroll: false,
                    horizrailenabled: false,
                    autohidemode: false,
                    cursoropacitymin: 0.65,
                    cursoropacitymax: 0.75,
                    cursorcolor: "#999",
                    cursorwidth: "8px",
                    cursorborder: "0 none",
                    cursorborderradius: "3px 0 0 3px",
                    railpadding: {
                        top: 5,
                        bottom: 5
                    }
                });
            } else {
                scrollbar.resize();
            }
        },
        adjustSideScrollbar: function(view, win) {
            // resize sidebar
            var $win = win ? $(win) : this.$window,
                winH = $win.height(),
                sideBarOffset = view.$sideBar.offset() || {},
                sideBarH = winH - (sideBarOffset.top || 0);
            view.$sideBar.css('height', sideBarH + "px");
            // update scrollbar
            var scrollbar = view.$sideBar.getNiceScroll();
            if (!scrollbar || !scrollbar.length) {
                view.$sideBar.niceScroll({
                    smoothscroll: false,
                    horizrailenabled: false,
                    autohidemode: false,
                    cursoropacitymin: 1,
                    cursoropacitymax: 1,
                    cursorcolor: "#37b3e0",
                    cursorwidth: "4px",
                    cursorborder: "0 none",
                    cursorborderradius: "0"
                });
            } else {
                scrollbar.resize();
            }
        },
        sideBarIndex: null,
        activeSideBar: function(view, state, flag) {
            state = state || {};

            var path = state.path;

            var $curActive = view.$sideBar.find("li.active,a.active"),
                $curActiveWrapper = view.$sideBar.find("ul.in");

            var sideBarIndex = this.getSideBarIndex(view, state, flag);

            if (!sideBarIndex) {
                this.sideBarIndex = null;
                return this;
            }

            this.sideBarIndex = sideBarIndex;

            sideBarIndex = sideBarIndex.split(',');

            var $sideBar = view.$sideBar,
                $newActive = $([]),
                $newActiveWrapper = $([]),
                $li, $a, index;

            for (var i=0; i<sideBarIndex.length; i++) {
                index = sideBarIndex[i];
                $li = $sideBar.children('li:eq(' + (index - 1) + ')');
                $a = $li.children('a:first');
                $newActive = $newActive.add($li).add($a);
                $sideBar = $li.children('ul.nav:first');
                if (!$sideBar.length) break;
                $newActiveWrapper = $newActiveWrapper.add($sideBar);
            }

            $curActive.removeClass("active");
            $newActive.addClass("active");
            if ($a.length) {
                $a.focus();
                $a.css('outline', 'none');
            }

            $curActiveWrapper.each(function() {
                if (inWrapper(this, $newActiveWrapper) < 0) {
                    $(this).removeClass('in').css('height', 0);
                }
            });
            $newActiveWrapper.each(function() {
                if (inWrapper(this, $curActiveWrapper) < 0) {
                    $(this).addClass('collapse in').css('height', "auto");
                }
            });

            function inWrapper(src, $wrapper) {
                var pos = -1;
                $wrapper.each(function(i) {
                    if (src === this) {
                        pos = i;
                        return false;
                    }
                });
                return pos;
            }

            var selfHeight = $li.height();
            var liOffset = $li.offset() || {},
                sideOffset = view.$sideBar.children('li:first').offset() || {};

            var diffHeight = liOffset.top - sideOffset.top + selfHeight - view.$sideBar.innerHeight();
            if (diffHeight > 0) {
                var scrollHeight = diffHeight + selfHeight;
                if (view.$sideBar.scrollTop() < scrollHeight)
                    view.$sideBar.scrollTop(scrollHeight);
            }

            return this;
        },
        navIndex: null,
        prevNavIndex: null,
        activeHeader: function(view, state) {
            var index = this.getNavIndex(view, state);
            if (index) {
                var $li = view.$navWrapper.children('li:eq(' + (index - 1) + ')');
                if ($li && $li.length) {
                    view.$navWrapper.find("li.active").removeClass("active");
                    $li.addClass("active");
                }
                this.navIndex = index;
            } else {
                view.$navWrapper.find("li.active").removeClass("active");
                this.navIndex = null;
            }
            return this;
        },
        getNavIndex: function(view, state) {
            var menuIndex = this.getMenuIndex(view, state);
            menuIndex = menuIndex.split(',')[0] || '';
            return menuIndex;
        },
        getSideBarIndex: function(view, state, flag) {
            var menuIndex = this.getMenuIndex(view, state);
            if (!flag) {
                menuIndex = menuIndex.split(',').slice(1).join(',') || '';
            }
            return menuIndex;
        },
        activeNavIndex: function(view) {
            var $navWrapper = view.$navWrapper,
                $navItems = $navWrapper.children("li:not(.nav-animator)"),
                $navAnimator;
            var isListened = !!$navWrapper.data('listened');
            if (!isListened) {
                $navAnimator = $('<li class="nav-animator"></li>').appendTo($navWrapper);
            } else {
                $navAnimator = $navWrapper.children(".nav-animator");
            }
            var $navItemCur = $navWrapper.find('li.active'),
                navCurIndex = parseInt($navItemCur.attr("index")) || 0;
            $navWrapper.data('cur_index', navCurIndex);
            var paramAnimate = {'duration':300, 'queue':false};
            var getLeftDistanceByIndex = function(index){
                var result = 0, $navItem;
                index = parseInt(index) || 0;
                for (var i=1; i<index; i++) {
                    $navItem = $navWrapper.find('li[index="'+i+'"]');
                    result += $navItem.outerWidth(true);
                }
                return result;
            };
            var navItemAnim = function(index) {
                var curIndex = index || $navWrapper.data('cur_index'),
                    $curItem = $navWrapper.find('li[index="'+curIndex+'"]'),
                    width = $curItem.outerWidth(true);
                if ($curItem.length) {
                    if (!$navWrapper.data('listened') || $navAnimator.is(":hidden")) {
                        $navAnimator.css({display: "block", width: width, left: getLeftDistanceByIndex(curIndex)});
                    } else {
                        $navAnimator.animate({width: width, left: getLeftDistanceByIndex(curIndex)}, paramAnimate);
                    }
                } else {
                    $navAnimator.css({display: "none", width: 0, left: 0});
                }
            };
            navItemAnim(navCurIndex);
            if (!isListened) {
                $navItems.off("click.activeNav").on("click.activeNav", function(e) {
                    var index = parseInt($(this).attr('index')) || 0;
                    $navWrapper.data('cur_index', index);
                    // click to reload
                });
                $navItems.off("mouseenter.activeNav").on("mouseenter.activeNav",function() {
                    $(this).addClass("hover");
                    navItemAnim($(this).attr("index"));
                }).off("mouseleave.activeNav").on("mouseleave.activeNav",function() {
                    $(this).removeClass("hover");
                });
                $navWrapper.off("mouseleave.activeNav").on("mouseleave.activeNav",function() {
                    var $navItemCur = $navWrapper.find('li.active'),
                        navCurIndex = parseInt($navItemCur.attr("index")) || 0;
                    navItemAnim(navCurIndex);
                });
                $navWrapper.data('listened', true);
            }
        },
        getMenuIndex: function(view, state, menuMap) {
            if (!state) return '1';

            menuMap = menuMap || view.menuMap;

            var stateUrl = state.url || "", index;

            if (stateUrl) {
                index = menuMap[stateUrl];
            }

            if (index) return index;

            var regexpSlashEnd = /\/+$/,
                statePath = (state.path || "").replace(regexpSlashEnd, ""),
                posLastSlash;

            while (!index && statePath) {
                index = menuMap[statePath];
                if (index) break;
                posLastSlash = statePath.lastIndexOf('/');
                statePath = statePath
                    .substring(0, posLastSlash)
                    .replace(regexpSlashEnd, "");
            }

            return index || '';
        },
        parseMenuMap: function(view, menuList, menuIndex, level) {
            var menuMap;

            level = level || 0;

            if (level > 100) return menuMap;

            menuList = menuList || [];

            var regexpSlashEnd = /\/+$/;

            var menuItem, link;
            for (var i=0; i<menuList.length; i++) {
                menuItem = menuList[i];
                if (menuItem) {
                    // init menuIndex
                    if (!menuIndex) {
                        menuIndex = [];
                    } else if (!$.isArray(menuIndex)) {
                        menuIndex = (menuIndex + "").split(',');
                    }
                    menuIndex.push(i+1);
                    // init menuMap
                    if (menuItem.link) {
                        link = $.trim(menuItem.link).replace(regexpSlashEnd, "");
                        if (link.length) {
                            menuMap = menuMap || [];
                            menuMap[link] = menuIndex.join(',');
                        }
                    }
                    if (menuItem.childrenMenuList) {
                        menuMap = $.extend(
                            {}, menuMap,
                            this.parseMenuMap(view, menuItem.childrenMenuList, menuIndex.join(','), level + 1)
                        );
                    }
                    menuIndex = menuIndex.slice(0, -1);
                }
            }

            return menuMap || {};
        },
        destroy: function(view) {
            var sideScrollbar = view.$sideBar.getNiceScroll();
            if (sideScrollbar && sideScrollbar.length) {
                sideScrollbar.remove();
            }
        }
    };
});