#!/bin/bash

# include bash base
. _base.sh

# get the env
env="$1"

echo "${underline}${green}Delete ALL Assets${reset}"
rm web/bundles/** -rf
rm web/css/** -rf
rm web/fonts/** -rf
rm web/images/** -rf
rm web/img/** -rf
rm web/js/** -rf

if [ "$1" == "prod" ] || [ "$1" == "dev" ] || [ "$1" == "test" ]
then
    env="$1"
else
    # Ask for the environment until the answer is right :)
    while read -p "${orange}Chose a environment like prod, dev or test: ${reset}" answer; do
        if [ $answer == "prod" ] || [ $answer == "dev" ] || [ $answer == "test" ]
        then
            env=$answer
            echo "${underline}${green}The $env environment will be used!${reset}"
            break
        else
            echo "${magenta}Wrong environment $answer given. Please chose a environment like prod, dev or test!${reset}"
        fi
    done
fi

echo "${underline}${green}Clearing the Cache...${reset}"
app/console cache:clear --env="$env" --no-warmup
echo "${underline}${green}Warming up the Cache...${reset}"
app/console cache:warmup --env="$env"

if [ "$env" == "dev" ]
then
    echo "${underline}${green}Dumping the Assets...${reset}"
    app/console assetic:dump --env="$env"
    echo "${underline}${green}Installing the Assets...${reset}"
    app/console assets:install --env="$env" --symlink
    echo "${underline}${green}Fix Cache Dir and File Mod${reset}"
    find app/cache -type d -exec chmod -v 775 {} \;
    find app/cache -type f -exec chmod -v 664 {} \;
else
    echo "${underline}${green}Dumping the Assets...${reset}"
    app/console assetic:dump --env="$env" --no-debug
    echo "${underline}${green}Installing the Assets...${reset}"
    app/console assets:install --env="$env"
    echo "${underline}${green}Fix Cache Dir and File Mod${reset}"
    find app/cache -type d -exec chmod 775 {} \;
    find app/cache -type f -exec chmod 664 {} \;
fi
