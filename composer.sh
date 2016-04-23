#!/bin/bash

# include bash base
. _base.sh

# get action
action="$1"

if [ "$2" == "prod" ] || [ "$2" == "dev" ] || [ "$2" == "test" ]
then
    env="$2"
else
    env="prod"
fi

# Install or update composer
if [ ! -f composer.phar ]
then
    curl -s https://getcomposer.org/installer | php
    echo "${underline}${green}Composer installed${reset}"
else
    if [ "$action" != "i" ] && [ "$action" != "u" ] && [ "$action" != "r" ]
    then
        read -p "${orange}Self update composer (y/n)? ${reset}"
    fi

    if [ "$REPLY" == "y" ] || [ "$action" == "i" ] || [ "$action" == "u" ] || [ "$action" == "r" ]
    then
        php composer.phar self-update
        echo "${underline}${green}Composer updated${reset}"
    fi
fi

if [ "$action" != "i" ] && [ "$action" != "u" ] && [ "$action" != "r" ]
then
    read -p "${orange}(i) Install or (u) update or (r) reinstall composer packages (i/u/r/n)? ${reset}"
fi

if [ "$env" == "prod" ]
then
    export SYMFONY_ENV=prod
    param="--optimize-autoloader "
else
    param=""
fi

if [ "$REPLY" == "i" ] || [ "$action" == "i" ]
then
    php composer.phar install $param
    echo "${underline}${green}Composer packages installed${reset}"
elif [ "$REPLY" == "u" ] || [ "$action" == "u" ]
then
    php composer.phar update $param
    echo "${underline}${green}Composer packages updated${reset}"
elif [ "$REPLY" == "r" ] || [ "$action" == "r" ]
then
    rm vendor/* -rf
    php composer.phar install $param
    echo "${underline}${green}Composer packages installed${reset}"
fi
