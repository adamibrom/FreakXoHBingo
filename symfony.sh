#!/bin/bash

# include bash base
. _base.sh

# Create the Symfony needed directories
./symfony_directories.sh

# Check the needed config files and directories
# @note With Symfony 2.7 we don't need to check the config!
#./symfony_check.sh

# Install or update composer
./composer.sh

read -p "${orange}Clearing all caches (y/n)? ${reset}"
if [ "$REPLY" == "y" ]
then
    rm -rf app/cache/**
    #app/console cache:clear
    #app/console cache:clear --env=test
    echo "${underline}${green}All caches cleared!${reset}"
fi
echo "DONE${reset}"

read -p "${orange}Generate Propel Base and Map Files (y/n)? ${reset}"
./propel.sh

read -p "${orange}Generate and install static files (y/n)? ${reset}"
./assets.sh
