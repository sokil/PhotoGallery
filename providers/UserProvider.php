<?php

namespace Sokil\Provider;

use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\User;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;

class UserProvider implements UserProviderInterface
{
    /**
     * @var \DOMDocument
     */
    private $imageList;

    public function __construct($configPath)
    {
        $this->domDocument = new \DOMDocument('1.0');
        $this->domDocument->load($configPath);

        $this->imageList = $this->domDocument->getElementsByTagName('users')->item(0);
    }

    public function loadUserByUsername($username)
    {
        $xpath = new \DOMXPath($this->domDocument);
        $userElement = $xpath->query("//*[@username='$username']")->item(0);
        if (!$userElement) {
            throw new UsernameNotFoundException(sprintf('Username "%s" does not exist.', $username));
        }

        $user = new User(
            $userElement->getAttribute('username'),
            $userElement->getAttribute('password'),
            explode(',', $userElement->getAttribute('roles')),
            true,
            true,
            true,
            true
        );

        return $user;
    }

    public function refreshUser(UserInterface $user)
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', get_class($user)));
        }

        return $this->loadUserByUsername($user->getUsername());
    }

    public function supportsClass($class)
    {
        return $class === 'Symfony\Component\Security\Core\User\User';
    }
}