#!/bin/bash
# Install all modules needed by the application server/api
cd ./app/back
pwd
yarn install

# Install all modules needed by the application client
cd ../../app/front
pwd
yarn install
# Start client's server
yarn start-client

exit 0
