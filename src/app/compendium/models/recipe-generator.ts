import { Demon, FusionRecipe, Compendium, FusionChart, SquareChart, RecipeGeneratorConfig } from '../models';
import { toFusionPair, toFusionPairResult, toDemonTrio } from './conversions';

type SkillRef = { [skill: string]: string };

export function createSkillsRecipe(demon: string, ingreds: string[], skills: SkillRef, comp: Compendium, squareChart: SquareChart, recipeConfig: RecipeGeneratorConfig): FusionRecipe {
  const { fissionCalculator, inheritElems, restrictInherits, triExclusiveRaces, triFissionCalculator } = recipeConfig;
  const { normalChart } = squareChart;
  const demonR = comp.getDemon(demon);

  const skillRef: SkillRef = {};

  for (const [sname, dname] of Object.entries(skills)) {
    if (dname !== '-' && dname !== demonR.name)  {
      skillRef[sname] = dname;
    }
  }

  const skillsI = Object.keys(skills).map(s => comp.getSkill(s));
  const canInheritI = canInheritCode(skillsI.map(s => s.element), inheritElems);
  let stepR = comp.getSpecialNameEntries(demon);

  if (stepR.length < 2 && triExclusiveRaces.includes(demonR.race)) {
    const trioR = triFissionCalculator
      .getFusions(demon, comp, squareChart)
      .map(p => toDemonTrio(p, comp))
      .sort((a, b) => a.price - b.price)
      .find(t =>
        (canInheritI & (t.d1.inherits | t.d2.inherits)) === canInheritI &&
        (t.d1.fusion === 'special' || !triExclusiveRaces.includes(t.d1.race)) &&
        (t.d2.fusion === 'special' || !triExclusiveRaces.includes(t.d2.race)) &&
        (t.d3.fusion === 'special' || !triExclusiveRaces.includes(t.d3.race))
      );
    if (trioR) { stepR = [trioR.d1.name, trioR.d2.name, trioR.d3.name]; }
  }

  if (stepR.length < 2) {
    const pairR = fissionCalculator
      .getFusions(demon, comp, normalChart)
      .map(p => toFusionPair(p, comp))
      .sort((a, b) => a.price - b.price)
      .find(p =>
        (canInheritI & (comp.getDemon(p.name1).inherits | comp.getDemon(p.name2).inherits)) === canInheritI &&
        (comp.getDemon(p.name1).fusion === 'normal' || comp.getDemon(p.name1).fusion === 'special') &&
        (comp.getDemon(p.name2).fusion === 'normal' || comp.getDemon(p.name2).fusion === 'special')
      );
    if (pairR) { stepR = [pairR.name1, pairR.name2]; }
  }

  const ingredsR = stepR.map(i => comp.getDemon(i)).sort((a, b) => b.price - a.price);
  const skillsR = Object.keys(skillRef).map(s => comp.getSkill(s));
  const canInheritR = canInheritCode(skillsR.map(s => s.element), inheritElems);
  const skillInheritsR = skillsR.map(s => canInheritCode([s.element], inheritElems));
  let leftIngredR: Demon, rightIngredR: Demon, inheritScore = 0;

  for (let i = 0; i < ingredsR.length; i++) {
    const leftIngred = ingredsR[i];
    for (const rightIngred of ingredsR.slice(i + 1)) {
      if ((canInheritR & (leftIngred.inherits | rightIngred.inherits)) === canInheritR) {
        const leftScore = (canInheritR & leftIngred.inherits).toString(2).split('1').length;
        const rightScore = (canInheritR & rightIngred.inherits).toString(2).split('1').length;
        const totalScore = leftScore * rightScore;

        if (inheritScore < totalScore) {
          leftIngredR = leftIngred;
          rightIngredR = rightIngred;
          inheritScore = totalScore;
        }
      }
    }
  }

  const recipe = { chain1: [], chain2: [], stepR, skills: skillRef, result: demon };
  if (!leftIngredR) { return recipe; }

  const skillIngreds = Object.values(skillRef).filter((d, i, a) => a.indexOf(d) === i);
  const blankIngreds = ingreds.filter(d => !skillIngreds.includes(d));
  let halfPoint = Math.ceil(skillIngreds.length / 2);
  skillIngreds.sort((a, b) => normalChart.getLightDark(comp.getDemon(a).race) - normalChart.getLightDark(comp.getDemon(b).race));

  let leftIngreds = skillIngreds.slice(0, halfPoint);
  let leftInherits = Array<number>(leftIngreds.length).fill(0);
  let rightIngreds = skillIngreds.slice(halfPoint);
  let rightInherits = Array<number>(rightIngreds.length).fill(0);

  if (restrictInherits) {
    const { left: leftSkills, right: rightSkills } = divideInheritSkills(leftIngredR.inherits, rightIngredR.inherits, skillInheritsR, skillsR.map(s => s.name));
    leftIngreds = leftSkills.map(s => skillRef[s]);
    leftInherits = canInheritChain(leftSkills.map(s => comp.getSkill(s).element), inheritElems);
    rightIngreds = rightSkills.map(s => skillRef[s]);
    rightInherits = canInheritChain(rightSkills.map(s => comp.getSkill(s).element), inheritElems);
  }

  halfPoint = Math.ceil(blankIngreds.length / 2);
  leftIngreds = blankIngreds.slice(0, halfPoint).concat(leftIngreds);
  leftInherits = Array(halfPoint).fill(0).concat(leftInherits);
  rightIngreds = blankIngreds.slice(halfPoint).concat(rightIngreds);
  rightInherits = Array(blankIngreds.length - halfPoint).fill(0).concat(rightInherits);

  recipe.chain1 = createFusionFull(leftIngreds, leftInherits, leftIngredR.name, comp, normalChart, recipeConfig);
  recipe.chain2 = createFusionFull(rightIngreds, rightInherits, rightIngredR.name, comp, normalChart, recipeConfig);

  return recipe;
}

