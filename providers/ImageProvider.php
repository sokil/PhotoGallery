<?php

/**
 * This file is part of the PhotoGallery project.
 *
 * (c) Dmytro Sokil <dmytro.sokil@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Sokil\Provider;

/**
 * Provide list of images
 */
class ImageProvider
{
    /**
     * @var \DOMDocument
     */
    private $domDocument;

    /**
     * @var \DOMDocument
     */
    private $imageList;

    /**
     * @var bool
     */
    private $isMobile = false;

    /**
     * @var string
     */
    private $pathPrefix;

    /**
     * @param string $configPath
     * @param bool $isMobile
     */
    public function __construct($configPath, $isMobile = false)
    {
        $this->domDocument = new \DOMDocument('1.0');
        $this->domDocument->load($configPath);

        $this->imageList = $this->domDocument->getElementsByTagName('images')->item(0);

        $this->isMobile = $isMobile;

        $this->pathPrefix = $isMobile ? '/photo/mob/' : '/photo/web/';
    }

    /**
     * Get page of images
     *
     * @param int $pageNumber
     * @param int $length
     *
     * @return array
     */
    public function getPage($pageNumber, $length)
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

    /**
     * Get image metadata by slug
     *
     * @param string $slug
     *
     * @return array|null
     */
    public function getBySlug($slug)
    {
        $xpath = new \DOMXPath($this->domDocument);
        $imageElement = $xpath->query("//*[@slug='$slug']")->item(0);
        if (!$imageElement) {
            return null;
        }

        return $this->serializeImageElement($imageElement);
    }

    /**
     * @param \DOMElement $imageElement
     * @return array
     */
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