# STRAP Dashboard

STRAP Dashboard is a quick hack that displays the relationships between S3 Buckets, SQS Queues, and APIs in STRAP.
* Only works in INT

## Prep

STRAP Dashboard relies on the `cloud_deploy` app being available to give the current deployment status of the app

* `cd server`
* `git clone git@github.com:BIAD/cloud_deploy.git`

## To Run
* `okta-awscli  --force --profile DEVINT` # set up AWS permissions
* `export AWS_PROFILE=DEVINT`
* `cd server`
* `python server.py`

## Access via web browser
* `http://localhost:5000`
* `Right-click` on objects pops up menus which will open tabs to Sentry/Travis/DataDog or other resources
* Dark Green boxes are sources/sinks (DB, S3 buckets)
* Light Gray boxes are SQS Queues. The displayed number is the number of entries queued up. When the queues are full, there will be a green bar showing the percentage full (10,000 items is considered the maximum)
* Light Gray circles are APIs. The date/time is the last deployment time
* Yellow circles are libraries/modules that are dependencies on APIs

## MISC.

I had to turn on window naming chrome://flags/#window-naming and go to the Window->Name to name the window a 'test' so it wouldn't keep creating new windows when I opened index.html


# strap-dashboard