function canInheritCode(includeElems: string[], inheritElems: string[]): number {
  return parseInt(inheritElems.map(e => includeElems.includes(e) ? '1' : '0').join(''), 2) || 0;
}

function canInheritChain(includeElems: string[], inheritElems: string[]): number[] {
  return includeElems.map((e, i, a) => canInheritCode(a.slice(0, i + 1), inheritElems));
}

function divideInheritSkills(leftInherit: number, rightInherit: number, skillInherits: number[], skills: string[]): { left: string[], right: string[] } {
  let left: string[] = [], right: string[] = [];
  const leftElems: number[] = [], rightElems: number[] = [];
  const commands: { [elem: number]: string[] } = {};
  const passives: string[] = [];

  for (let i = 0; i < skillInherits.length; i++) {
    const elem = skillInherits[i];
    if (elem === 0) { passives.push(skills[i]); continue; }
    if (!commands.hasOwnProperty(elem)) { commands[elem] = []; }
    commands[elem].push(skills[i]);
  }

  for (const inheritStr of Object.keys(commands).sort()) {
    const canInherit = parseInt(inheritStr);
    if (leftElems.length <= rightElems.length) {
      if ((canInherit & leftInherit) === canInherit) { leftElems.push(canInherit); }
      else { rightElems.push(canInherit); }
    } else {
      if ((canInherit & rightInherit) === canInherit) { rightElems.push(canInherit); }
      else { leftElems.push(canInherit); }
    }
  }

  for (const elem of leftElems) { left = left.concat(commands[elem]); }
  for (const elem of rightElems) { right = right.concat(commands[elem]); }
  for (const skill of passives) {
    if (left.length < right.length) { left.push(skill); }
    else { right.push(skill); }
  }

  return { left: left.reverse(), right: right.reverse() };
}

function createFusionFull(ingreds: string[], inheritChain: number[], result: string, comp: Compendium, chart: FusionChart, recipeConfig: RecipeGeneratorConfig): string[] {
  let ingredR = result;
  let chain = [ingredR];
  const specIngreds = comp.getSpecialNameEntries(ingredR);
  const inheritR = inheritChain[inheritChain.length - 1];

  if (specIngreds.length !== 0) {
    ingredR = specIngreds.find(d => comp.getSpecialNameEntries(d).length === 0);
    chain.unshift(specIngreds.filter(d => d !== ingredR).join(' x '));
    chain.unshift(ingredR);
  }

  if (ingreds.length > 0) {
    const chain1 = createFusionChain(ingreds, inheritChain, comp, chart, recipeConfig);

    if (chain1.length === 0) { return []; }

    const ingred1 = chain1[chain1.length - 1];
    let chain2 = createFusionPath(ingred1, ingredR, inheritR, comp, chart, recipeConfig);

    if (chain2.length === 0) {
      const demonR = comp.getDemon(ingredR);
      const sameRaceR = comp.getResultDemonLvls(demonR.race)
        .map(l => comp.reverseLookupDemon(demonR.race, l))
        .filter(i => i !== ingredR);

      for (const elem of chart.elementDemons.concat(sameRaceR)) {
        if ((inheritR & comp.getDemon(elem).inherits) !== inheritR) { continue; }

        const chain3 = createFusionPath(ingred1, elem, inheritR, comp, chart, recipeConfig);
        const chain4 = createFusionPath(elem, ingredR, inheritR, comp, chart, recipeConfig);

        if (chain3.length !== 0 && chain4.length !== 0) {
          chain2 = chain3.concat(chain4.slice(1));
          break;
        }
      }
    }

    if (chain2.length === 0) { return []; }

    chain = chain1.concat(chain2.slice(1), chain.slice(1));
  }

  return chain;
}

