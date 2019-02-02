## Install
Requires nodejs / npm
> npm install

### Windows
* install with ``npm install --ignore-scripts`` 
* ``SET NODE_ENV=test`` to mock pigpio

### Pi

* install pigpio
  * ``sudo apt-get update`` 
  * ``sudo apt-get install pigpio``
* install/update nodejs via: https://github.com/nodesource/distributions#deb
* clone this repo, open client dir
* install locally: ``sudo npm install --unsafe-perm``
* build: ``sudo npm run build``
* install globally: ``sudo npm install --unsafe-perm -g``

