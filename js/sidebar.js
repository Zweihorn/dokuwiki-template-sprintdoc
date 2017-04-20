/**
 * Sets up the sidebar behaviour
 */
jQuery(function () {
    var $nav = jQuery('#dokuwiki__aside');
    if (!$nav.length) return;

        /**
         * closes sidebar
         */
    var setWideContent = function () {
            $nav.find('div.nav-panel').hide(); // close all panels
            jQuery('body').addClass('wide-content');
            removeToggleStorage();
            window.sessionStorage.setItem('wide-content', true);
        },

        /**
         * removes information about the toggle-state
         */
        removeToggleStorage = function () {
            for (var index=0; index <= window.sessionStorage.length; index += 1) {
                var item = window.sessionStorage.getItem('sidebar-section-' + index + '-open');
                if (!item) {
                    continue;
                }
                window.sessionStorage.removeItem('sidebar-section-' + index + '-open');
            }
        },

        /**
         * opens the sidebar
         */
        setDefaultContent = function () {
            jQuery('body').removeClass('wide-content');
            window.sessionStorage.setItem('wide-content', false);
        },

        /**
         * Accessibility helper, focuses the first link witih the given element
         *
         * @param {jQuery} $elem
         */
        focusFirstSubLink = function ($elem) {
            $elem.find('a').first().focus();
        },

        /**
         * Toggle a navigation panel
         *
         * @param {jQuery} $toggler The h6 toggler
         */
         toggleNav = function ($toggler) {
            var $panel = $toggler.next('div.nav-panel');
            var isOpen = $panel.is(':visible');
            // open sidebar on interaction
            setDefaultContent();
            // toggle the panel, focus first link after opening
            $panel.dw_toggle(!isOpen, function () {
                if (!isOpen) {
                    focusFirstSubLink($panel);
                }
            });
            window.sessionStorage.setItem('sidebar-section-' + $toggler.data('index') + '-open', !isOpen);
        },

        /**
         * Initialize the content navigation
         *
         * It mangles the sidebar content and handles inline Icon configuration
         */
        initContentNav = function () {
            var $main = $nav.find('nav.nav-main');
            if (!$main.length) return;

            if(jQuery('body').hasClass('wide-content')) {
                removeToggleStorage();
            }

            var ELEMENT = JSINFO.template.sprintdoc.sidebar_toggle_elements;
            var $elements = $main.find(ELEMENT);
            $elements.each(function (index) {
                var $me = jQuery(this),

                // prepare text and the optional icon
                    data = $me.text().split('@', 2),
                    text = data[0].trim();

                var $icon = jQuery('<span class="ico">')
                    .text(text.substr(0, 1).toUpperCase() + text.substr(1, 1).toLowerCase())
                    .wrapInner('<strong>');
                if (data[1]) {
                    var src = data[1].trim();
                    $icon.load(DOKU_BASE + 'lib/tpl/sprintdoc/svg.php?svg=' + src + '&e=1'); // directly embed
                }

                // make the new toggler
                var $toggler = jQuery('<a>')
                        .addClass('nav')
                        .attr('href', '#')
                        .attr('role', 'heading')
                        .attr('aria-level', '2')
                        .text(text)
                        .wrapInner('<span class="lbl">')
                        .prepend($icon)
                        .data('index', index)
                    ;

                // wrap all following siblings til the next element in a wrapper
                var $wrap = jQuery('<div>')
                    .addClass('nav-panel');
                var $sibs = $me.nextAll();
                for (var i = 0; i < $sibs.length; i++) {
                    var $sib = jQuery($sibs[i]);
                    if ($sib.is(ELEMENT)) break;
                    $sib.detach().appendTo($wrap);
                }
                $wrap.insertAfter($me);

                // replace element with toggler
                $me.replaceWith($toggler);

                if ($toggler.parent('li').length) {
                    $toggler.parent('li').addClass('toggler');
                }

                if (window.sessionStorage.getItem('sidebar-section-' + index + '-open') === 'true') {
                    $wrap.css('display', 'block');
                }

            });
        },

        /**
         * Initialize the open/close toggling of menu entries
         */
        initMenuHandling = function () {
            $nav.on('click', 'a.nav', function (e) {
                toggleNav(jQuery(this));
                e.preventDefault();
            });
        },

        /**
         * Make sure the content area is always as high as the sidebar
         */
        initContentMinHeight = function () {
            var $sidebar = jQuery('.page-wrapper').find('> .tools').find('.col-xs-12');
            if ($sidebar.length == 1) {
                var num = parseFloat($sidebar.height());
                if (!isNaN(num)) {
                    jQuery('#dokuwiki__content').css('minHeight', num + 100);
                }
            }
        },

        /**
         * Initialize the sidebar handle behaviour
         */
        initSidebarToggling = function () {
            var $toggler = jQuery('.togglelink.page_main-content').find('a');
            $toggler.click(function (e) {
                e.preventDefault();
                if (jQuery('body').hasClass('wide-content')) {
                    setDefaultContent();
                } else {
                    setWideContent();
                }
            });

            if (window.sessionStorage.getItem('wide-content') === 'true') {
                setWideContent();
            }
        },

        /**
         * Show sidebar when accessing the search
         */
        initSearchToggling = function () {
            jQuery('.toggleSearch').find('a').click(function (e) {
                setDefaultContent();
                e.preventDefault();
                jQuery('#qsearch__in').focus();
            });

        },

        /**
         * Open and close the sidebar in mobile view
         */
        initMobileToggling = function () {
            jQuery('.menu-togglelink').find('a').click(function (e) {
                e.preventDefault();
                var $body = jQuery('body');
                $body.toggleClass('show-mobile-sidebar');
            });
        };

    // main
    initContentNav();
    initSidebarToggling();
    initMenuHandling();
    initContentMinHeight();
    initSearchToggling();
    initMobileToggling();
});

