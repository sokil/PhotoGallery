var App = function(options) {

    // init photo list
    this.initPhotoList(
        options.photoList,
        options.socialButtons
    );

    // load photo list on scroll
    this.initScroll();

    // click on shared buttons
    this.initShareButtons();

    // click on scroll-top
    this.initScrollTop();
};

App.prototype = {
    photoListView: null,

    // page on scroll
    initScroll: function() {
        var self = this;

        $(window).scroll(function() {
            var scrollPosition = parseInt($(document).scrollTop());
            var documentHeight = $(document).height();
            var windowHeight = $(window).height();
            var positionShift = 300;

            // check if action required
            if (documentHeight - scrollPosition > windowHeight + positionShift) {
                return;
            }

            self.photoListView.loadNext();
        });
    },

    // click on share
    initShareButtons: function() {
        $('#photoList').on('click', '.share-fb, .share-twitter', function(e) {
            e.preventDefault();
            var $a = $(this);
            var height = $a.hasClass('share-fb') ? 550 : 290;
            window.open(
                $a.attr('href'),
                'share',
                'height=' + height + ', width=700'
            );
        });

    },

    // load images on scroll
    initPhotoList: function(photoList, socialButtons) {
        this.photoListView = new PhotoListView({
            el: '#photoList',
            collection: new PhotoCollection(
                photoList
            ),
            socialButtons: socialButtons
        });
        this.photoListView.render();
    },

    // scroll-top
    initScrollTop: function() {
        var toggleScrollTopVisibility = function() {
            if ($(window).scrollTop() > 0) {
                $('#toTop').addClass('active');
            } else {
                $('#toTop').removeClass('active');
            }
        };

        $('#toTop').click(function() {
            $(document.body).animate({scrollTop: 0}, 700, 'swing');
        });
        $(window).scroll(function(e) {
            toggleScrollTopVisibility();
        });
        toggleScrollTopVisibility();
    }
};