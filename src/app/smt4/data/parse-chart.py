import json

ELEMS = [
    'Erthys',
    'Aeros',
    'Aquans',
    'Flaemis',
    'Gnome',
    'Sylph',
    'Undine',
    'Salamander'
]

RACES = [
    "Herald",
    "Megami",
    "Avian",
    "Tree",
    "Divine",
    "Flight",
    "Yoma",
    "Nymph",
    "Vile",
    "Raptor",
    "Wood",
    "Deity",
    "Avatar",
    "Holy",
    "Genma",
    "Fairy",
    "Beast",
    "Jirae",
    "Snake",
    "Reaper",
    "Wilder",
    "Jaki",
    "Vermin",
    "Fury",
    "Lady",
    "Dragon",
    "Kishin",
    "Fallen",
    "Brute",
    "Femme",
    "Night",
    "Tyrant",
    "Drake",
    "Spirit",
    "Foul",
    "Ghost",
    "Fiend",
    "Enigma",
    "Food",
    "Zealot",
    "Entity",
    "Famed",
    "Amatsu",
    "Kunitsu",
    "Undead",
    "Godly",
    "Chaos"
]

OUTRACES = []
CHART = {}
TABLE = []

with open('./element-modifiers.json') as jsonfile:
    CHART = json.load(jsonfile)

for race in RACES:
    if race in CHART:
        OUTRACES.append(race)
        row = []
        TABLE.append(row)

        for elem in ELEMS:
            if elem in CHART[race]:
                row.append(CHART[race][elem])
            else:
                row.append(0)

with open('./element-chart.json', 'w+') as jsonfile:
    json.dump({ 'elems': ELEMS, 'races': OUTRACES, 'table': TABLE }, jsonfile, indent=2, sort_keys=True)