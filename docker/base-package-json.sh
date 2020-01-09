#!/bin/sh
FILE=${1:-'package.json'}

if [ ! -f ${FILE} ]; then
  echo 'package.json not found!'
  exit 1
fi

printf '{\n  "name": "docker-base-image",\n  "version": "0.0.0",\n  "dependencies": {'
sed -n '/"dependencies": {/,/}/p' ${FILE} | sed '1d;$d'
printf '  },\n  "devDependencies": {'
sed -n '/"devDependencies": {/,/}/p' ${FILE} | sed '1d;$d'
printf '}\n}'
