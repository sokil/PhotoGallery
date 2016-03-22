var PhotoListView = Backbone.View.extend({

    socialButtons: false,

    initialize: function(options) {
        this.socialButtons = options.socialButtons;
        this.collection.on('sync', this.render);
    },

    render: function() {
        var pattern = '<div class="image standby"><img src="{{path}}"></div>',
            elements = [],
            socialButtonPatterns = {
                fb: '<a class="share share-fb icon-share-fb" href="https://www.facebook.com/sharer/sharer.php?src=pluso&u=http%3A%2F%2F' + location.origin + '%2Fparis%2F{{slug}}&t={{title}}" target="_blank"></a>',
                pinterest: '<a class="share share-pinterest icon-share-pinterest" data-pin-config="hidden" data-pin-do="buttonPin" data-pin-custom="true" href="//www.pinterest.com/pin/create/button/?url=http%3A%2F%2F' + location.origin + '%2Fparis%2F{{slug}}&media=http://' + location.origin + '%2F{{path}}&description={{title}}"></a>',
                twitter: '<a class="share share-twitter icon-share-twitter" href="https://twitter.com/intent/tweet?url=http%3A%2F%2F' + location.origin + '%2Fparis%2F{{slug}}&text={{title}}" target="_blank"></a>'
            },
            isMobile = this.$el.hasClass('mobile');

        for(var i = 0; i < this.collection.length; i++) {

            var photo = this.collection.at(i);

            // create element
            elements[i] = $(
                pattern
                    .replace('{{path}}', photo.get('src'))
                    .replace('{{slug}}', photo.get('slug'))
                    .replace('{{title}}', photo.get('title'))
            );

            // add social buttons
            if (this.socialButtons) {
                var $shareButtons = $('<div class="share-buttons"></div>').appendTo(elements[i]);
                for(var socialId in socialButtonPatterns) {
                    var shareButton = socialButtonPatterns[socialId]
                        .replace('{{path}}', photo.get('src'))
                        .replace('{{title}}', photo.get('title'))
                        .replace('{{slug}}', photo.get('slug'));
                    $shareButtons.append(shareButton);
                }

                // click
                elements[i]
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
        }

        this.$el.append(elements);

        // show img on load

        this.$el.find('img').each(function() {
            $(this).parent().removeClass('standby');
        });
    },

    loadNext: function() {
        this.collection.loadNext();
    }
});
