#!/usr/bin/python3
import json

SRC_DIR = '../src/app/p5r/data/'
DST_DIR = '../gh-pages/p5r/personas/'

DATA_FILES = ['demon-data', 'dlc-data', 'party-data']

demons = {}

for fname in DATA_FILES:
    with open(SRC_DIR + fname + '.json') as jsonfile:
        demons.update(json.load(jsonfile))

with open('index.html') as htmlfile:
    dtemp = htmlfile.read()

for dname in demons:
    with open(DST_DIR + dname + '.html', 'w+') as htmlfile:
        htmlfile.write(dtemp.replace('${DNAME}', dname))
