define([
    'jquery',
    'underscore',
    'utility',
    'jquery/ui'
], function($, _, utility) {
    'use strict';

    $.widget('drgz.reposition', {
        options: {
            defaultBreakpoint: 'desktop',           /* The breakpoint the plugin considers default */
            resetOnReturn: true,                    /* Return back to the starting position on desktop */
            allBreakpoints: {
                container: null,                    /* This is a CSS selector */
                position: null,                     /* Number to set the index to be at or 'first', 'last' */
                searchDirectionFromElement: null    /* Can be "up" for parents and "down" for children */
            },
            desktopBreakpoint: {
                container: null,                    /* This is a CSS selector */
                position: null,                     /* Number to set the index to be at or 'first', 'last' */
                searchDirectionFromElement: null    /* Can be "up" for parents and "down" for children */
            },
            tabletBreakpoint: {
                container: null,                    /* This is a CSS selector */
                position: null,                     /* Number to set the index to be at or 'first', 'last' */
                searchDirectionFromElement: null    /* Can be "up" for parents and "down" for children */
            },
            mobileBreakpoint: {
                container: null,                    /* This is a CSS selector */
                position: null,                     /* Number to set the index to be at or 'first', 'last' */
                searchDirectionFromElement: null    /* Can be "up" for parents and "down" for children */
            }
        },

        _create: function () {
            var self = this;

            if ($(self.options.allBreakpoints.container).length) {
                self._reposition(self.element, self.options.allBreakpoints.container, self.options.allBreakpoints.position);
            }

            self._setupReset();
            self._bindEvents();

            self._checkPositions(utility.getCurrentBreakpoint());
        },

        _getContainer: function (breakpoint) {
            var self = this;
            var options;
            var container;
            if (breakpoint === 'mobile') {
                options = self.options.mobileBreakpoint;
            } else if (breakpoint === 'tablet') {
                options = self.options.tabletBreakpoint;
            } else if (breakpoint === 'desktop') {
                options = self.options.desktopBreakpoint;
            }

            if (!options.searchDirectionFromElement) {
                container = $(options.container);
            } else if (options.searchDirectionFromElement === 'up') {
                container = self.element.closest(options.container);
            } else if (options.searchDirectionFromElement === 'down') {
                container = self.element.find(options.container).first();
            } else {
                console.warn('Search direction "' + options.searchDirectionFromElement + '" invalid');
            }
            return container;
        },

        _setupReset: function () {
            var self = this;
            self.reset = {};
            if (self.options.resetOnReturn) {
                self.reset.breakpoint = utility.getCurrentBreakpoint();
                if (self.element.prev().length) {
                    self.reset.refElement = self.element.prev();
                    self.reset.action = 'insertAfter';
                } else if (self.element.next().length) {
                    self.reset.refElement = self.element.next();
                    self.reset.action = 'insertBefore';
                } else {
                    self.reset.refElement = self.element.parent();
                    self.reset.action = 'appendTo';
                }
            }
        },
        
        _bindEvents: function () {
            var self = this;

            $(window).on('breakpoint-change', _.throttle(function (event, breakpoint) {
                self._checkPositions(breakpoint);
            }, 200));
        },

        _checkPositions: function (breakpoint) {
            var self = this;

            if (breakpoint === 'mobile' && self._getContainer('mobile').length) {
                self._reposition(self.element, self._getContainer('mobile'), self.options.mobileBreakpoint.position);

            } else if (breakpoint === 'tablet' && self._getContainer('tablet').length) {
                self._reposition(self.element, self._getContainer('tablet'), self.options.tabletBreakpoint.position);

            } else if (breakpoint === 'desktop' && self._getContainer('desktop').length) {
                self._reposition(self.element, self._getContainer('desktop'), self.options.desktopBreakpoint.position);

            } else if (self.options.resetOnReturn) {
                self.element[self.reset.action](self.reset.refElement);
            }
        },

        _reposition: function (element, container, position) {
            if (position === null || position === 0 || position === 'first') {
                element.prependTo(container);
            } else if (position === 'last') {
                element.appendTo(container);
            } else if (!isNaN(position) && position < container.children().length) {
                element.insertAfter(container.children().eq(position));
            }
        }
    });

    return $.drgz.reposition;
});
