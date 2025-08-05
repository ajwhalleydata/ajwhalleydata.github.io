document.addEventListener('DOMContentLoaded', function() {
    fetch('includes/nav.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch nav.html: ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            // Insert content into placeholder
            const sidebarNav = document.getElementById('sidebar-nav');
            if (!sidebarNav) {
                console.error('Error: #sidebar-nav element not found');
                return;
            }
            sidebarNav.innerHTML = data;
            console.log('Nav content loaded successfully');

            // Re-initialize theme features with jQuery
            (function($) {
                var $window = $(window),
                    $body = $('body'),
                    $sidebar = $('#sidebar'),
                    $menu = $('#menu');

                // Log menu presence
                if ($menu.length === 0) {
                    console.error('Error: #menu element not found in loaded content');
                    return;
                }
                console.log('Found #menu element');

                // Re-init panel for hamburger toggle on #sidebar
                if ($sidebar.length > 0) {
                    $sidebar.panel({
                        delay: 500,
                        hideOnClick: false,
                        hideOnSwipe: true,
                        resetScroll: false,
                        resetForms: true,
                        side: 'left',
                        target: $body,
                        visibleClass: 'is-sidebar-visible'
                    });
                    console.log('Sidebar panel initialized');
                }

                // Re-init scrolly links and scrollex for section activation
                var $sidebar_a = $sidebar.find('a');
                $sidebar_a
                    .addClass('scrolly')
                    .on('click', function() {
                        var $this = $(this);
                        if ($this.attr('href').charAt(0) != '#') return;
                        $sidebar_a.removeClass('active active-locked');
                        $this.addClass('active active-locked');
                        console.log('Clicked link: ' + $this.attr('href'));
                    })
                    .each(function() {
                        var $this = $(this),
                            id = $this.attr('href'),
                            $section = $(id);
                        if ($section.length < 1) return;
                        $section.scrollex({
                            mode: 'middle',
                            top: '-20vh',
                            bottom: '-20vh',
                            initialize: function() { $section.addClass('inactive'); },
                            enter: function() {
                                $section.removeClass('inactive');
                                if ($sidebar_a.filter('.active-locked').length == 0) {
                                    $sidebar_a.removeClass('active');
                                    $this.addClass('active');
                                } else if ($this.hasClass('active-locked')) {
                                    $this.removeClass('active-locked');
                                }
                            }
                        });
                    });

                // Re-init expandable submenus in #menu
                var $menu_openers = $menu.find('ul.links .opener');
                console.log('Found ' + $menu_openers.length + ' opener elements');
                if ($menu_openers.length === 0) {
                    console.warn('Warning: No .opener elements found in #menu ul.links');
                }
                $menu_openers.each(function(index) {
                    var $this = $(this);
                    $this.off('click').on('click', function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        var $parentLi = $this.parent('li');
                        var isActive = $this.hasClass('active');
                        // Close other submenus
                        $menu.find('ul.links .opener').not($this).removeClass('active').parent('li').removeClass('active');
                        // Toggle this submenu
                        $this.toggleClass('active');
                        $parentLi.toggleClass('active');
                        console.log('Toggled opener #' + index + ': ' + $this.text() + ', Active: ' + !isActive);
                        // Trigger resize for sidebar adjustments
                        $window.trigger('resize.sidebar');
                    });
                });
            })(jQuery);
        })
        .catch(error => console.error('Error loading navigation:', error));
});