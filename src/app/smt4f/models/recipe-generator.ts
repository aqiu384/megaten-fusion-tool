import { Compendium } from './compendium';
import { FusionChart } from './fusion-chart';
import { FusionRecipe } from '../models';
import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../../compendium/constants';
import { toFusionPair, toFusionPairResult } from '../../compendium/models/conversions';

export function createSkillsRecipe(demon: string, skills: string[], comp: Compendium, chart: FusionChart): FusionRecipe {
  const demonR = comp.getDemon(demon);
  const skillsR = comp.getSkills(skills).filter(s =>
    s.rank < 50 &&
    s.learnedBy.length > 0 &&
    !demonR.skills.hasOwnProperty(s.name)
  );

  const skillRef: { [skill: string]: string } = {};
  const ingreds: string[] = [];

  for (const skill of skillsR) {
    const demons = skill.learnedBy.map(d => comp.getDemon(d.demon));
    skillRef[skill.name] = demons.length > 1 ?
      demons.find(d => Object.keys(chart.getRaceFusions(d.race)).length > 0 && d.fusion !== 'excluded').name :
      demons[0].name;
  }

  for (const dname of Object.values(skillRef)) {
    if (!ingreds.includes(dname)) {
      ingreds.push(dname);
    }
  }

  ingreds.sort((a, b) => chart.getLightDark(comp.getDemon(a).race) - chart.getLightDark(comp.getDemon(b).race));

  const pairR = SMT_NORMAL_FISSION_CALCULATOR
    .getFusions(demon, comp, chart)
    .map(p => toFusionPair(p, comp))
    .sort((a, b) => a.price - b.price)
    .find(p =>
      SMT_NORMAL_FISSION_CALCULATOR.getFusions(p.name1, comp, chart).length > 0 &&
      SMT_NORMAL_FISSION_CALCULATOR.getFusions(p.name2, comp, chart).length > 0
    )

  const stepR = pairR ? [pairR.name1, pairR.name2] : comp.getSpecialNameEntries(demon);
  const halfPoint = Math.ceil(ingreds.length / 2);
  let chain1 = [];
  let chain2 = [];

  if (stepR.length > 1) {
    chain1 = createFusionFull(ingreds.slice(0, halfPoint), stepR[stepR.length - 2], comp, chart);
    chain2 = createFusionFull(ingreds.slice(halfPoint), stepR[stepR.length - 1], comp, chart);
  }

  return { chain1, chain2, stepR, skills: skillRef, result: demon };
}

function createFusionFull(ingreds: string[], result: string, comp: Compendium, chart: FusionChart): string[] {
  let ingredR = result;
  let chain = [ingredR];
  const specIngreds = comp.getSpecialNameEntries(ingredR);

  if (specIngreds.length !== 0) {
    ingredR = specIngreds.find(d => comp.getSpecialNameEntries(d).length === 0);
    chain.unshift(specIngreds.filter(d => d !== ingredR).join(' x '));
    chain.unshift(ingredR);
  }

  if (ingreds.length > 0) {
    const chain1 = createFusionChain(ingreds, comp, chart);
    const ingred1 = chain1[chain1.length - 1];
    let chain2 = createFusionPath(ingred1, ingredR, comp, chart);

    if (chain2.length === 0) {
      for (const elem of chart.elementDemons) {
        const chain3 = createFusionPath(ingred1, elem, comp, chart);
        const chain4 = createFusionPath(elem, ingredR, comp, chart);

        if (chain3.length !== 0 && chain4.length !== 0) {
          chain2 = chain3.concat(chain4.slice(1));
          break;
        }
      }
    }

    chain = chain1.concat(chain2.slice(1), chain.slice(1));
  }

  return chain;
}

function createFusionPath(ingredA: string, ingredE: string, comp: Compendium, chart: FusionChart): string[] {
  const chain = [ingredA];

  if (ingredA === ingredE) { return chain; }

  const pairsA = SMT_NORMAL_FUSION_CALCULATOR
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

  const pairsE = SMT_NORMAL_FISSION_CALCULATOR
    .getFusions(ingredE, comp, chart)
    .map(p => toFusionPairResult(p, comp))
    .sort((a, b) => a.price - b.price);

  pairsA.sort((a, b) => b.price - a.price);
  const lookupA = pairsA.reduce((acc, p) => { acc[p.name2] = p.name1; return acc }, {});

  for (const pairE of pairsE) {
    if (lookupA[pairE.name1]) {
      chain.push(lookupA[pairE.name1]);
      chain.push(pairE.name1);
      chain.push(pairE.name2);
      chain.push(ingredE);
      return chain;
    }

    if (lookupA[pairE.name2]) {
      chain.push(lookupA[pairE.name2]);
      chain.push(pairE.name2);
      chain.push(pairE.name1);
      chain.push(ingredE);
      return chain;
    }
  }

  return [];
}

function createFusionChain(ingreds: string[], comp: Compendium, chart: FusionChart): string[] {
  const chain = ingreds.slice(0, 1);

  if (ingreds.length < 2) { return chain; }

  let ingredA = chain[0];

  for (const ingredD of ingreds.slice(1)) {
    const pairsA = SMT_NORMAL_FUSION_CALCULATOR
      .getFusions(ingredA, comp, chart)
      .map(p => toFusionPairResult(p, comp))
      .sort((a, b) => a.price - b.price);
    let foundPair = false;

    for (const pairA of pairsA) {
      if (pairA.name1 === ingredD) {
        chain.push(ingredD);
        chain.push(pairA.name2);
        ingredA = pairA.name2;
        foundPair = true;
        break;
      }
    }

    if (foundPair) { continue; }

    const pairsD = SMT_NORMAL_FUSION_CALCULATOR.getFusions(ingredD, comp, chart);
    const lookupD = pairsD.reduce((acc, p) => { acc[p.name1] = p.name2; return acc }, {});

    for (const pairA of pairsA) {
      if (lookupD[pairA.name2]) {
        chain.push(pairA.name1);
        chain.push(pairA.name2);
        chain.push(ingredD);
        chain.push(lookupD[pairA.name2]);
        foundPair = true;
        break;
      }
    }

    if (!foundPair) { return []; }
  }

  return chain;
}