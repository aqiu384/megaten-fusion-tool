(self.webpackChunkmegaten_fusion_tool=self.webpackChunkmegaten_fusion_tool||[]).push([[67],{1067:(e,t,a)=>{"use strict";a.r(t),a.d(t,{CompendiumModule:()=>w,SMT_COMP_CONFIG:()=>S});var i=a(1116),s=a(9624),l=a(5539);const r=JSON.parse('{"co":["HP","MP","MG","St","Ma","Vi","Lu"],"MG":["Pyro","Frost","Volt","Wind","Fury","Pagan","Skill"],"Z":{"Pyro":"Ignite","Frost":"Cool Down","Volt":"Inspect","Wind":"Scout","Fury":"Use Force","Pagan":"Read Mind","Skill":"Demonstrate"},"O9":{"w":1125,"-":100,"s":50,"n":0,"r":-100,"d":-1100},"sb":["phys","gun","fire","ice","elec","force","death","mind"],"tA":["almighty","recovery","support","passive","investigate"]}'),o=JSON.parse('{"Abihiko":{"inherit":"dea","inherits":"xox-","lvl":43,"person":"Knight","race":"Skill","resists":"--sws-n-","skills":["Blaze","Mana Surge","Fireball"],"stats":[550,405,93,16,23,14,10]},"Agathion":{"inherit":"ele","inherits":"-ooo","lvl":8,"person":"Little Kid","race":"Volt","resists":"--w-ss--","skilli":"Sneak","skills":["Zio","Elec Boost","Shock Shot"],"stats":[152,144,23,5,10,5,7]},"Alice":{"inherit":"rec","inherits":"xooo","lvl":32,"person":"Young Girl","race":"Pagan","resists":"------n-","skilla":"Mudo","skilli":"Scavenger","skills":["Petra","Mamudo","Curse","Raging Blast"],"stats":[401,336,106,10,20,6,15]},"Alp":{"inherit":"min","inherits":"-oo-","lvl":3,"person":"Young Girl","race":"Pagan","resists":"--ww----","skilli":"Sneak","skills":["Dia","Pulinpa","Mana Bonus","Bane Shot"],"stats":[92,93,13,5,7,5,5]},"Anzu":{"inherit":"for","inherits":"oooo","lvl":26,"person":"Beast","race":"Wind","resists":"----wn--","skilli":"Fly","skills":["Tetra Aura","Mazan","Money Find","Gale Slash"],"stats":[363,234,59,17,13,8,7]},"Arahabaki":{"inherit":"ice","inherits":"oooo","lvl":53,"person":"Undead","race":"Frost","resists":"w-nnnnn-","skilli":"Loose Change","skills":["Petra","Tarukaja","Ice Resist","Ice Drain"],"stats":[662,459,113,16,25,20,11]},"Azumi":{"inherit":"rec","inherits":"oooo","lvl":6,"person":"Old Woman","race":"Frost","resists":"--wn----","skilli":"Fly","skills":["Dia","Bufu","Heal Boost","Freeze Shot"],"stats":[128,114,19,5,8,5,6]},"Beelzebub":{"inherit":"rec","inherits":"xxox","lvl":80,"person":"Old Man","race":"Pagan","resists":"s--sssdn","skilli":"Intimidate","skills":["Mamudo","Maziodyne","First Aid","Astral Burst"],"stats":[826,612,167,26,31,27,14]},"Belial":{"inherit":"alm","inherits":"oooo","lvl":66,"person":"Old Man","race":"Pyro","resists":"-snws-ds","skilli":"Allure","skills":["Maragidyne","Diarahan","Curse","Astral Burst"],"stats":[742,402,139,32,17,22,14]},"Cerberus":{"inherit":"phy","inherits":"-ooo","lvl":49,"person":"Beast","race":"Pyro","resists":"--dw----","skilli":"Provoke","skills":["Mighty Blow","Maragidyne","Fire Resist","Fire Breath"],"stats":[630,255,105,30,9,19,10]},"Chernobog":{"inherit":"rec","inherits":"-ooo","lvl":33,"person":"Old Man","race":"Fury","resists":"--ws--n-","skills":["Cocytus","Pulinpa","Phys Resist","Null Phys"],"stats":[473,267,73,17,14,14,7]},"Feng Huang":{"inherit":"for","inherits":"oooo","lvl":33,"person":"Old Man","race":"Wind","resists":"--ssssw-","skilli":"Fly","skills":["Mazan","Recarm","Fast Escape","Null Force"],"stats":[441,279,73,14,15,10,13]},"Futsunushi":{"inherit":"phy","inherits":"-oxx","lvl":56,"person":"Old Man","race":"Skill","resists":"------ws","skilla":"Mighty Blow","skilli":"Fly","skills":["Mighty Blow","Tarukaja","Phys Resist","Phys Drain"],"stats":[663,372,119,25,17,18,15]},"Gashadokuro":{"inherit":"dea","inherits":"-ox-","lvl":48,"person":"Old Woman","race":"Pagan","resists":"--wd-wn-","skilla":"Mamudo","skilli":"Provoke","skills":["Mamudo","Retribution","Thunderbolt"],"stats":[656,312,103,17,14,23,13]},"Gdon":{"inherit":"phy","inherits":"oooo","lvl":39,"person":"Beast","race":"Pyro","resists":"-nsw---s","skills":["Agidyne","Life Gain","Fire Drain"],"stats":[513,213,85,25,8,13,8]},"Ghoul":{"inherit":"dea","inherits":"xxxx","lvl":27,"person":"Undead","race":"Pagan","resists":"--w-----","skills":["Combo","Life Gain","Vile Storm"],"stats":[365,189,61,14,9,7,16]},"Hitokotonusi":{"inherit":"dea","inherits":"-oo-","lvl":45,"person":"Undead","race":"Wind","resists":"-nw--dn-","skilli":"Fly","skills":["Zandyne","Diarama","Mage\'s Craft","Force Drain"],"stats":[572,387,97,17,20,15,12]},"Ichimokuren":{"inherit":"for","inherits":"ooo-","lvl":38,"person":"Undead","race":"Wind","resists":"--n-w---","skilli":"Fly","skills":["Tempest","Frenzy","Mage\'s Craft","Gale Slash"],"stats":[529,318,67,17,16,17,7]},"Ikusa":{"inherit":"dea","inherits":"-oo-","lvl":38,"person":"Knight","race":"Fury","resists":"----w-d-","skills":["Winged Fury","Rakukaja","Life Gain","Cross Slash"],"stats":[489,234,85,22,10,11,14]},"Incubus":{"inherit":"dea","inherits":"ooxo","lvl":51,"person":"Little Kid","race":"Pagan","resists":"----w-d-","skilli":"Allure","skills":["Marin Karin","Mana Gain","Wind Cutter"],"stats":[595,453,109,17,25,13,15]},"Ippon-Datara":{"inherit":"phy","inherits":"-oo-","lvl":12,"person":"Undead","race":"Skill","resists":"----w-ds","skilli":"Scavenger","skills":["Maragi","Rakukaja","Life Bonus","Flame Shot"],"stats":[229,132,31,9,8,9,5]},"Jack Frost":{"inherit":"ice","inherits":"xooo","lvl":18,"person":"Jack","race":"Frost","resists":"--wd----","skilli":"Scavenger","skills":["Mabufu","Ice Boost","Frigid Spin"],"stats":[285,210,39,7,13,8,9]},"Jubokko":{"inherit":"ice","inherits":"-oo-","lvl":28,"person":"Old Man","race":"Frost","resists":"--ws--ns","skills":["Venomstrike","Cocytus","Ice Resist","Null Ice"],"stats":[390,288,63,11,17,9,10]},"Kudan":{"inherit":"rec","inherits":"ooo-","lvl":51,"person":"Knight","race":"Skill","resists":"-d-----n","skilla":"Diarahan","skilli":"Fly","skills":["Diarahan","Endure","Null Phys"],"stats":[627,369,109,5,18,17,30]},"Kurama":{"inherit":"for","inherits":"-ooo","lvl":41,"person":"Knight","race":"Wind","resists":"----wd--","skilli":"Fly","skills":["Zandyne","Patra","Force Resist","Hurricane"],"stats":[544,375,89,15,21,15,9]},"Lamia":{"inherit":"phy","inherits":"-ooo","lvl":28,"person":"Old Woman","race":"Fury","resists":"-----w-s","skilli":"Allure","skills":["Marin Karin","Mana Gain","Null Mind"],"stats":[430,180,63,18,8,14,7]},"Leanan Sidhe":{"inherit":"min","inherits":"-oo-","lvl":25,"person":"Seductive","race":"Skill","resists":"--wn---s","skilla":"Dormina","skilli":"Allure","skills":["Dormina","Diarama","Mind Boost","Freeze Shot"],"stats":[362,267,57,10,16,9,9]},"Legion A":{"inherit":"alm","inherits":"----","lvl":4,"person":"Undead","race":"Skill","resists":"--n-----","skilli":"Loose Change","skills":["Combo","Regenerate","Bane Shot"],"stats":[112,84,15,5,6,6,6]},"Legion B":{"inherit":"alm","inherits":"----","lvl":5,"person":"Undead","race":"Skill","resists":"wwwwwwww","skills":["Combo","Fast Escape","Bane Shot"],"stats":[116,99,17,7,7,5,7]},"Legion C":{"inherit":"alm","inherits":"----","lvl":20.1,"person":"Undead","race":"Skill","resists":"d--n----","skilli":"Provoke","skills":["Venomstrike","War Cry","Hex","Cross Slash"],"stats":[305,132,47,20,6,8,5]},"Legion D":{"inherit":"alm","inherits":"----","lvl":20.2,"person":"Undead","race":"Skill","resists":"----n--d","skilli":"Allure","skills":["Media","Samarecarm","Heal Boost","Null Mind"],"stats":[305,300,47,6,20,8,5]},"Legion E":{"inherit":"alm","inherits":"----","lvl":20.3,"person":"Undead","race":"Skill","resists":"-----nd-","skilli":"Intimidate","skills":["Mudo","Petra","Mana Gain","Vile Storm"],"stats":[305,132,47,5,6,8,20]},"Lilith":{"inherit":"min","inherits":"-xoo","lvl":58,"person":"Old Woman","race":"Pagan","resists":"n--w----","skilla":"Dormina","skilli":"Allure","skills":["Mudo","Dormina","Mind Boost","Vile Storm"],"stats":[626,558,123,18,32,12,17]},"Mishaguji":{"inherit":"ele","inherits":"oooo","lvl":50,"person":"Old Man","race":"Volt","resists":"s--wn-ns","skilli":"Allure","skills":["Frenzy","Samarecarm","Item Find","Shock Wave"],"stats":[628,390,107,19,20,18,12]},"Moh Shuvuu":{"inherit":"min","inherits":"oooo","lvl":15,"person":"Young Girl","race":"Wind","resists":"--w-dnw-","skilli":"Fly","skills":["Dia","Zan","Force Boost","Blast Shot"],"stats":[238,201,37,7,13,6,8]},"Mokoi":{"inherit":"rec","inherits":"-ooo","lvl":13,"person":"Show-Off","race":"Pagan","resists":"--wn----","skilli":"Loose Change","skills":["Winged Fury","Fast Escape","Bane Shot"],"stats":[208,147,33,11,9,5,7]},"Muspell":{"inherit":"phy","inherits":"-ooo","lvl":54,"person":"Old Man","race":"Pyro","resists":"--dw----","skills":["Agidyne","Fire Boost","Fire Breath"],"stats":[628,342,111,34,15,15,9]},"Nagasunehiko":{"inherit":"dea","inherits":"xox-","lvl":41,"person":"Punk","race":"Skill","resists":"--wss-n-","skills":["Frostbite","Life Surge","Frozen Lance"],"stats":[544,315,89,21,16,15,9]},"Nebiros":{"inherit":"dea","inherits":"xxxx","lvl":42,"person":"Knight","race":"Pagan","resists":"n----wn-","skilla":"Mudo","skills":["Mudo","Makara Aura","Mana Surge","Null Death"],"stats":[511,366,91,23,20,10,8]},"Nekomata":{"inherit":"ele","inherits":"xxo-","lvl":29,"person":"Seductive","race":"Skill","resists":"----wd-s","skilla":"Petra","skilli":"Allure","skills":["Marin Karin","Dormina","Devotion","Voltaic Ring"],"stats":[399,243,65,14,13,9,12]},"Nue":{"inherit":"phy","inherits":"-ooo","lvl":40,"person":"Beast","race":"Volt","resists":"--w-ns--","skilli":"Allure","skills":["Bolt Storm","Ziodyne","Money Find","Thunderbolt"],"stats":[512,312,91,22,16,12,9]},"Obariyon":{"inherit":"phy","inherits":"xxxx","lvl":5,"person":"Show-Off","race":"Fury","resists":"---w-wn-","skilli":"Sneak","skills":["Combo","Life Bonus","Vile Storm"],"stats":[132,51,17,10,3,7,4]},"Oboroguruma":{"inherit":"ele","inherits":"ooo-","lvl":27,"person":"Undead","race":"Volt","resists":"-n-wd---","skilli":"Allure","skills":["War Cry","Mazio","Elec Boost","Rush"],"stats":[421,201,61,19,10,14,3]},"Okiku-Mushi":{"inherit":"dea","inherits":"xxxx","lvl":24,"person":"Seductive","race":"Pagan","resists":"--w-d-n-","skilla":"Null Death","skilli":"Provoke","skills":["Marin Karin","Makakaja","Mana Bonus","Null Death"],"stats":[361,216,55,13,12,10,8]},"Okuninushi":{"inherit":"ice","inherits":"oooo","lvl":32,"person":"Knight","race":"Frost","resists":"-nws--n-","skilli":"Intimidate","skills":["Bufudyne","Diarama","Endure","Null Ice"],"stats":[457,288,71,17,13,16,5]},"Oni":{"inherit":"phy","inherits":"oooo","lvl":22,"person":"Punk","race":"Fury","resists":"s---w---","skilli":"Provoke","skills":["Berserker","Tetra Aura","Life Bonus","Gale Slash"],"stats":[373,138,51,15,6,14,6]},"Orochi":{"inherit":"ice","inherits":"-ooo","lvl":63,"person":"Beast","race":"Frost","resists":"-d-dw---","skills":["Bufudyne","Mabufudyne","Phys Resist","Glacial Blast"],"stats":[745,513,133,17,27,24,14]},"Orthrus":{"inherit":"fir","inherits":"-ooo","lvl":14,"person":"Beast","race":"Pyro","resists":"--nw----","skills":["Maragi","Quick Study","Fireball"],"stats":[243,114,35,14,6,8,5]},"Oshichi":{"inherit":"fir","inherits":"-ooo","lvl":23,"person":"Seductive","race":"Pyro","resists":"-nsw--nn","skilli":"Allure","skills":["Agi","Patra","Fire Boost","Null Fire"],"stats":[319,261,53,10,16,6,10]},"Oumitsunu":{"inherit":"ele","inherits":"-oo-","lvl":55,"person":"Knight","race":"Volt","resists":"s---dw--","skills":["Spark","Maziodyne","Life Surge","Elec Drain"],"stats":[730,333,117,20,14,27,14]},"Ouyamatsumi":{"inherit":"ice","inherits":"-ooo","lvl":50,"person":"Knight","race":"Frost","resists":"s-ws-wn-","skills":["Mabufudyne","Life Gain","Glacial Blast"],"stats":[700,270,107,24,10,27,8]},"Parvati":{"inherit":"min","inherits":"-oo-","lvl":46,"person":"Old Woman","race":"Volt","resists":"s---sww-","skilli":"Allure","skills":["Spark","Media","Elec Resist","Elec Drain"],"stats":[571,450,99,12,26,14,13]},"Poltergeist":{"inherit":"for","inherits":"xoox","lvl":10,"person":"Little Kid","race":"Wind","resists":"-nw-wsnn","skilla":"Wind Cutter","skilli":"Sneak","skills":["Zan","Force Resist","Null Force"],"stats":[182,150,27,6,10,6,7]},"Power":{"inherit":"alm","inherits":"ooo-","lvl":51,"person":"Punk","race":"Wind","resists":"--ssssw-","skilli":"Fly","skills":["Mazandyne","Samarecarm","Item Find","Hurricane"],"stats":[611,393,109,24,20,15,11]},"Pyro Jack":{"inherit":"fir","inherits":"xooo","lvl":10,"person":"Punk","race":"Pyro","resists":"--dw----","skilli":"Fly","skills":["Agi","Pulinpa","Fire Resist","Fiery Spiral"],"stats":[190,168,27,5,11,7,6]},"Raiho":{"inherit":"alm","inherits":"oooo","lvl":23,"person":"Jack","race":"Frost","resists":"---d---n","skilli":"Allure","skills":["Mabufu","Cocytus","Fire Resist","Frozen Lance"],"stats":[343,249,53,8,15,9,10]},"Raiju":{"inherit":"ele","inherits":"oooo","lvl":16,"person":"Punk","race":"Volt","resists":"----dwn-","skilli":"Sneak","skills":["Zio","Elec Resist","Voltaic Ring"],"stats":[288,108,39,15,5,11,5]},"Raja Naga":{"inherit":"phy","inherits":"oooo","lvl":39,"person":"Punk","race":"Frost","resists":"--wns---","skills":["Bufudyne","Dia Aura","Quick Study","Frigid Spin"],"stats":[489,321,85,21,17,10,10]},"Rakshasa":{"inherit":"phy","inherits":"ooo-","lvl":44,"person":"Undead","race":"Fury","resists":"-----w--","skilli":"Provoke","skills":["Diarama","Frenzy","Hero\'s Might","Cross Slash"],"stats":[565,288,95,23,13,15,12]},"Sandalphon":{"inherit":"alm","inherits":"-ooo","lvl":74,"person":"Knight","race":"Wind","resists":"-----nw-","skilli":"Fly","skills":["Flurry","Diarahan","Force Boost","Wind Cutter"],"stats":[779,582,155,24,30,23,16]},"Sati":{"inherit":"rec","inherits":"-oo-","lvl":29,"person":"Old Woman","race":"Pyro","resists":"-ddw--w-","skilli":"Fly","skills":["Hellfire","Recarm","Devotion","Fireball"],"stats":[423,327,65,7,20,12,9]},"Scathach":{"inherit":"phy","inherits":"xoxx","lvl":47,"person":"Old Woman","race":"Skill","resists":"----wn-s","skilli":"Fly","skills":["Flurry","Makara Aura","Quick Study","Cross Slash"],"stats":[569,417,101,19,23,13,11]},"Shouten":{"inherit":"phy","inherits":"oooo","lvl":52,"person":"Knight","race":"Fury","resists":"s--s-sw-","skilli":"Loose Change","skills":["Mighty Blow","Retribution","Null Phys"],"stats":[689,264,107,27,9,24,11]},"Siegfried":{"inherit":"phy","inherits":"ooo-","lvl":61,"person":"Knight","race":"Fury","resists":"s---w-nn","skilli":"Intimidate","skills":["Mazandyne","War Cry","Endure","Phys Drain"],"stats":[723,351,129,27,14,23,16]},"Susano-O":{"inherit":"phy","inherits":"-oo-","lvl":70,"person":"Punk","race":"Fury","resists":"s-dw--n-","skilli":"Fly","skills":["Berserker","Winged Fury","Hero\'s Might","Astral Burst"],"stats":[781,212,147,35,17,25,12]},"Tarrasque":{"inherit":"phy","inherits":"-ooo","lvl":43,"person":"Old Man","race":"Frost","resists":"s-wss---","skills":["Frostbite","Ice Boost","Frozen Lance"],"stats":[622,261,93,18,11,23,10]},"Thor":{"inherit":"ele","inherits":"ooo-","lvl":61,"person":"Knight","race":"Volt","resists":"----dw--","skilli":"Allure","skills":["Maziodyne","Hero\'s Might","Raging Blast"],"stats":[704,363,129,31,15,20,14]},"Thoth":{"inherit":"rec","inherits":"xxoo","lvl":38,"person":"Show-Off","race":"Skill","resists":"w-ddddwd","skilla":"Dia Aura","skilli":"Scavenger","skills":["Makakaja","Dia Aura","First Aid","Null Mind"],"stats":[449,414,83,11,25,6,15]},"Throne":{"inherit":"alm","inherits":"oooo","lvl":44,"person":"Knight","race":"Pyro","resists":"--dwnnn-","skilli":"Fly","skills":["Blaze","Makajam","Devotion","Rush"],"stats":[541,420,95,15,24,12,11]},"Triglav":{"inherit":"phy","inherits":"oooo","lvl":41,"person":"Punk","race":"Fury","resists":"sn-d-w--","skills":["Winged Fury","Tarukaja","Mana Gain","Rush"],"stats":[528,291,89,22,14,13,11]},"Tsuchigumo":{"inherit":"ele","inherits":"oooo","lvl":21,"person":"Punk","race":"Volt","resists":"s--wsw--","skills":["Venomstrike","Mazio","Hex","Null Elec"],"stats":[347,135,49,17,6,12,6]},"Turdak":{"inherit":"dea","inherits":"-ooo","lvl":17,"person":"Undead","race":"Fury","resists":"s-w--w--","skills":["Makajam","Hex","Fiery Spiral"],"stats":[299,111,41,14,5,11,6]},"Ukobach":{"inherit":"fir","inherits":"-ooo","lvl":2,"person":"Punk","race":"Pyro","resists":"--nw----","skills":["Agi","Fast Escape","Flame Shot"],"stats":[80,78,13,5,6,5,5]},"Utai-Gaikotsu":{"inherit":"dea","inherits":"xxxx","lvl":35,"person":"Punk","race":"Pagan","resists":"w-d--wn-","skilli":"Fly","skills":["Petra","Retribution","Vile Storm"],"stats":[466,333,77,10,19,11,14]},"Yoshitsune":{"inherit":"phy","inherits":"-ooo","lvl":36,"person":"Punk","race":"Fury","resists":"-s----n-","skills":["Mighty Blow","War Cry","Curse","Raging Blast"],"stats":[490,276,79,20,14,13,8]}}'),n=JSON.parse('{"Agi":{"cost":1003,"effect":"Light fire damage to one target.","elem":"fire","target":"Single target, Straight line"},"Agidyne":{"cost":1007,"effect":"Heavy fire damage to a near target.","elem":"fire","target":"Single target, Straight line"},"Allure":{"effect":"Gathers Items","elem":"investigate"},"Astral Burst":{"cost":2200,"effect":"Inflicts super almighty damage to all enemies.","elem":"almighty","target":"All enemies"},"Bane Shot":{"cost":2100,"effect":"Super gun damage to target, will bind if weak to Death.","elem":"death","target":"Single target, Straight Line"},"Berserker":{"cost":1004,"effect":"Light physical damage + rage to a nearby enemy.","elem":"phys","target":"Single target, Near"},"Blast Shot":{"cost":2100,"effect":"Super gun damage to target, will impede if weak to Force.","elem":"force","target":"Single target, Straight line"},"Blaze":{"cost":1007,"effect":"Moderate fire damage to all enemies hit.","elem":"fire","target":"3-way spread, Straight lines"},"Bolt Storm":{"cost":1005,"effect":"Light electric damage to target, Sluggish for a short time","elem":"elec","target":"Single target, Tracking"},"Bufu":{"cost":1003,"effect":"Light ice damage to one target.","elem":"ice","target":"Single target, Straight line"},"Bufudyne":{"cost":1007,"effect":"Heavy ice damage to target, splash damage to enemies nearby.","elem":"ice","target":"Single target, Straight line"},"Cocytus":{"cost":1005,"effect":"Light ice damage to target, Sluggish for a short time","elem":"ice","target":"Projectile, Tracking"},"Combo":{"cost":1003,"effect":"Repeated attacks to nearby enemy for light physical damage.","elem":"phys","target":"Single target"},"Cool Down":{"effect":"Calms people down, freezes water.","elem":"investigate"},"Cross Slash":{"cost":2120,"effect":"Inflicts super physical damage to all enemies on four straight lines from where power is used.","elem":"phys","target":"Special"},"Curse":{"effect":"Chance of returning damage to attacker.","elem":"passive"},"Demonstrate":{"effect":"Random effects","elem":"investigate"},"Devotion":{"effect":"Demon gains loyalty at almost twice the normal rate.","elem":"passive"},"Dia":{"cost":1003,"effect":"Recovers a small amount of HP.","elem":"recovery","target":"One ally"},"Dia Aura":{"cost":1005,"effect":"Slowly recover health.","elem":"recovery","target":"All allies"},"Diarahan":{"cost":1008,"effect":"Recovers all HP.","elem":"recovery","target":"One ally"},"Diarama":{"cost":1005,"effect":"Recovers a moderate amount of HP.","elem":"recovery","target":"One ally"},"Dormina":{"cost":1005,"effect":"Light mind damage + sleep to all enemies in radius.","elem":"mind","target":"Medium radius"},"Elec Boost":{"effect":"Grants a boost to electric type damage.","elem":"passive"},"Elec Drain":{"cost":2100,"effect":"Raidou and demon will drain electric attacks for the duration.","elem":"support","target":"All allies"},"Elec Resist":{"effect":"Reduces electric damage taken by half. Cancels Weak vs. Elec.","elem":"passive"},"Endure":{"effect":"High chance to survive fatal attacks with 1 HP remaining, once per battle.","elem":"passive"},"Fast Escape":{"effect":"Reduces escape time","elem":"passive"},"Fiery Spiral":{"cost":2120,"effect":"Super physical damage to target, will burn if weak to Fire.","elem":"fire","target":"Radius around Raidou"},"Fire Boost":{"effect":"Grants a boost to fire type damage.","elem":"passive"},"Fire Breath":{"cost":2180,"effect":"Heavy fire damage to all in the straight line.","elem":"fire","target":"All targets, Straight line"},"Fire Drain":{"cost":2100,"effect":"Raidou and demon will drain fire attacks for the duration.","elem":"support","target":"All allies"},"Fire Resist":{"effect":"Reduces fire damage taken by half. Cancels Weak vs. Fire.","elem":"passive"},"Fireball":{"cost":2150,"effect":"Super fire damage to all enemies in straight line.","elem":"fire","target":"All targets, Straight line"},"First Aid":{"effect":"The demon and Raidou will recover all HP after the fight ends.","elem":"passive"},"Flame Shot":{"cost":2100,"effect":"Super gun damage to target, will burn if weak to Fire.","elem":"fire","target":"Single target, Straight line"},"Flurry":{"cost":1007,"effect":"Moderate force damage to all enemies hit.","elem":"force","target":"3-Way spread, Straight lines"},"Fly":{"effect":"Allows a demon to access unreachable areas","elem":"investigate"},"Force Boost":{"effect":"Grants a boost to force type damage.","elem":"passive"},"Force Drain":{"cost":2100,"effect":"Raidou and demon will drain force attacks for the duration.","elem":"support","target":"All allies"},"Force Resist":{"effect":"Reduces force damage taken by half. Cancels Weak vs. Force.","elem":"passive"},"Freeze Shot":{"cost":2100,"effect":"Super gun damage to target, will freeze if weak to ice.","elem":"ice","target":"Single target, Straight line"},"Frenzy":{"cost":1004,"effect":"Causes light physical damage to all enemies around demon.","elem":"phys","target":"Small radius"},"Frigid Spin":{"cost":2120,"effect":"Super physical damage to target, will freeze if weak to ice.","elem":"ice","target":"Radius around Raidou"},"Frostbite":{"cost":1007,"effect":"Moderate ice damage to all enemies hit.","elem":"ice","target":"3-way spread, Straight lines"},"Frozen Lance":{"cost":2150,"effect":"Super ice damage to all enemies in straight line.","elem":"ice","target":"All targets, Straight line"},"Gale Slash":{"cost":2120,"effect":"Super physical damage to target, will impede if weak to Force.","elem":"force","target":"Radius around Raidou"},"Glacial Blast":{"cost":2180,"effect":"Heavy ice damage to all in the straight line.","elem":"ice","target":"All targets, Straight line"},"Heal Boost":{"effect":"Demons recovery type spells are 50% more effective.","elem":"passive"},"Hellfire":{"cost":1005,"effect":"Light fire damage to target, Sluggish for a short time","elem":"fire","target":"Projectile, Tracking"},"Hero\'s Might":{"effect":"Moderate chance for the demon to double attack power for the current battle.","elem":"passive"},"Hex":{"effect":"High chance to return half the damage taken to the attacker.","elem":"passive"},"Hurricane":{"cost":2150,"effect":"Super force damage to all enemies in straight line.","elem":"force","target":"All targets, Straight line"},"Ice Boost":{"effect":"Grants a boost to ice type damage.","elem":"passive"},"Ice Drain":{"cost":2100,"effect":"Raidou and demon will drain ice attacks for the duration.","elem":"support","target":"All allies"},"Ice Resist":{"effect":"Reduces ice damage taken by half. Cancels Weak vs. Ice.","elem":"passive"},"Ignite":{"effect":"Makes people talk, sets some objects on fire.","elem":"investigate"},"Inspect":{"effect":"Uncovers hidden objects.","elem":"investigate"},"Intimidate":{"effect":"Lowers the encounter rate","elem":"investigate"},"Item Find":{"effect":"Demon will find items after battle more often.","elem":"passive"},"Life Bonus":{"effect":"Will increase the demons maximum HP by 10%","elem":"passive"},"Life Gain":{"effect":"Will increase the demons maximum HP by 20%","elem":"passive"},"Life Surge":{"effect":"Will increase the demons maximum HP by 30%","elem":"passive"},"Loose Change":{"effect":"Grants Yen","elem":"investigate"},"Mabufu":{"cost":1004,"effect":"Moderate ice damage to all in radius.","elem":"ice","target":"Small radius"},"Mabufudyne":{"cost":1008,"effect":"Heavy ice damage to all in radius.","elem":"ice","target":"Medium radius"},"Mage\'s Craft":{"effect":"Moderate chance for the demon to double magic power for the current battle.","elem":"passive"},"Makajam":{"cost":1004,"effect":"Light mind damage + mute to target.","elem":"mind","target":"Projectile, Straight line"},"Makakaja":{"cost":1006,"effect":"Lowers magical damage until the end of the battle.","elem":"support","target":"One ally"},"Makara Aura":{"cost":1008,"effect":"Raises all allies magical defense until the end of the battle.","elem":"support","target":"All allies"},"Mamudo":{"cost":1006,"effect":"HP of all enemies near demon are halved.","elem":"death","target":"Small radius"},"Mana Bonus":{"effect":"Will increase the demons maximum MP by 10%","elem":"passive"},"Mana Gain":{"effect":"Will increase the demons maximum MP by 20%","elem":"passive"},"Mana Surge":{"effect":"Will increase the demons maximum MP by 30%","elem":"passive"},"Maragi":{"cost":1004,"effect":"Moderate fire damage to all in radius.","elem":"fire","target":"Small radius"},"Maragidyne":{"cost":1008,"effect":"Heavy fire damage to all in radius.","elem":"fire","target":"Medium radius"},"Marin Karin":{"cost":1004,"effect":"Light mind damage + charm to all enemies in radius.","elem":"mind","target":"Small radius"},"Mazan":{"cost":1004,"effect":"Moderate force damage to all in radius.","elem":"force","target":"Small radius"},"Mazandyne":{"cost":1008,"effect":"Heavy force damage to all in radius.","elem":"force","target":"Medium radius"},"Mazio":{"cost":1004,"effect":"Moderate electric damage to all in radius.","elem":"elec","target":"Small radius"},"Maziodyne":{"cost":1008,"effect":"Heavy electric damage to all in radius.","elem":"elec","target":"Medium radius"},"Media":{"cost":1006,"effect":"Raidou and all allies recover a small amount of HP.","elem":"recovery","target":"All allies"},"Mighty Blow":{"cost":1004,"effect":"Moderate physical damage + rage to nearby enemy.","elem":"phys","target":"Single target, Near"},"Mind Boost":{"effect":"Improves the chance of status ailments effecting the enemies.","elem":"passive"},"Money Find":{"effect":"Demon will find extra money after battles.","elem":"passive"},"Mudo":{"cost":1003,"effect":"Targets HP is halved.","elem":"death","target":"Single target, Straight Line"},"Null Death":{"cost":2070,"effect":"Raidou and demon will null death attacks for the duration.","elem":"support","target":"All allies"},"Null Elec":{"cost":2070,"effect":"Raidou and demon will null electric attacks for the duration.","elem":"support","target":"All allies"},"Null Fire":{"cost":2070,"effect":"Raidou and demon will null fire attacks for the duration.","elem":"support","target":"All allies"},"Null Force":{"cost":2070,"effect":"Raidou and demon will null force attacks for the duration.","elem":"support","target":"All allies"},"Null Ice":{"cost":2070,"effect":"Raidou and demon will null ice attacks for the duration.","elem":"support","target":"All allies"},"Null Mind":{"cost":2070,"effect":"Raidou and demon will null mind attacks for the duration.","elem":"support","target":"All allies"},"Null Phys":{"cost":2070,"effect":"Raidou and demon will null physical attacks for the duration.","elem":"support","target":"All allies"},"Patra":{"cost":1003,"effect":"Target recovers from all mind-type status ailments.","elem":"recovery","target":"One ally"},"Petra":{"cost":1005,"effect":"Light mind damage + stone to all enemies in line with demon.","elem":"mind","target":"All targets, Straight line"},"Phys Drain":{"cost":2100,"effect":"Raidou and demon will drain physical attacks for the duration.","elem":"support","target":"All allies"},"Phys Resist":{"effect":"Reduces physical damage taken by half. Cancels Weak vs. Physical.","elem":"passive"},"Provoke":{"effect":"Increases encounter rate","elem":"investigate"},"Pulinpa":{"cost":1003,"effect":"Light mind damage + mute to target.","elem":"mind","target":"Single target, Straight Line"},"Quick Study":{"effect":"Demon will gain almost double experience after battles.","elem":"passive"},"Raging Blast":{"cost":2120,"effect":"Super physical damage to target","elem":"phys","target":"Radius around Raidou"},"Rakukaja":{"cost":1006,"effect":"Lowers damage received until the end of the battle.","elem":"support","target":"One ally"},"Read Mind":{"effect":"Reads peoples\' minds.","elem":"investigate"},"Recarm":{"cost":1008,"effect":"Revives target","elem":"recovery","target":"One ally"},"Regenerate":{"effect":"The demon and Raidou recover HP every few seconds in combat.","elem":"passive"},"Retribution":{"effect":"High chance to deal heavy Almighty damage to enemies in a radius when demon dies.","elem":"passive"},"Rush":{"cost":2120,"effect":"Inflicts super physical damage to all enemies in a straight line from the demon, moves demon along the path.","elem":"phys","target":"Straight line"},"Samarecarm":{"cost":1012,"effect":"Revives target with full HP","elem":"recovery","target":"One ally"},"Scavenger":{"effect":"Has a chance to obtain items","elem":"investigate"},"Scout":{"effect":"Search the area for enemies and items","elem":"investigate"},"Shock Shot":{"cost":2100,"effect":"Super gun damage to target, will shock if weak to Electric.","elem":"elec","target":"Single target, Straight Line"},"Shock Wave":{"cost":2180,"effect":"Heavy electric damage to all in the straight line.","elem":"elec","target":"All targets, Straight line"},"Sneak":{"effect":"Allows a demon to access unreachable areas","elem":"investigate"},"Spark":{"cost":1007,"effect":"Moderate electric damage to all enemies hit.","elem":"elec","target":"3-Way spread, Straight lines"},"Tarukaja":{"cost":1006,"effect":"Raises allies physical attack until the end of the battle.","elem":"support","target":"One ally"},"Tempest":{"cost":1005,"effect":"Light force damage to target, Sluggish for a short time","elem":"force","target":"Single target, Tracking"},"Tetra Aura":{"cost":1008,"effect":"Raises all allies physical defense until the end of the battle.","elem":"support","target":"All allies"},"Thunderbolt":{"cost":2150,"effect":"Super electric damage to all enemies in straight line.","elem":"elec","target":"All targets, Straight line"},"Use Force":{"effect":"Moves heavy objects","elem":"investigate"},"Venomstrike":{"cost":1004,"effect":"Causes light physical damage + poison to a nearby enemy.","elem":"phys","target":"Single target, Near"},"Vile Storm":{"cost":2120,"effect":"Super physical damage to target, will bind if weak to Death.","elem":"death","target":"Radius around Raidou"},"Voltaic Ring":{"cost":2120,"effect":"Super physical damage to target, will shock if weak to Electric.","elem":"elec","target":"Radius around Raidou"},"War Cry":{"cost":1008,"effect":"Raises all allies attack until the end of the battle.","elem":"support","target":"All allies"},"Wind Cutter":{"cost":2180,"effect":"Heavy force damage to all in the straight line.","elem":"force","target":"All targets, Straight line"},"Winged Fury":{"cost":1004,"effect":"Hits enemy with thrown weapon for light physical damage, chance to knock enemy down.","elem":"phys","target":"Single target, Straight line"},"Zan":{"cost":1003,"effect":"Light force damage to one target.","elem":"force","target":"Single target, Straight Line"},"Zandyne":{"cost":1007,"effect":"Heavy force damage to target, splash damage to enemies nearby.","elem":"force","target":"Single target, Straight Line"},"Zio":{"cost":1003,"effect":"Light electric damage to one target.","elem":"elec","target":"Single target, Straight line"},"Ziodyne":{"cost":1007,"effect":"Heavy electric damage to target, splash damage to enemies nearby.","elem":"elec","target":"Single target, Straight line"}}'),c=JSON.parse('{"races":["Pyro","Frost","Volt","Wind","Fury","Pagan","Skill"],"table":[["Skill"],["Wind","Pagan"],["Fury","Fury","Pagan"],["Volt","Pyro","Frost","Skill"],["Wind","Volt","Frost","Pyro","Skill"],["Frost","Fury","Pyro","Volt","Wind","Skill"],["Random","Random","Random","Random","Random","Random","Pagan"]]}'),h=JSON.parse('{"Legion A":"Fusion Accident","Legion B":"Fusion Accident","Legion C":"Fusion Accident","Legion D":"Fusion Accident","Legion E":"Fusion Accident","Ichimokuren":"Defeat in Chapter 1","Chernobog":"Defeat in Chapter 3","Abihiko":"Defeat in Chapter 5","Nagasunehiko":"Defeat in Chapter 5","Hitokotonusi":"Defeat in Chapter 7","Mishaguji":"Defeat in Chapter 8","Alice":"Defeat in Ginza-Cho","Raiho":"Defeat in Konnou-Ya","Yoshitsune":"Defeat in Training Hall","Beelzebub":"Defeat in Training Hall","Kudan":"Obtain Prophetic Book"}'),d=JSON.parse('{"Legion A":[],"Legion B":[],"Legion C":[],"Legion D":[],"Legion E":[]}');var g=a(3378),m=a(5875),u=a(1742),f=a(5614);function k(e){const t={};for(let a=0;a<e.length;a++)t[e[a]]=a;return t}const p=r.MG,y=r.sb.map(e=>e.slice(0,3)),v=y.concat(r.tA.map(e=>e.slice(0,3)));for(const F of Object.values(o)){const e=Math.floor(F.lvl),t=F.skills,a={};a[t[0]]=0,a[r.Z[F.race]]=0,a[t[t.length-2]]=e+2,a[t[t.length-1]]=e+1,t.length>3&&(a[t[1]]=0),F.skilli&&(a[F.skilli]=0),F.nskills=a}for(const F of Object.values(n))F.elem=F.elem.slice(0,3);for(const[F,M]of Object.entries(h))o[F].prereq=M;const S={appTitle:"Raidou Kuzunoha vs. The Soulless Army",gameTitles:{krch:"Raidou Kuzunoha vs. The Soulless Army"},appCssClasses:["kuzu","krch"],races:p,resistElems:y,skillElems:v,baseStats:r.co,fusionLvlMod:2.5,resistCodes:r.O9,raceOrder:k(p),elemOrder:k(v),fissionCalculator:l.uC,fusionCalculator:l.YP,demonData:{krch:[o]},skillData:{krch:[n]},normalTable:c,elementTable:{elems:[],races:[],table:[]},mitamaTable:[],specialRecipes:{krch:d}};let w=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=f.oAB({type:e}),e.\u0275inj=f.cJS({providers:[s.Dx,g.Y,[{provide:l.vE,useExisting:g.Y}],[{provide:l.I7,useValue:S}]],imports:[[i.ez,m.y,u.V]]}),e})()}}]);