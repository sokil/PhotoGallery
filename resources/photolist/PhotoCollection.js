var PhotoCollection = Backbone.Collection.extend({

    url: function() {
        return '/images?page=' + this.page;
    },

    parse: function(response) {
        return response.images;
    },

    model: Photo,

    page: 1,

    isLoadingStopped: false,

    initialize: function() {
        this.on('sync', function() {
            this.isLoadingStopped = false;
        });
    },

    loadNext: function() {
        if (this.isLoadingStopped) {
            return;
        }
        this.isLoadingStopped = true;

        this.page++;
        this.fetch();
    }
});