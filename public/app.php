<?php

// Define application environment
defined('APPLICATION_ENV') || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'prod'));

// bootstrap
require_once __DIR__ . '/../bootstrap.php';

// sessions
$app->register(new Silex\Provider\SessionServiceProvider(), [
    'session.storage.options' => [
        'name' => 'sid',
    ]
]);

$app['mobileDetect'] = $app->share(function($app) {
    return new \Detection\MobileDetect();
});

$app['isMobile'] = $app->share(function($app) {
    return $app['mobileDetect']->isMobile();
});

// login
$app->get('/login', function() use($app) {
    $token = $app['security.token_storage']->getToken();
    if ($token) {
        $app->redirect('/');
    }
    return $app['twig']->render('login.twig');
});

$app->post('/checkLogin', function() use($app) {

});

$app->post('/logout', function() use($app) {

});

/**
 * Index page
 */
$app->get('/', function () use ($app) {
    return $app['twig']->render('photolist.twig',[
        'images'    => $app['imageProvider']->getPage(
            1,
            $app['config']['imageList']['pageLength']
        ),
        'isMobile'  => $app['isMobile'],
        'socialButtons' => $app['config']['socialButtons'],
        'title' => $app['config']['title'],
        'contactEmail' => $app['config']['contactEmail'],
    ]);
});

/**
 * Image list page
 */
$app->get('/images', function () use ($app) {

    $page = (int) $app['request']->get('page');
    if (!$page) {
        $page = 1;
    }

    $imagesPage = $app['imageProvider']->getPage(
        $page,
        $app['config']['imageList']['pageLength']
    );

    return $app->json([
        'images' => $imagesPage,
    ]);
});

$app->get('/paris/{slug}', function ($slug) use ($app) {

    // image
    $image = $app['imageProvider']->getBySlug($slug);

    // open graph
    $openGraph = new \Sokil\OpenGraph;
    $metaTags = $openGraph
        ->setTitle($image['title'])
	    ->setDescription($image['description'])
        ->setType(\Sokil\OpenGraph::TYPE_WEBSITES_ARTICLE)
        ->setImage('http://' . $_SERVER['HTTP_HOST'] . $image['src'])
        ->setUrl('http://' . $_SERVER['HTTP_HOST'] . '/paris/' . $slug)
        ->render();

    // render
    return $app['twig']->render('image.twig', [
        'image'     => $image,
        'openGraph' => $metaTags,
        'isMobile'  => $app['isMobile'],
    ]);
});

$app->run();
