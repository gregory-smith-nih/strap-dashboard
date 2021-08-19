import os
import json

config={}

def readConfig(main_file, config_file):
    global config
    dirname = os.path.dirname(os.path.abspath(main_file))
    path = os.path.join(dirname, config_file)
    f = open(path)
    config = json.load(f)
    f.close()
    return config