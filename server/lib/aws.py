from requests_aws4auth import AWS4Auth
import boto3
import sys

ES_SERVICE='es'
SQS_SERVICE='es'

def aws_auth(service):
	session = boto3.Session() ### use AWS_PROFILE env to select profile
	credentials = session.get_credentials() 
	access_key = credentials.access_key
	secret_key = credentials.secret_key
	session_token = credentials.token
	region = session.region_name
	awsauth=AWS4Auth(access_key, secret_key, region, service, session_token=session_token)
	return awsauth

def main():
	try:
		auth = aws_auth(ES_SERVICE)
		print(auth)
	except:
		print("exception")
		print(sys.exc_info()[0])

if __name__ == '__main__':
    main()