// create a wrapper around native canvas element (with id="c")
var canvas = new fabric.Canvas('c', {
  fireRightClick: true, // <-- enable firing of right click events
  fireMiddleClick: true, // <-- enable firing of middle click events
  stopContextMenu: true // <--  prevent context menu from showing
})
canvas.selection = false
canvas.on('mouse:down', function (event) {
  console.log('onclick')
  if (event.target && event.target.onclick) {
    if (event.button === 1) {
      console.log('left click')
      event.target.onclick(event.target)
    }
    if (event.button === 2) {
      console.log('middle click')
    }
    if (event.button === 3) {
      console.log('right click')
      event.target.onclick(event.target)
    }
  }
})

let names = {
  int: {
    Pre_TrialEnrichment_SQS: 'TrialEnrichment',
    TrialEnrichment_API: 'ctrp-trials-enrichment',
    Post_TrialEnrichment_SQS: 'TRIALS2ES',
    MigrationTemporaryBucket: 'strap-migration-temporary-bucket'
  },
  uat: {
    Pre_TrialEnrichment_SQS: 'TrialEnrichment',
    TrialEnrichment_API: 'ctrp-trials-enrichment-uat',
    Post_TrialEnrichment_SQS: 'TRIALS2ES',
    MigrationTemporaryBucket: 'strap-migration-temporary-bucket'
  }
}


let Pre_TrialEnrichment_SQS = new SQSWidget(
  canvas,
  300,
  300,
  names.int.Pre_TrialEnrichment_SQS
)
let TrialEnrichment_API = new APIWidget(
  canvas,
  500,
  300,
  names.int.TrialEnrichment_API
)
let Post_TrialEnrichment_SQS = new SQSWidget(
  canvas,
  700,
  300,
  names.int.Post_TrialEnrichment_SQS
)
let MigrationTemporaryBucket_S3 = new S3Widget(
  canvas,
  700,
  500,
  names.int.MigrationTemporaryBucket
)
let DynamoDB = new S3Widget(
  canvas,
  100,
  100,
  "DynamoDB"
)
let CTRP_LAMBDA_COMMONS = new LibWidget(
  canvas,
  430,
  230,
  "ctrp-lambda-commons"
)

//s3.console.aws.amazon.com/s3/buckets/strap-migration-temporary-bucket?region=us-east-1&tab=objects

DynamoDB.addMenuItem(
  'ctrp-trial',
  'https://console.aws.amazon.com/dynamodb/home?region=us-east-1#tables:selected=ctrp-trial;tab=items',
  url => window.open(url, '_blank')
)
TrialEnrichment_API.addMenuItem(
  'DataDog',
  'https://app.datadoghq.com/logs?query=service%3Actrp-trial-enrichment&cols=service&index=%2A&messageDisplay=expanded-md&stream_sort=desc',
  url => window.open(url, '_blank')
)
TrialEnrichment_API.addMenuItem(
  'Sentry',
  'https://sentry.io/organizations/leidos-biomedical/issues/?project=1195518&statsPeriod=24h',
  url => window.open(url, '_blank')
)
TrialEnrichment_API.addMenuItem(
  'Travis',
  'https://travis-ci.com/github/BIAD/ctrp-trials-enrichment',
  url => window.open(url, '_blank')
)
CTRP_LAMBDA_COMMONS.addMenuItem(
  'Travis',
  'https://travis-ci.com/github/BIAD/ctrp-lambda-commons',
  url => window.open(url, '_blank')
)

MigrationTemporaryBucket_S3.addMenuItem(
  'S3 Bucket',
  'https://s3.console.aws.amazon.com/s3/buckets/strap-migration-temporary-bucket?region=us-east-1&tab=objects',
  url => window.open(url, '_blank')
)

DynamoDB.toWidget(Pre_TrialEnrichment_SQS)
CTRP_LAMBDA_COMMONS.toWidget(TrialEnrichment_API, true)
Pre_TrialEnrichment_SQS.toWidget(TrialEnrichment_API)
TrialEnrichment_API.toWidget(Post_TrialEnrichment_SQS)
TrialEnrichment_API.toWidget(MigrationTemporaryBucket_S3)

canvas.add(TrialEnrichment_API)
canvas.add(Post_TrialEnrichment_SQS)
canvas.add(Pre_TrialEnrichment_SQS)
canvas.add(MigrationTemporaryBucket_S3)
canvas.add(DynamoDB)
canvas.add(CTRP_LAMBDA_COMMONS)

let trialEnrichment_API = names.int.TrialEnrichment_API

let promise = $.get('/api/cloud_deploy/strap/' + names.int.TrialEnrichment_API)
promise.done(result => {
  obj = JSON.parse(result)
  TrialEnrichment_API.updateText(
    names.int.TrialEnrichment_API +
      '\n' +
      obj[trialEnrichment_API].int[0].version
  )
})
