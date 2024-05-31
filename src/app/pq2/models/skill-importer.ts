export function skillRowToEffect(nums: number[], descs: string[]): string {
  const [rank, cost, power, minHits, maxHits, acc, crit, mod] = nums;
  const [effect, cond, card] = descs;
  const baseMod = parseInt(mod.toString());
  const powerStr = power === 0 ? '' : `${power} pwr`;
  const hitStr = minHits !== maxHits ? `${minHits}-${maxHits} hits` : maxHits < 2 ? '' : `${maxHits} hits`;
  const critStr = crit === 0 ? '' : `${crit}% crit`;
  const accStr = acc === 0 || 90 <= acc && acc <= 110 ? '' : `${Math.min(acc, 200)}% acc`;
  const modStr = `${baseMod < 1000 ? mod : (baseMod - 1000) / 100}`
  const effectStr = cond === '-' ? '' : cond.replace('$1', modStr).replace('$2', effect);
  const fullStr = [powerStr, hitStr, accStr, critStr, effectStr].filter(s => s !== '').join(', ');
  return fullStr.substring(0, 1) === 'x' ? fullStr : fullStr.substring(0, 1).toUpperCase() + fullStr.substring(1);
}

const COST_HP = 1 << 10;
const COST_MP = (3 << 10) - 1000;
const COST_CC = (15 << 10) - 2000;

export function importSkillRow(row: { a: string[]; b: number[]; c: string[]; }): any {
  const { a: [sname, elem, target], b: nums, c: descs } = row;
  const [rank, cost] = nums.slice(0, 2);
  const card = descs[2];

  const entry = {
    elem,
    target: target === '-' ? 'Self' : target,
    cost: cost ? cost + (cost > 1000 ? (cost > 2000 ? COST_CC : COST_MP) : COST_HP) : 0,
    effect: skillRowToEffect(nums, descs),
  }

  if (card !== '-') { entry['card'] = card; }
  if (89 < rank) { entry['unique'] = true; }

  return entry;
}