#!/bin/bash

# include bash base
. _base.sh

#echo $PWD
#echo "${PWD##*/}"

read -p "${orange}Delete all Propel generated data (y/n)? ${reset}"
if [ "$REPLY" == "y" ]
then
    # Delete all Propel generated data
    # @todo find and remove all third party bundle propel generated files
    rm -rf src/*Bundle/Propel/Base/**
    rm -rf src/*Bundle/Propel/Map/**
    echo "${underline}${green}All Propel generated data deleted!${reset}"
fi

read -p "${orange}Build all Propel generated data (y/n)? ${reset}"
if [ "$REPLY" == "y" ]
then
    rm app/propel/sql/sqldb.map
    app/console propel:build
    echo "${underline}${green}All Propel generated data created!${reset}"
fi

#read -p "${orange}Recreate base db with Propel (y/n)? ${reset}"
#if [ "$REPLY" == "y" ]
#then
#    # Create base db with propel
#    #app/console propel:database:drop --force
#    #app/console propel:database:create
#    #app/console propel:sql:insert --force
#    echo "${underline}${green}No! This is to dangerous! All data will be lost! Make sure you have a backup first and run the commands by hand!${reset}"
#fi
