#!/bin/sh
find ../gh-pages/*.js -type f | xargs sed -i 's/\/assets\/images\//\/megaten-fusion-tool\/assets\/images\//g'
find ../gh-pages/*.js -type f | xargs sed -i 's/\/assets\/js\//\/megaten-fusion-tool\/assets\/js\//g'
