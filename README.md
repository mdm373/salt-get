# SaltyPi

> A super overcomplicated solution to forgetting to fill your water softener


![Model](https://i.imgur.com/N2VIsfT.jpg)

## Set Up

Print enclosure from  STLs under `./salt-get-measure/model` and assemble Pi Zero W connected to HC-SR04 Sensor.

Install headless Rasbian Image onto Pi Zero W along with Python distutils and Git. Clone this repo into Pi.

Each module installs via `sudo sh ./scripts/install.sh`, run from the module directory. Sudo required for cron

Salt Get API Requires DB schema generation prior to running `sh ./scripts/gen-schema.sh` (also from module dir)

Each module configured via `.env` after installing. Monitor module requires valid web-hook URL.

Add the following cron-tabs after installing and reboot (`sudo crontab -e`)

```
@reboot cd /home/pi/salt-get/salt-get-api && sh ./scripts/cron_task.sh > /var/log/salt-get-api.log 2>&1
0 10 * * * cd /home/pi/salt-get/salt-get-measure && sh ./scripts/cron_task.sh > /var/log/salt-get-measure.log 2>&1
0 11 * * * cd /home/pi/salt-get/salt-get-monitor && sh ./scripts/cron_task.sh > /var/log/salt-get-monitor.log 2>&1
```

## Modules

### salt-get-api

A Flask API backed by SQLlite3 for storing distance measurements

### salt-get-monitor

A Python task, messaging via webhook when the latest measurement levels rise out of bounds

### salt-get-measure

A Python task, using an [HC-SR04 Sensor](https://www.sparkfun.com/products/13959) sensor to measure distance levels.

