#!/usr/bin/python3
import sys
import subprocess

HEADER = '\n'.join((
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<title>{0}</title>',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<link rel="icon" type="image/x-icon" href="/favicon.ico">',
    '</head>',
    '<body>',
    '<div>'
))

INFILE = sys.argv[1]
OUTFILE = INFILE.replace('docs/', '../aqiu384.github.io/docs-megaten/').replace('.md', '.html')

with open(INFILE) as mdfile:
    TITLE = mdfile.readline().replace('#', '').strip()

subprocess.call(['showdown', 'makehtml', '--tables', '--noHeaderId', '--simplifiedAutoLink', '-i', INFILE, '-o', OUTFILE])

with open(OUTFILE) as htmlfile:
    lines = htmlfile.read()

lines = '\n'.join([
    HEADER.format(TITLE),
    lines,
    '</div>\n</body>\n</html>'
])

with open(OUTFILE, 'w+') as htmlfile:
    htmlfile.write(lines)
