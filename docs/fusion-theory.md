# Megami Tensei Fusion Tools - Fusion Theory
## Navigation
* [All Fusion Tools](https://aqiu384.github.io/megaten-fusion-tool/home)
* [How to Use](https://aqiu384.github.io/docs-megaten/how-to-use)
* [Report Issue](https://github.com/aqiu384/megaten-fusion-tool/issues)

## Basic Fusion Rules
### Normal Fusion
#### Formula
1. Ingredient A x Ingredient B = ?
    * Consult the game's corresponding demon list to obtain each ingredient's race and base level
2. Determine Race R
    * Consult the game's corresponding normal fusion chart
    * Find the row that starts or ends with Race A
    * Find the column that starts or ends with Race B
    * Race R = Intersection of the two
    * If Race R = None, the fusion is invalid
    * For Persona series only: Intersection must lie in upper-right half of chart, if it does not, flip Race A and Race B
3. Determine Result R
    * Consult the game's corresponding demon list
    * Level R = Math.floor((Base Level A + Base Level B) / 2) + Game-specific Normal Level Modifier
    * Result R = Next-highest non-special result (neither red nor green) with Race R with base level >= Level R
    * If Level R > All non-special results with Race R, the fusion is invalid
4. Ingredient A x Ingredient B = Result R

#### Example 1
1. Persona 4 Golden: Current Level 50 Girimehkala x Current Level 31 Mithra = ?
    * [List of Personas - Persona 4 Golden](https://aqiu384.github.io/megaten-fusion-tool/p4g/personas)
    * Girimehkala: Race A = Moon, Base Level A = 48
    * Mithra: Race B = Temperance, Base Level B = 31
2. Determine Race R
    * [Fusion Chart - Persona 4 Golden](https://aqiu384.github.io/megaten-fusion-tool/p4g/chart)
    * Moon (row) x Temperance (column) does not lie in upper-right half of chart, so lookup Temperance (row) x Moon (column) instead
    * Race R = Temperance (row) x Moon (column) = Hanged (upper-right)
3. Determine Result R
    * [List of Personas - Persona 4 Golden](https://aqiu384.github.io/megaten-fusion-tool/p4g/personas)
    * Persona 4 Golden Normal Level Modifier = 1
    * Level R = Math.floor((48 + 31) / 2) + 1 = 40
    * Next-highest Hanged persona with base level >= 40 is Yatsufusa at level 49, but Yatsufusa is green indicating a special fusion
    * Result R = Next-next-highest Hanged persona with base level >= 40, Taowu at Level 56
4. Persona 4 Golden: Current Level 50 Girimehkala x Current Level 31 Mithra = Base Level 56 Taowu

### Triple Fusion
#### Formula
1. Ingredient A x Ingredient B x Ingredient C = ?
    * Consult the game's corresponding demon list to obtain each ingredient's race and base level
    * Ingredient C = Ingredient with the highest current level
    * If multiple ingredients are tied for the highest current level, Ingredient C = Ingredient with the highest-priority race
    * Consult the game's corresponding demon list for race priority: By default, demons are sorted from higher to lower-priority races
2. Determine Race AB
    * Consult the game's corresponding normal fusion chart
    * Find the row that starts or ends with Race A
    * Find the column that starts or ends with Race B
    * Race AB = Intersection of the two
    * If Race R = None, the fusion is invalid
    * For Persona series only: Intersection must lie in upper-right half of chart, if it does not, flip Race A and Race B
3. Determine Race R
    * Consult the game's corresponding triple fusion chart
    * Find the row that starts or ends with Race AB
    * Find the column that starts or ends with Race C
    * Race R = Intersection of the two
    * If Race R = None, the fusion is invalid
    * For Persona series only: Intersection must lie in lower-left half of chart, if it does not, flip Race AB and Race C
4. Determine Result R
    * Consult the game's corresponding demon list
    * Level R = Math.floor((Level A + Level B + Level C) / 3) + Game-specific Triple Level Modifier
    * Result R = Next-highest non-special result (neither red nor green) with Race R with base level >= Level R
    * If Level R > All non-special results with Race R, the fusion is invalid
5. Ingredient A x Ingredient B x Ingredient C = Result R

#### Example 1
1. Persona 4 Golden: Current Level 32 King Frost x Current Level 27 Makami x Current Level 32 Neko Shogun = ?
    * [List of Personas - Persona 4 Golden](https://aqiu384.github.io/megaten-fusion-tool/p4g/personas)
    * Ingredient C must be Neko Shogun or King Frost
    * Because King Frost comes before Neko Shogun in the persona list, Ingredient C = King Frost
    * Makami x Neko Shogun x King Frost = ?
    * Makami: Race A = Hanged, Base Level A = 27
    * Neko Shogun: Race B = Star, Base Level B = 32
    * King Frost: Race C = Emperor, Base Level C = 22
2. Determine Race AB
    * [Fusion Chart - Persona 4 Golden](https://aqiu384.github.io/megaten-fusion-tool/p4g/chart)
    * Race AB = Hanged (row) x Star (column) = Empress (upper-right)
3. Determine Race R
    * [Fusion Chart - Persona 4 Golden](https://aqiu384.github.io/megaten-fusion-tool/p4g/chart)
    * Empress (row) x Emperor (column) does not lie in lower-left half of chart, so lookup Emperor (row) x Empress (column) instead
    * Race R = Emperor (row) x Empress (column) = Fool (lower-left)
4. Determine Result R
    * [List of Personas - Persona 4 Golden](https://aqiu384.github.io/megaten-fusion-tool/p4g/personas)
    * Persona 4 Golden Triple Level Modifier = 5
    * Level R = Math.floor((32 + 27 + 22) / 3) + 5 = 32
    * Next-highest Fool persona with base level >= 32 is Black Frost at Level 38, but Black Frost is green indicating a special fusion
    * Result R = Next-next-highest Fool persona with base level >= 32, Decarabia at Level 46
5. Persona 4 Golden: Current Level 32 King Frost x Current Level 27 Makami x Current Level 32 Neko Shogun = Base Level 46 Decarabia
