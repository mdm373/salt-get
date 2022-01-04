# Salt Get API

> A super overcomplicated solution to forgetting to fill your water softener


![Model](https://i.imgur.com/N2VIsfT.jpg)
## Install

Each module installs via `sudo sh ./scripts/install.sh` from the module directory. Sudo required for cron

Salt Get API Requires DB schema generation prior to running `sh ./scripts/gen-schema.sh` (from api module dir)

## Crontabs

Add the following crontabs after installing and reboot

```
@reboot cd /home/pi/salt-get/salt-get-api && sh ./scripts/cron_task.sh > /var/log/salt-get-api.log 2>&1
0 10 * * * cd /home/pi/salt-get/salt-get-measure && sh ./scripts/cron_task.sh > /var/log/salt-get-measure.log 2>&1
0 11 * * * cd /home/pi/salt-get/salt-get-monitor && sh ./scripts/cron_task.sh > /var/log/salt-get-monitor.log 2>&1
```

## Modules

### salt-get-api

A Flask API backed by SQLlite3 for storing distance measurements

### Salt Get Monitor

A Python task, messaging via webhook when the latest measurement levels rise out of bounds

### Salt Get Measure

A Python task, using an HC-SR04 sensor to measure distance levels.

Crontab
```
```

* [HC-SR04 Sensor](https://www.sparkfun.com/products/13959)
* [Enclosure for sensor](https://makerware.thingiverse.com/thing:2304150/)

