import { Compendium, SquareChart, NameTrio, TripleCalculation, TripleCalculator } from '../models';

export class TripleFusionCalculator implements TripleCalculator {
  constructor(
    private fuseNonelem: TripleCalculation[],
    private fuseElement: TripleCalculation[]
  ) { }

  getFusions(name: string, compendium: Compendium, fusionChart: SquareChart): NameTrio[] {
    let recipes: NameTrio[] = [];
    const fusions = compendium.isElementDemon(name) ? this.fuseElement : this.fuseNonelem;

    for (const fusion of fusions) {
      recipes = recipes.concat(fusion(name, compendium, fusionChart));
    }

    return recipes;
  }
}
