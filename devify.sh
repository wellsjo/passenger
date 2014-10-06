#!/bin/bash

remote_ip="172.30.0.62"

detected_ip=$(ifconfig  | grep 'inet addr:'| grep -v '127.0.0.1' | cut -d: -f2 | awk '{ print $1}')
echo "detected ip: $detected_ip"
echo


if [ $remote_ip  = $detected_ip ]; then
    echo "setting environment to remote..."
    echo
    sed -ri "/\"env\":/c\ \ \ \ \"env\": \"remote\"," config.json
    echo "config.json ✓"
else
    echo "setting environment to local..."
    echo
    sed -ri "/\"env\":/c\ \ \ \ \"env\": \"local\"," config.json
    echo "config.json ✓"
fi
echo

# create run.js file based on environment
echo "creating run script..."
echo "#!/bin/bash" > run.sh
echo "node app/server/passenger-server.js" >> run.sh
echo "run.sh ✓"
echo
echo "setting permissions..."
echo
sudo chmod +x run.sh

# install/update dependencies
echo "running npm install..."
sudo npm install
echo

echo "Done!"
