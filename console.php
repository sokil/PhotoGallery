<?php

// Define application environment
defined('APPLICATION_ENV') || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'prod'));

/* @var $app \Silex\Application */
$app = require_once __DIR__.'/bootstrap.php';

$app['console'] = new \Symfony\Component\Console\Application();

// password
$passwordCommand = new \Sokil\Command\PasswordCommand();
$passwordCommand->setEncoder($app['security.encoder.digest']);
$app['console']->add($passwordCommand);

$app->boot();
$app['console']->run();