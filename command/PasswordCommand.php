<?php

/**
 * This file is part of the PhotoGallery project.
 *
 * (c) Dmytro Sokil <dmytro.sokil@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Sokil\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Security\Core\Encoder\PasswordEncoderInterface;

class PasswordCommand extends Command
{
    /**
     * @var PasswordEncoderInterface
     */
    private $encoder;

    /**
     * @param PasswordEncoderInterface $encoder
     */
    public function setEncoder(PasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    protected function configure()
    {
        $this
            ->setName('pass')
            ->setDescription('Encode plain password')
            ->addArgument('plainPassword', InputArgument::REQUIRED, 'Plain password')
            ->addArgument('passwordSalt', InputArgument::OPTIONAL, 'Plain salt', '');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     *
     * @return int|null|void
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        // find the encoder for a UserInterface instance
        $passwordHash = $this->encoder->encodePassword(
            $input->getArgument('plainPassword'),
            $input->getArgument('passwordSalt')
        );

        $output->writeln($passwordHash);
    }
}