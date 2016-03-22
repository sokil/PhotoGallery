<?php

namespace Sokil\Provider;

class ImageProvider
{
    private $domDocument;

    /**
     * @var \DOMDocument
     */
    private $imageList;

    private $isMobile = false;

    private $pathPrefix;

    public function __construct($configPath, $isMobile = false)
    {
        $this->domDocument = new \DOMDocument('1.0');
        $this->domDocument->load($configPath);

        $this->imageList = $this->domDocument->getElementsByTagName('images')->item(0);

        $this->isMobile = $isMobile;

        $this->pathPrefix = $isMobile ? '/photo/mob/' : '/photo/web/';
    }

    public function getPage($pageNumber, $length = 20)
    {
        $images = $this->imageList->getElementsByTagName('image');
        $offset = ($pageNumber - 1) * $length;

        $list = [];

        for ($i = $offset; $i < $offset + $length; $i++) {
            $imageElement = $images->item($i);
            if (!$imageElement) {
                break;
            }

            $list[] = $this->serializeImageElement($imageElement);
        }

        return $list;
    }

    public function getBySlug($slug)
    {
        $xpath = new \DOMXPath($this->domDocument);
        $imageElement = $xpath->query("//*[@slug='$slug']")->item(0);
        if (!$imageElement) {
            return null;
        }

        return $this->serializeImageElement($imageElement);
    }

    private function serializeImageElement(\DOMElement $imageElement)
    {
        return [
            'src'           => $this->pathPrefix . $imageElement->getAttribute('src'),
            'title'         => $imageElement->getAttribute('title'),
            'description'   => $imageElement->getAttribute('description'),
            'slug'          => $imageElement->getAttribute('slug')
        ];
    }
}