function createFusionPath(ingredA: string, ingredE: string, inheritR: number, comp: Compendium, chart: FusionChart, recipeConfig: RecipeGeneratorConfig): string[] {
  const { fissionCalculator, fusionCalculator } = recipeConfig;
  const chain = [ingredA];

  if (ingredA === ingredE) { return chain; }

  const pairsA = fusionCalculator
    .getFusions(ingredA, comp, chart)
    .map(p => toFusionPairResult(p, comp))
    .sort((a, b) => a.price - b.price);

  for (const pairA of pairsA) {
    if (pairA.name2 === ingredE) {
      chain.push(pairA.name1);
      chain.push(ingredE);
      return chain;
    }
  }

  const pairsE = fissionCalculator
    .getFusions(ingredE, comp, chart)
    .map(p => toFusionPair(p, comp))
    .sort((a, b) => a.price - b.price);

  pairsA.sort((a, b) => b.price - a.price);
  const lookupA = pairsA.reduce((acc, p) => { acc[p.name2] = p.name1; return acc }, {});

  for (const pairE of pairsE) {
    if (lookupA[pairE.name1] && (inheritR & comp.getDemon(pairE.name1).inherits) === inheritR) {
      chain.push(lookupA[pairE.name1]);
      chain.push(pairE.name1);
      chain.push(pairE.name2);
      chain.push(ingredE);
      return chain;
    }

    if (lookupA[pairE.name2] && (inheritR & comp.getDemon(pairE.name2).inherits) === inheritR) {
      chain.push(lookupA[pairE.name2]);
      chain.push(pairE.name2);
      chain.push(pairE.name1);
      chain.push(ingredE);
      return chain;
    }
  }

  return [];
}

function createFusionChain(ingreds: string[], inheritChain: number[], comp: Compendium, chart: FusionChart, recipeConfig: RecipeGeneratorConfig): string[] {
  const { fusionCalculator } = recipeConfig;
  const chain = ingreds.slice(0, 1);

  if (ingreds.length < 2) { return chain; }

  let ingredA = chain[0];
  let inheritA = inheritChain[0];

  for (let i = 1; i < ingreds.length; i++) {
    const ingredD = ingreds[i];
    const inheritD = inheritChain[i];

    const pairsA = fusionCalculator
      .getFusions(ingredA, comp, chart)
      .map(p => toFusionPairResult(p, comp))
      .sort((a, b) => a.price - b.price);
    let foundPair = false;

    for (const pairA of pairsA) {
      if (pairA.name1 === ingredD && (inheritD & comp.getDemon(pairA.name2).inherits) === inheritD) {
        chain.push(ingredD);
        chain.push(pairA.name2);
        ingredA = chain[chain.length - 1];
        inheritA = inheritD;
        foundPair = true;
        break;
      }
    }

    if (foundPair) { continue; }

    const pairsD = fusionCalculator.getFusions(ingredD, comp, chart);
    const lookupD = pairsD.reduce((acc, p) => { acc[p.name1] = p.name2; return acc }, {});

    for (const pairA of pairsA) {
      if (lookupD[pairA.name2] && 
        (inheritA & comp.getDemon(pairA.name2).inherits) === inheritA &&
        (inheritD & comp.getDemon(lookupD[pairA.name2]).inherits) === inheritD
      ) {
        chain.push(pairA.name1);
        chain.push(pairA.name2);
        chain.push(ingredD);
        chain.push(lookupD[pairA.name2]);
        ingredA = chain[chain.length - 1];
        inheritA = inheritD;
        foundPair = true;
        break;
      }
    }

    if (!foundPair) { return []; }
  }

  return chain;
}
