#!/bin/bash

remote_ip="172.30.0.62"

detected_ip=$(ifconfig  | grep 'inet addr:'| grep -v '127.0.0.1' | cut -d: -f2 | awk '{ print $1}')
echo "detected ip: $detected_ip"
echo

# create run.js file based on environment
echo "#!/bin/bash" > run.sh

if [ $remote_ip  = $detected_ip ]; then
    echo "creating run.js script using remote settings..."
    echo
    echo "node app/server/passenger-server-remote.js >> run.sh"
    echo
    echo "node app/server/passenger-server-remote.js" >> run.sh
else
    echo "creating run.js script using local settings..."
    echo
    echo "node app/server/passenger-server-local.js >> run.sh"
    echo
    echo "node app/server/passenger-server-local.js" >> run.sh
fi

echo "setting file permissions..."
echo
sudo chmod +x run.sh

# install/update dependencies
echo "running npm install..."
sudo npm install
echo

echo "Done!"
