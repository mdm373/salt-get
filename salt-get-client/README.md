## Install

### Windows
* install with `npm install --ignore-scripts`
* `SET NODE_ENV=test` to mock pigpio
* `SET AWS_KEY=[key]` and `SET AWS_SECRET=[secret]` with credentials

### Pi

* install pigpio
*  `sudo apt-get update`
  * `sudo apt-get install pigpio`
* install/update nodejs via: https://github.com/nodesource/distributions#deb
* clone this repo, open client dir
* install locally: `sudo npm install --unsafe-perm`
* build: `sudo npm run build`
* install globally: `sudo npm install --unsafe-perm -g`
* install forever globally: `sudo npm install forever -g`
* run forever on start
  * create script file invoking salt-get with configured params
  * update `/etc/rc.local` to invoke script via forever

### example rc.local script
```
sudo forever start -c sh -l /home/pi/salt-get.forever.log -o /home/pi/salt-get.out.log -e /home/pi/salt-get.error.log /home/pi/salt-get.sh
```

### example salt-get.sh
```
sudo sleep 60s
sudo salt-get run -d test-thing -c "0/1 * * * * *" -x abc -X xyz
```
