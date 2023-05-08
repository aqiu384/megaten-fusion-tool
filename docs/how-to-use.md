# Megami Tensei Fusion Tools - How to Use
## Navigation
* [All Fusion Tools](https://aqiu384.github.io/megaten-fusion-tool/home)
* [Fusion Theory](https://aqiu384.github.io/docs-megaten/fusion-theory)
* [Report Issue](https://github.com/aqiu384/megaten-fusion-tool/issues)

## <a name="save-offline"></a>Save Offline
### iOS
1. Navigate to the [Megami Tensei Fusion Tools homepage](https://aqiu384.github.io/megaten-fusion-tool/home)
2. Add page to Home Screen: Safari > Action (Share) > Add to Home Screen > Add
3. Open the downloaded page from the Home Screen
4. Navigate to the skills page of each desired game (e.g. [List of Skills - Persona 5 Royal](https://aqiu384.github.io/megaten-fusion-tool/p5r/skills))
5. Close the downloaded page and disable Wi-Fi and Cellular Data
6. Reopen the page from the Home Screen and ensure each downloaded game is still accessible
7. Reenable Wi-Fi and repeat steps 4-6 if game does not load offline

## <a name="smt1"></a>[Shin Megami Tensei](https://aqiu384.github.io/megaten-fusion-tool/smt1)
### Data Sources
* http://ifs.nog.cc/fool-est.hp.infoseek.co.jp/shin_dds/index.html
* https://kaerukyo.net/dds_database/skill.php?title=3

## <a name="smt2"></a>[Shin Megami Tensei II](https://aqiu384.github.io/megaten-fusion-tool/smt2)
### Data Sources
* http://ifs.nog.cc/fool-est.hp.infoseek.co.jp/shin_dds2/index.html
* https://kaerukyo.net/dds_database/skill.php?title=4

## <a name="smtif"></a>[Shin Megami Tensei If...](https://aqiu384.github.io/megaten-fusion-tool/smtif)
### Data Sources
* http://ifs.nog.cc/fool-est.hp.infoseek.co.jp/shin_if/index.html
* https://kaerukyo.net/dds_database/skill.php?title=5

## <a name="smt9"></a>[Shin Megami Tensei NINE](https://aqiu384.github.io/megaten-fusion-tool/smt9)
### Data Sources
* http://ifs.nog.cc/fool-est.hp.infoseek.co.jp/shin_nine/index.html
* https://kaerukyo.net/dds_database/skill.php?title=17
* http://softtank.web.fc2.com/nine_index.html
* http://ゆめのしま.jp/nine.html

## <a name="smtim"></a>[Shin Megami Tensei IMAGINE](https://aqiu384.github.io/megaten-fusion-tool/smtim)
### Data Sources
* https://wikiwiki.jp/imagine/
* http://megatenonline.wiki.fc2.com/wiki/
* http://megaten.sesshou.com

## <a name="smt3"></a>[Shin Megami Tensei III: Nocturne](https://aqiu384.github.io/megaten-fusion-tool/smt3)
### Data Sources
* http://www.phpsimplicity.com/heretic/
* https://pathshower.wordpress.com/smt/nocturne/
* http://ifs.nog.cc/fool-est.hp.infoseek.co.jp/shin_dds3/

## <a name="smtsj"></a>[Shin Megami Tensei: Strange Journey](https://aqiu384.github.io/megaten-fusion-tool/smtsj)
### Cheap Password Demons
* Passwords allow you to summon demons with stats and levels less than their default, decreasing their price and providing cheap fusion ingredients
* Some higher-end demons like Alilat with their stats capped will overflow the max price and come out to around a couple thousand
* Can also summon boss-exclusive demons with their corresponding passwords

### [Shin Megami Tensei: Strange Journey Redux](https://aqiu384.github.io/megaten-fusion-tool/smtdsj)
* Womb of Grief added
* New endings added for all routes
* Password price overflow and boss-exclusives fixed

### Data Sources
* https://gamefaqs.gamespot.com/ds/961651-shin-megami-tensei-strange-journey/faqs/59384
* https://docs.google.com/spreadsheets/d/1R0Uq9YAW0yVwwHk020y6dLYR-EIsLOlIId05JFZpJcM
* https://github.com/yuggrdrasill/megaten-sj-pw-generator

## <a name="smt4"></a>[Shin Megami Tensei IV](https://aqiu384.github.io/megaten-fusion-tool/smt4)
### Data Sources
* https://erikku.github.io/smt4tool/
* https://gamefaqs.gamespot.com/3ds/672441-shin-megami-tensei-iv/faqs/67766

### Fusion Accident Skill Inheritance
* If demons A x B = C, but produces a fusion accident resulting in D instead
  * D's first 4 skills will be the highest ranked from the combined ABCD skill pool
  * D's last 4 skills will be randomly picked from the same pool
* If D is of the Famed race
  * D will inherit all of its innate skills
  * D will pick the highest ranked from ABC's skill pool for the rest

## <a name="smt4f"></a>[Shin Megami Tensei IV Apocalypse](https://aqiu384.github.io/megaten-fusion-tool/smt4f)
* Zealot made fusion accident exclusive
* Unique skills added to fusion accident inheritance pool

### Data Sources
* http://gamers-high.com/megami4-final/
* https://megamitensei.fandom.com/wiki/List_of_Shin_Megami_Tensei_IV_Apocalypse_Skills

### Skill Affinities
| Rank | Attack              | Ailment             | Recovery             | Support   |
| ---- | ------------------- | ------------------- | -------------------- | --------- |
| 9    | Dmg +70%, Cost -20% | Hit +35%, Cost -20% |                      |           |
| 8    | Dmg +60%, Cost -20% | Hit +30%, Cost -20% |                      |           |
| 7    | Dmg +50%, Cost -20% | Hit +25%, Cost -20% |                      |           |
| 6    | Dmg +40%, Cost -20% | Hit +20%, Cost -20% |                      |           |
| 5    | Dmg +30%, Cost -20% | Hit +15%, Cost -20% | Heal +45%, Cost -20% | Cost -50% |
| 4    | Dmg +30%, Cost -10% | Hit +15%, Cost -10% | Heal +45%, Cost -10% | Cost -40% |
| 3    | Dmg +20%, Cost -10% | Hit +10%, Cost -10% | Heal +30%, Cost -10% | Cost -30% |
| 2    | Dmg +10%, Cost -10% | Hit +5%, Cost -10%  | Heal +15%, Cost -10% | Cost -20% |
| 1    | Dmg +10%            | Hit +5%             | Heal +15%            | Cost -10% |
| -1   | Dmg -10%            | Hit -10%            | Cost +10%            | Cost +10% |
| -2   | Dmg -20%            | Hit -20%            | Cost +20%            | Cost +20% |
| -3   | Dmg -30%            | Hit -30%            | Cost +30%            | Cost +30% |
| -4   | Dmg -40%            | Hit -40%            | Cost +40%            | Cost +40% |
| -5   | Dmg -50%            | Hit -50%            | Cost +50%            | Cost +50% |
| -6   | Dmg -60%            | Hit -60%            |                      |           |
| -7   | Dmg -70%            | Hit -70%            |                      |           |
| -8   | Dmg -80%            | Hit -80%            |                      |           |
| -9   | Dmg -90%            | Hit -90%            |                      |           |

### Unique Skills Fusion Accident Exploit

## <a name="smt5"></a>[Shin Megami Tensei V](https://aqiu384.github.io/megaten-fusion-tool/smt5)
### Data Sources
* https://www.youtube.com/user/atlustube
* https://hyperwiki.jp/smt5/

### Skill Potentials
| Rank | Attack              | Ailment             | Recovery             | Support   |
| ---- | ------------------- | ------------------- | -------------------- | --------- |
| +9   | Dmg +55%, Cost -40% | Hit +60%, Cost -40% |                      |           |
| +8   | Dmg +47%, Cost -34% | Hit +50%, Cost -34% |                      |           |
| +7   | Dmg +43%, Cost -31% | Hit +45%, Cost -31% |                      |           |
| +6   | Dmg +39%, Cost -28% | Hit +40%, Cost -28% |                      |           |
| +5   | Dmg +35%, Cost -25% | Hit +35%, Cost -25% | Heal +40%, Cost -40% | Cost -40% |
| +4   | Dmg +25%, Cost -19% | Hit +25%, Cost -19% | Heal +25%, Cost -30% | Cost -30% |
| +3   | Dmg +20%, Cost -16% | Hit +20%, Cost -16% | Heal +20%, Cost -25% | Cost -25% |
| +2   | Dmg +15%, Cost -13% | Hit +15%, Cost -13% | Heal +15%, Cost -20% | Cost -20% |
| +1   | Dmg +10%, Cost -10% | Hit +10%, Cost -10% | Heal +10%, Cost -15% | Cost -15% |
| -1   | Dmg -10%, Cost +10% | Hit -10%, Cost +10% | Heal -10%, Cost +20% | Cost +20% |
| -2   | Dmg -15%, Cost +15% | Hit -15%, Cost +15% | Heal -15%, Cost +30% | Cost +30% |
| -3   | Dmg -20%, Cost +20% | Hit -20%, Cost +20% | Heal -20%, Cost +40% | Cost +40% |
| -4   | Dmg -25%, Cost +25% | Hit -25%, Cost +25% | Heal -25%, Cost +50% | Cost +50% |
| -5   | Dmg -35%, Cost +35% | Hit -35%, Cost +35% | Heal -40%, Cost +60% | Cost +60% |
| -6   | Dmg -39%, Cost +40% | Hit -40%, Cost +40% |                      |           |
| -7   | Dmg -43%, Cost +45% | Hit -45%, Cost +45% |                      |           |

### Buff Effects
| Rank | Tarukaja (Attack) | Rakukaja (Defense) | Sukukaja (Hit) | Sukukaja (Evade) |
| ---- | ----------------- | ------------------ | -------------- | ---------------- |
| +2   | 140%              | 70%                | 120%           | 85%              |
| +1   | 120%              | 80%                | 110%           | 90%              |
| -1   | 80%               | 120%               | 90%            | 110%             |
| -2   | 70%               | 140%               | 85%            | 120%             |

### Level Difference Damage Modifier

| Diff | Dmg Mod |
| ---- | ------- |
| >+9  | 405%    |
| +9   | 352%    |
| +8   | 306%    |
| +7   | 266%    |
| +6   | 231%    |
| +5   | 201%    |
| +4   | 175%    |
| +3   | 152%    |
| +2   | 132%    |
| +1   | 115%    |
| -1   | 87%     |
| -2   | 76%     |
| -3   | 66%     |
| -4   | 57%     |
| -5   | 50%     |
| -6   | 43%     |
| -7   | 38%     |
| -8   | 33%     |
| -9   | 28%     |
| <-9  | 25%     |

### Filling the Magtsuhi Gauge
| Condition                 | Fill |
| ------------------------- | ---- |
| Red Magatsuhi Pickup      | 1%   |
| End Turn (Minimum)        | 15%  |
| End Turn (Maximum)        | 25%  |
| Forestall                 | 20%  |
| Constant Vigiliance       | 15%  |
| Embolden                  | 5%   |
| Vengeful Opportunist      | 3%   |
| Fell Swoop                | 1%   |
| Counter Incentive: Resist | 3%   |
| Counter Incentive: Null   | 10%  |
| Unyielding Will           | 5%   |
| Vengeance                 | 30%  |

### Ailments
* Sleep
  * Skips action
  * Cured when attacked
  * Disables counter skills
* Mirage
  * Halves hit/evade
  * 50% chance to hit a foe other than the selected target
* Poison
  * Loses HP after every action
* Panic
  * 35% chance to hit an ally
  * 15% chance to do nothing
  * Reduces evade to 0
  * Disables counter skills
* Charm
  * 20% chance to cast recovery skill on foe
  * 10% chance to cast support skill on foe
  * 20% chance to do nothing
  * Reduces evade to 0
  * Disables counter skills
* Seal
  * Cannot cast skills
  * Foe skips action when casting a skill
  * Disables counter skills
* Mud
  * Loses one press turn before every action
* Shroud
  * Loses MP before every action
  * Takes only 5% damage from Heliopolis Dawn

### Unlocking Magatsuhi Skills with Talismans (Tm)
* Herald: Clear "The Holy Ring"
* Megami: Clear "The Horn of Plenty"
* Avian: Find 30 Miman
* Divine: Talk to Angel NPC in Container Yard
* Yoma: Clear "Pollution Panic"
* Vile: Clear "Magic from the East"
* Raptor: Clear "Movin' on Up"
* Deity: Clear "The Bull God's Lineage"
* Wargod: Clear "No Stone Unturned"
* Avatar: Find 45 Miman
* Holy: Find 55 Miman
* Genma: Find 100 Miman
* Element: Find 10 Miman
* Fairy: Clear "The Root of the Problem"
* Beast: Clear "A Wish for a Fish"
* Jirae: Clear "Chakra Drop Chomp"
* Fiend: Find 70 Miman
* Jaki: Talk to Rakshasa NPC in Nagatacho
* Wilder: Talk to Nue NPC in Container Yard
* Fury: Clear "The Destined Leader"
* Lady: Clear "The Falcon's Head"
* Dragon: Clear "The Gold Dragon's Arrival"
* Kishin: Find 90 Miman
* Kunitsu: Clear "Clash with the Kunitsukami"
* Femme: Clear "The Demon of the Spring"
* Brute: Clear "Talisman Hunt"
* Fallen: Clear "To Cure a Curse"
* Night: Clear "Kumbhanda's Bottle"
* Snake: Talk to Yurlungur NPC in Chiyoda
* Tyrant: Clear "The Winged Sun"
* Drake: Clear "The Ultimate Omelette"
* Haunt: Clear "A Preta Predicament"
* Foul: Talk to Slime NPC in Hamamatsucho

## <a name="dsum"></a>[Shin Megami Tensei: Devil Summoner](https://aqiu384.github.io/megaten-fusion-tool/dsum)
### Data Sources
* https://gamefaqs.gamespot.com/psp/929271-shin-megami-tensei-devil-summoner/faqs/70850
* http://onpleruler.web.fc2.com/megami/pspds.htm
* http://www.geocities.co.jp/Hollywood-Miyuki/1871/dds/

## <a name="dssh"></a>[Devil Summoner: Soul Hackers](https://aqiu384.github.io/megaten-fusion-tool/dssh)
### Data Sources
* http://bmky.net/data/sh/system/unite/hero.html
* http://ifs.nog.cc/fool-est.hp.infoseek.co.jp/ds/sh/index.html

## <a name="krch"></a>[Raidou Kuzunoha vs. The Soulless Army](https://aqiu384.github.io/megaten-fusion-tool/krch)
### Data Sources
* https://kaerukyo.net/dds_database/devil.php?title=22
* https://megamitensei.fandom.com/wiki/List_of_Devil_Summoner:_Raidou_Kuzunoha_vs._The_Soulless_Army_Skills

## <a name="krao"></a>[Raidou Kuzunoha vs. King Abaddon](https://aqiu384.github.io/megaten-fusion-tool/krao)
### Data Sources
* https://www31.atwiki.jp/abaddon/pages/37.html
* https://megamitensei.fandom.com/wiki/List_of_Devil_Summoner:_Raidou_Kuzunoha_vs._King_Abaddon_Skills

## <a name="mib"></a>[Megami Ibunroku Persona](https://aqiu384.github.io/megaten-fusion-tool/mib)
### Data Sources
* http://persona1.wikidot.com
* http://p1psp.gkwiki2.com/

## <a name="p3"></a>[Persona 3](https://aqiu384.github.io/megaten-fusion-tool/p3)
### [Persona 3 FES](https://aqiu384.github.io/megaten-fusion-tool/p3fes)
* Aeon Social Link added
* Orpheus Telos added

### [Persona 3 FES: The Answer](https://aqiu384.github.io/megaten-fusion-tool/p3aeg)
* No compendium available
* 4+ spreads removed, can create through normal and triple fusion instead

### [Persona 3 Portable](https://aqiu384.github.io/megaten-fusion-tool/p3p)
* Skill cards added

### Data Sources
* https://megamitensei.fandom.com/wiki/List_of_Persona_3_FES_Personas
* https://gamefaqs.gamespot.com/ps2/937269-shin-megami-tensei-persona-3-fes/faqs/53404

### Skill List
* (Fs): Fusion Spell

## <a name="p4"></a>[Persona 4](https://aqiu384.github.io/megaten-fusion-tool/p4)
### [Persona 4 Golden](https://aqiu384.github.io/megaten-fusion-tool/p4g)
* Aeon and Jester Social Links added
* Skill cards added

### Data Sources
* https://gamefaqs.gamespot.com/ps2/945498-shin-megami-tensei-persona-4/faqs/53550
* https://gamefaqs.gamespot.com/ps2/945498-shin-megami-tensei-persona-4/faqs/55266
* https://gamefaqs.gamespot.com/vita/641695-persona-4-golden/faqs/64587
* http://h1g.jp/p4g/

### Skill List
* (S?): Learned at Social Link Lv. ?
* (Sx): Learned at Social Link Lv. 10
* (Sy): Learned at Social Link Lv. 11
* (B?): Learned during Bike Event ?

## <a name="p5"></a>[Persona 5](https://aqiu384.github.io/megaten-fusion-tool/p5)
### [Persona 5 Royal](https://aqiu384.github.io/megaten-fusion-tool/p5r)
* Faith and Councillor Confidants added
* Fusion Alarm added
* Persona Traits added
* [Max Confidant Walkthrough](https://aqiu384.github.io/p5r-walkthrough/introduction)

### Data Sources
* http://spwiki.net/persona5/
* http://bozumemo.blogspot.com/p/5.html
* https://wikiwiki.jp/persona5r/
* https://h1g.jp/p5r/
* https://docs.google.com/spreadsheets/d/1kPsA9fwhOyqyh7qLNfW2Xprc7wDK6RQ5d3Re4f7cTKk

### Skill List
* (Cx): Learned at Confidant Lv. 10
* (Cy): Learned at Confidant Lv. 11
* (Fa): Itemize during Fusion Alarm
* (Tk): Negotiate during Hold Up

## <a name="p5s"></a>[Persona 5 Strikers](https://aqiu384.github.io/megaten-fusion-tool/p5s)
### Data Sources
* https://altema.jp/persona5s/
* https://gamewith.jp/p5s/
* https://h1g.jp/p5s/

### Skill List
* (C1): Combo Input #1 □□△△
* (C2): Combo Input #2 □□□△
* (C3): Combo Input #3 □□□□□△△

## <a name="pq"></a>[Persona Q: Shadow of the Labyrinth](https://aqiu384.github.io/megaten-fusion-tool/pq)
### Data Sources
* https://gamefaqs.gamespot.com/3ds/739685-persona-q-shadow-of-the-labyrinth/faqs/70858
* https://gamefaqs.gamespot.com/3ds/739685-persona-q-shadow-of-the-labyrinth/faqs/70843
* https://wikiwiki.jp/personaqr/

### QR Code Unique Skills
* Unlike Strange Journey passwords, QR codes are valid even with unique skills
* Party member unique skills are still invalid

## <a name="pq2"></a>[Persona Q2: New Cinema Labyrinth](https://aqiu384.github.io/megaten-fusion-tool/pq2)
### Data Sources
* https://bozumemo.blogspot.com/p/pq2.html
* https://wiki.denfaminicogamer.jp/pq2/
* https://wikiwiki.jp/pq2/

## <a name="mjn1"></a>[Majin Tensei](https://aqiu384.github.io/megaten-fusion-tool/mjn1)
### Data Sources
* http://ifs.nog.cc/fool-est.hp.infoseek.co.jp/majin/majin1/index.html
* https://megamitensei.fandom.com/wiki/List_of_Majin_Tensei_Demons

## <a name="mjn2"></a>[Majin Tensei II: Spiral Nemesis](https://aqiu384.github.io/megaten-fusion-tool/mjn2)
### Data Sources
* http://www.demitree.jp/コンテンツ/魔神転生２/
* http://www.cam.hi-ho.ne.jp/oni2/oni1/Majin2/remix.htm
* http://majinntennsei2.kouryaku.red/
* http://oliva.m78.com/majin2.html
* http://bmky.net/data/m2/

## <a name="ds1"></a>[Devil Survivor](https://aqiu384.github.io/megaten-fusion-tool/ds1)
### Maxing All Demon Stats
* Like most games, there is a cap on how many bonus stats a demon can receive from Mitama fusion
* This can be bypassed with the following chain
  * 1-star auction demon x 1-star auction demon = Element with a negative stat penalty
  * Penalty Element x Penalty Element = Mitama with a negative stat penalty
* This Penalty Mitama will raise one stat and lower another, resulting in a net-zero change towards the bonus stat cap
* By raising two stats on a demon to 40 and lowering the other two stats below 0, the latter will underflow and loop back around to 40

### [Devil Survivor Overclocked](https://aqiu384.github.io/megaten-fusion-tool/dso)
* 8th Day added for 3 routes
* Compendium added

### Data Sources
* https://gamefaqs.gamespot.com/ds/954869-shin-megami-tensei-devil-survivor/faqs/56943
* https://gamefaqs.gamespot.com/3ds/997806-shin-megami-tensei-devil-survivor-overclocked/faqs/69601

### Skill List
* (A?): Comes with ?-star Auction

## <a name="ds2"></a>[Devil Survivor 2](https://aqiu384.github.io/megaten-fusion-tool/ds2)
* Max demon stat underflow fixed

### [Devil Survivor 2 Record Breaker](https://aqiu384.github.io/megaten-fusion-tool/ds2br)
* Triangulum Campaign added

### Data Sources
* http://i40.tinypic.com/f2j6mo.png
* http://spwiki.net/ds2br/

### Skill List
* (A?): Comes with ?-star Auction
* (Ar): Comes with Rare Auction

## <a name="dx2"></a>[Shin Megami Tensei: Liberation Dx2](https://aqiu384.github.io/megaten-fusion-tool/dx2)
### Data Sources
* https://altema.jp/megaten/
* https://d2-megaten-l.sega.com/en/
* https://oceanxdds.github.io/dx2_fusion/

### Skill List
* (Ac): Archetype Common
* (Aa): Archetype Aragami
* (Ap): Archetype Protector
* (Ay): Archetype Psychic
* (Ae): Archetype Elementalist
* (Ga): Gacha Aragami
* (Gp): Gacha Protector
* (Gy): Gacha Psychic
* (Ge): Gacha Elementalist
