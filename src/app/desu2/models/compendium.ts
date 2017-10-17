import { DesuCompendium } from '../../desu/models/compendium';

import * as DEMON_DATA_JSON from '../data/demon-data.json';
import * as SKILL_DATA_JSON from '../data/skill-data.json';
import * as SPECIAL_RECIPES_JSON from '../data/special-recipes.json';


export class Compendium extends DesuCompendium {
  static readonly DLC_DEMONS: { [name: string]: boolean } = {
    'Dantalian,Momunofu,Ishtar,Troll,Spriggan,Kau': true,
    'Lucifer Frost,Dominion,Dokkaebi,Roitschaggatta,Catoblepas,Okuninushi': true,
    'Seth,Fafnir,Lucifuge,Black Maria,Ongyo-Ki,Cabracan': true,
    'Mother Harlot,Rukh,Jahi,Macabre,Sraosha,Yurlungur': true,
    'Izaya Orihara,Celty Sturluson,Shizuo Heiwajima': false
  };

  constructor() {
    super(DEMON_DATA_JSON, SKILL_DATA_JSON, SPECIAL_RECIPES_JSON, Compendium.DLC_DEMONS);
  }
}
