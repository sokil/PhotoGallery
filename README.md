# Photo Gallery

## Installation

```sh
$ composer create-project sokil/photo-gallery
$ cd photo-gallery
$ npm install
$ grunt
```

## Configure images

Configure images in `./configs/imageList.xml`:

```xml
<?xml version="1.0"?>
<images>
    <image
        src="filename.png"
        slug="addressInUri"
        title="Image Title"
        description="Image description"
    />
</images>
```

Add images to `./public/photo/web/` and `./public/photo/mob/` for desktop and mobile versions.
 
