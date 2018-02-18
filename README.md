# 42-matcha

Ecole 42 project

## Goal

Matcha is a dating web application based on geolocation and matching.

## Set up

```sh

# Brew version
➜ brew update

# Install NodeJS + MongoDB
➜ brew install node mongo

# Install all modules and start client server
➜ sh script/install.sh

# Start mongo server
➜ mongod
or
➜ mongod -dbpath ~/data/db

# Start backend server
➜ cd app/back
➜ yarn start-server

# Set Matcha db + all collections
➜ localhost:3000/api/setcollections

# Access to application client from navigator
➜ localhost:8080

```