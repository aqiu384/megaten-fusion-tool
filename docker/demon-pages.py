#!/usr/bin/python3
import json
import re
import os

CONFIG = {
    'GAME': 'Persona 3 Portable',
    'GABBR': 'p3p',
    'DTYPE': 'persona'
}

HTML_FILES = {
    '.html': 'demon-index.html',
    '/fissions.html': 'demon-fissions.html'
}

BASE_PATH = '../gh-pages/{}/{}s'.format(CONFIG['GABBR'], CONFIG['DTYPE'])
DEMON_DIRS = sorted(os.listdir(BASE_PATH))

for fname, template in HTML_FILES.items():
    with open(template) as htmlfile:
        template = htmlfile.read()
        template = re.sub('\n\s*', '', template)

        for k, v in CONFIG.items():
            template = template.replace('{{ ' + k + ' }}', v)

        HTML_FILES[fname] = template

with open('recipes.txt') as txtfile:
    for recipes in txtfile:
        demon, _  = recipes.split(' = ')
        demon_path = '{}/{}'.format(BASE_PATH, demon)
        config = { 'DEMON': demon, 'RECIPES': recipes.strip() }

        print(demon)

        if demon not in DEMON_DIRS:
            os.mkdir(demon_path)

        for fname, template in HTML_FILES.items():
            for k, v in config.items():
                template = template.replace('{{ ' + k + ' }}', v)
            with open(demon_path + fname, 'w+') as htmlfile:
                htmlfile.write(template)
