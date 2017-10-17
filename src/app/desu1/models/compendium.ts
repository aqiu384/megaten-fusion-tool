import { DesuCompendium } from '../../desu/models/compendium';

import * as DEMON_DATA_JSON from '../data/demon-data.json';
import * as SKILL_DATA_JSON from '../data/skill-data.json';
import * as SPECIAL_RECIPES_JSON from '../data/special-recipes.json';

export class Compendium extends DesuCompendium {
  constructor() {
    super(DEMON_DATA_JSON, SKILL_DATA_JSON, SPECIAL_RECIPES_JSON, {});
  }
}
