function renderPhotoList(photoList, options) {
    var pattern = '<div class="image" data-id="{{id}}"><img src="{{path}}"></div>',
        $container = $('#photoList'),
        elements = [],
        cacheImgElements = [],
        socialButtonPatterns = {
            fb: '<a class="share share-fb icon-share-fb" href="https://www.facebook.com/sharer/sharer.php?src=pluso&u=http%3A%2F%2F' + options.host + '%2Fparis%2F{{slug}}&t={{title}}" target="_blank"></a>',
            pinterest: '<a class="share share-pinterest icon-share-pinterest" data-pin-config="hidden" data-pin-do="buttonPin" data-pin-custom="true" href="//www.pinterest.com/pin/create/button/?url=http%3A%2F%2F' + options.host + '%2Fparis%2F{{slug}}&media=http://' + options.host + '%2F{{path}}&description={{title}}"></a>',
            twitter: '<a class="share share-twitter icon-share-twitter" href="https://twitter.com/intent/tweet?url=http%3A%2F%2F' + options.host + '%2Fparis%2F{{slug}}&text={{title}}" target="_blank"></a>'
        },
        isMobile = $container.hasClass('mobile');

    for(var i in photoList) {
        (function(i) {
            // create element
            elements[i] = $(
                pattern
                    .replace('{{path}}', photoList[i].src)
                    .replace('{{id}}', photoList[i].id)
                    .replace('{{slug}}', photoList[i].slug)
                    .replace('{{title}}', photoList[i].title)
            );

            if (options.socialButtons) {
                // add social buttons
                var $shareButtons = $('<div class="share-buttons"></div>').appendTo(elements[i]);
                for(var socialId in socialButtonPatterns) {
                    var shareButton = socialButtonPatterns[socialId]
                        .replace('{{path}}', photoList[i].src)
                        .replace('{{title}}', photoList[i].title)
                        .replace('{{id}}', photoList[i].id)
                        .replace('{{slug}}', photoList[i].slug);
                    $shareButtons.append(shareButton);
                }

                // click
                elements[i]
                    .hide()
                    .find('img')
                    .click(function() {
                        if (isMobile) {
                            // hide all share buttons
                            $('.share-buttons').hide();
                            // show current
                            elements[i].find('.share-buttons').fadeIn();
                        }
                    });
            }

            // cache and load
            cacheImgElements[i] = new Image();
            cacheImgElements[i].onload = function() {
                elements[i].fadeIn();
            }
            cacheImgElements[i].src = photoList[i].src;
        })(i);
    }

    $container.append(elements);
}

// scroll-top
$(function() {
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
});


// load images on scroll
(function() {
    var isLoadingStopped = false,
        page = 2;

    // click on share
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

    // request
    var requestPage = function() {
        // action in progress
        if (isLoadingStopped) {
            return;
        }

        isLoadingStopped = true;

        // do action
        $.get('/images?page=' + page, function(response) {
            renderPhotoList(response.images);
            if (response.images.length == length) {
                page++;
                isLoadingStopped = false;
            }
        });
    };

    // page on scroll
    $(window).scroll(function() {
        var scrollPosition = parseInt($(document).scrollTop());
        var documentHeight = $(document).height();
        var windowHeight = $(window).height();
        var positionShift = 300;

        // check if action required
        if (documentHeight - scrollPosition > windowHeight + positionShift) {
            return;
        }

        requestPage();
    });
})();
