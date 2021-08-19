from elasticsearch import Elasticsearch, RequestsHttpConnection, ElasticsearchException
from flask import Flask
from flask_restful import Resource
from lib import Utils
from lib import glsutils as gls
from lib import aws

def open_elasticsearch(host, port):
    es = Elasticsearch(
        hosts = [{'host':host, 'port':port}],
        http_auth = aws.aws_auth(aws.ES_SERVICE),
        use_ssl = True,
        verify_certs = False,
        connection_class = RequestsHttpConnection,
        ssl_show_warn = False,
        request_timeout=30)
    return es

class ESService(Resource):
    def get(self):
        host = gls.get(Utils, "config.es.host", "localhost")
        port = gls.get(Utils, "config.es.port", 9200)
        es = open_elasticsearch(host, port)
        print(es)
        return es.info()

    def delete(self):
        return '', 204

    def put(self):
        return "", 201
