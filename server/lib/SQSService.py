from flask_restful import Resource
import boto3
import json

"""
Queues I Care About:

TrialEnrichment
EnrichTrials
TRIALS2ES

"""
class SQSService(Resource):
    def get(self, qname):
        sqs = boto3.resource('sqs')
        queue = sqs.get_queue_by_name(QueueName=qname)
        print(queue.attributes)
        return json.dumps(queue.attributes)