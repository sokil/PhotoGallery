<?php

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