import { Demon } from '../models';
import { Compendium } from './compendium';
import { FusionChart } from './fusion-chart';
import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../../compendium/constants';
import { toFusionPair, toFusionPairResult } from '../../compendium/models/conversions';

export function splitBySkills(demon: string, skills: string[], comp: Compendium, chart: FusionChart) {
  const demonR = comp.getDemon(demon);
  const skillsR = comp.getSkills(skills).filter(s =>
    s.rank < 50 &&
    s.learnedBy.length > 0 &&
    !demonR.skills.hasOwnProperty(s.name)
  );

  const ingreds: Demon[] = [];
  const skillRef: { [demon: string]: string } = {};

  for (const ingred of skillsR.map(s => s.learnedBy
    .map(s => comp.getDemon(s.demon))
    .find(d =>
      Object.keys(chart.getRaceFusions(d.race)).length > 0 &&
      (d.fusion === 'normal') || (d.fusion === 'special')
  ))) {
    if (!ingreds.includes(ingred)) {
      ingreds.push(ingred);
    }
  }

  ingreds.sort((a, b) => chart.getLightDark(a.race) - chart.getLightDark(b.race));

  const fullChain = createFullChain(demon, ingreds.map(d => d.name), comp, chart);
}

function createFullChain(demon: string, ingreds: string[], comp: Compendium, chart: FusionChart) {
  const ingredsB: string[] = [];
  const pairsB = SMT_NORMAL_FISSION_CALCULATOR
    .getFusions(demon, comp, chart)
    .map(p => toFusionPair(p, comp))
    .filter(p =>
      comp.getSpecialNameEntries(p.name1).length === 0 &&
      comp.getSpecialNameEntries(p.name2).length === 0
    )
  pairsB.sort((a, b) => a.price - b.price);

  const finalStep = pairsB.length > 0 ?
    [pairsB[0].name1, pairsB[0].name2] :
    comp.getSpecialNameEntries(demon);

  let resultL = finalStep[0];
  let resultR = finalStep[1];
  let chainL = [resultL];
  let chainR = [resultR];
  const finalL = comp.getSpecialNameEntries(resultL);
  const finalR = comp.getSpecialNameEntries(resultR);

  if (finalL.length !== 0) {
    resultL = finalL.find(d => comp.getSpecialNameEntries(d).length === 0);
    chainL.unshift(finalL.filter(d => d !== resultL).join(' x '));
    chainL.unshift(resultL);
  } if (finalR.length !== 0) {
    resultR = finalR.find(d => comp.getSpecialNameEntries(d).length === 0);
    chainR.unshift(finalR.filter(d => d !== resultR).join(' x '));
    chainR.unshift(resultR);
  }

  if (ingreds.length > 0) {
    const chainL1 = createFusionChain(ingreds.slice(0, Math.ceil(ingreds.length / 2)), comp, chart);
    const chainL2 = createFusionPath(chainL1[chainL1.length - 1], resultL, comp, chart).slice(1);
    chainL = chainL1.concat(chainL2, chainL.slice(1));
  }

  if (ingreds.length > 1) {
    const chainR1 = createFusionChain(ingreds.slice(Math.ceil(ingreds.length / 2)), comp, chart);
    const chainR2 = createFusionPath(chainR1[chainR1.length - 1], resultR, comp, chart).slice(1);
    chainR = chainR1.concat(chainR2, chainR.slice(1));
  }

  console.log(chainL, chainR)
  console.log(finalStep)
}

function createFusionPath(start: string, end: string, comp: Compendium, chart: FusionChart): string[] {
  const path = [start];
  let ingredA = start;

  if (ingredA === end) { return path; }

  const pairs1 = SMT_NORMAL_FUSION_CALCULATOR
    .getFusions(ingredA, comp, chart)
    .map(p => toFusionPairResult(p, comp));
  pairs1.sort((a, b) => a.price - b.price);
  const pairE1 = pairs1.find(p => comp.isElementDemon(p.name2));

  if (pairE1) {
    path.push(pairE1.name1);
    path.push(pairE1.name2);
    ingredA = pairE1.name2;
  } else {
    for (const pair1 of pairs1) {
      const pairs2 = SMT_NORMAL_FUSION_CALCULATOR
        .getFusions(pair1.name2, comp, chart)
        .map(p => toFusionPairResult(p, comp));
      pairs2.sort((a, b) => a.price - b.price);
      const pairE2 = pairs2.find(p => comp.isElementDemon(p.name2));

      if (pairE2) {
        path.push(pair1.name1);
        path.push(pair1.name2);
        path.push(pairE2.name1);
        path.push(pairE2.name2);
        ingredA = pairE2.name2;
        break;
      }
    }
  }

  if (ingredA === end) { return path; }

  const pairsR = SMT_NORMAL_FISSION_CALCULATOR
    .getFusions(end, comp, chart)
    .map(p => toFusionPair(p, comp));
  pairsR.sort((a, b) => a.price - b.price);
  const pairER = pairsR.find(p => p.name2 === ingredA);

  if (pairER) {
    path.push(pairER.name1);
    path.push(end);
    ingredA = end;
  } else {
    for (const pairR of pairsR) {
      const pairsQ = SMT_NORMAL_FISSION_CALCULATOR
        .getFusions(pairR.name1, comp, chart)
        .map(p => toFusionPair(p, comp));
      pairsQ.sort((a, b) => a.price - b.price);
      const pairQ = pairsQ.find(p => p.name2 === ingredA);

      if (pairQ) {
        path.push(pairQ.name1);
        path.push(pairR.name1);
        path.push(pairR.name2);
        path.push(end);
        ingredA = end
        break;
      }
    }
  }

  return path;
}

function createFusionChain(ingreds: string[], comp: Compendium, chart: FusionChart): string[] {
  if (ingreds.length < 2) { return ingreds; }

  const chain = ingreds.slice(0, 1);
  let ingredA = ingreds[0];

  for (const ingredD of ingreds.slice(1)) {
    const pairsA = SMT_NORMAL_FUSION_CALCULATOR
      .getFusions(ingredA, comp, chart)
      .map(p => toFusionPairResult(p, comp));
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

    pairsA.sort((a, b) => a.price - b.price);

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