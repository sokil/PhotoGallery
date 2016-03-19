<?php

use Symfony\Component\Security\Core\Encoder\PlaintextPasswordEncoder;

// web/index.php
require_once __DIR__.'/vendor/autoload.php';

// init app
$app = new Silex\Application([
    'debug' => APPLICATION_ENV !== 'prod',
]);

$app['config'] = require_once __DIR__ . '/configs/app.php';

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__ . '/views',
));

// security
if ($app['config']['public'] === false) {
    $app->register(new Silex\Provider\SecurityServiceProvider(), [
        'security.encoder.digest' => $app->share(function ($app) {
            return new PlaintextPasswordEncoder();
        }),
        'security.firewalls' => [
            'main' => array(
                'anonymous' => false,
                'pattern' => '^/(?!login)',
                'form' => array('login_path' => '/login', 'check_path' => '/checkLogin'),
                'logout' => array('logout_path' => '/logout', 'invalidate_session' => true),
                'users' => $app->share(function($app) {
                    return new \Sokil\Provider\UserProvider(
                        __DIR__ . '/configs/userList.xml'
                    );
                }),
            ),
        ]
    ]);
}

$app['imageProvider'] = $app->share(function($app) {

    /* @var $mobileDetect \Detection\MobileDetect */
    $mobileDetect = $app['mobileDetect'];

    return new \Sokil\Provider\ImageProvider(
        __DIR__ . '/configs/imageList.xml',
        $app['isMobile']
    );
});

return $app;