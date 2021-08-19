from flask_restful import Resource
import boto3
import json
import subprocess

class CloudDeployService(Resource):
    def get(self, project, repo):
        call = subprocess.Popen(["/bin/bash", "./cloud_deploy.sh", project, repo], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        output, errors = call.communicate()
        call.wait()
        print(output)
        print(errors)
        return output
