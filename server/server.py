from flask import Flask, render_template
from flask_restful import reqparse, abort, Api, Resource
from lib import ESService
from lib import SQSService
from lib import CloudDeployService
from lib import SearchService
from lib import Utils

config = Utils.readConfig(__file__, "config.json")

app = Flask(__name__)
api = Api(app)
api.add_resource(ESService.ESService, '/api/es')
api.add_resource(SQSService.SQSService, '/api/sqs/<qname>')
api.add_resource(CloudDeployService.CloudDeployService, '/api/cloud_deploy/<project>/<repo>')
api.add_resource(SearchService.SearchService, '/api/search/<which>')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
	print("running...")
	app.run(debug=True, host='localhost')
