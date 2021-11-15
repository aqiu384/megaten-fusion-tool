#!/usr/bin/python3
import json

with open('demon-data.json') as jsonfile:
    demons = json.load(jsonfile)
with open('skill-data.json') as jsonfile:
    skills = json.load(jsonfile)

for dname, entry in demons.items():
    for slist in ['base', 'arch', 'gach']:
        if slist in entry:
            for sname in entry[slist]:
                if sname not in skills:
                    print(dname, sname)
