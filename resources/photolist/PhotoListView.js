var PhotoListView = Backbone.View.extend({

    socialButtons: false,

    isMobile: false,

    imageBlockPattern: '<div class="image standby"><img src="{{path}}"></div>',

    initialize: function(options) {

        this.isMobile = this.$el.hasClass('mobile');

        // define social buttons patterns
        var host = encodeURIComponent(location.origin);
        this.socialButtonPatterns = {
            fb: '<a class="share share-fb icon-share-fb" href="https://www.facebook.com/sharer/sharer.php?src=pluso&u=' + host + '%2Fphoto%2F{{slug}}&t={{title}}" target="_blank"></a>',
            pinterest: '<a class="share share-pinterest icon-share-pinterest" data-pin-config="hidden" data-pin-do="buttonPin" data-pin-custom="true" href="//www.pinterest.com/pin/create/button/?url=' + host + '%2Fphoto%2F{{slug}}&media=http://' + location.origin + '%2F{{path}}&description={{title}}"></a>',
            twitter: '<a class="share share-twitter icon-share-twitter" href="https://twitter.com/intent/tweet?url=' + host + '%2Fphoto%2F{{slug}}&text={{title}}" target="_blank"></a>'
        };

        this.$el.css({'min-height': (this.collection.length * 600) + "px"});

        this.socialButtons = options.socialButtons;
        this.listenTo(this.collection, 'sync', this.render);
    },

    render: function() {
        var elements = [];

        for(var i = 0; i < this.collection.length; i++) {

            var photo = this.collection.at(i);

            // create element
            elements[i] = $(
                this.imageBlockPattern
                    .replace('{{path}}', photo.get('src'))
                    .replace('{{slug}}', photo.get('slug'))
                    .replace('{{title}}', photo.get('title'))
            );

            // add social buttons
            if (this.socialButtons) {
                var $shareButtons = $('<div class="share-buttons"></div>').appendTo(elements[i]);
                for(var socialId in this.socialButtonPatterns) {
                    var shareButton = this.socialButtonPatterns[socialId]
                        .replace('{{path}}', photo.get('src'))
                        .replace('{{title}}', photo.get('title'))
                        .replace('{{slug}}', photo.get('slug'));
                    $shareButtons.append(shareButton);
                }

                // click
                elements[i]
                    .find('img')
                    .click(function() {
                        if (this.isMobile) {
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
            var $img = $(this);
            $img.load(function() {
                $img.parent().removeClass('standby');
            });
        });
    },

    loadNext: function() {
        this.collection.loadNext();
    }
});
