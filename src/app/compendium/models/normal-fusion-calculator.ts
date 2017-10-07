import { Compendium, FusionChart, NamePair, FusionCalculation, FusionCalculator } from '../models';

export class NormalFusionCalculator implements FusionCalculator {
  constructor(
    private fuseNonelem: FusionCalculation[],
    private fuseElement: FusionCalculation[]
  ) { }

  getFusions(name: string, compendium: Compendium, fusionChart: FusionChart): NamePair[] {
    let recipes: NamePair[] = [];
    const fusions = compendium.isElementDemon(name) ? this.fuseElement : this.fuseNonelem;

    for (const fusion of fusions) {
      recipes = recipes.concat(fusion(name, compendium, fusionChart));
    }

    return recipes;
  }
}
