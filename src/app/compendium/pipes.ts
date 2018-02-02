import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'skillCostToString' })
export class SkillCostToStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) { return 'Auto'; }
    if (value <= 100) { return `${value}% HP`; }
    if (value <= 1000) { return `${value - 100} HP`; }
    if (value <= 2000) { return `${value - 1000} MP`; }
    if (value <= 2005) { return `${value - 2000} CC`; }
    return `${value - 2000} MG`;
  }
}

const SKILL_LVLS = {
  106: 'Bargain Auction',
  107: 'Rare Auction',
  110: 'Base Arch',
  111: 'Attack Arch',
  112: 'Support Arch',
  113: 'Passive Arch',
  114: 'Resist Arch',
  115: 'Attack Gacha',
  116: 'Support Gacha',
  117: 'Passive Gacha',
  118: 'Resist Gacha'
};

@Pipe({ name: 'skillLevelToString' })
export class SkillLevelToStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= 0) { return 'Innate'; }
    if (value < 100) { return value.toString(); }
    if (value === 100) { return 'Max Loyalty'; }
    if (value < 106) { return `${value - 100}-star Auction`; }
    return SKILL_LVLS[value];
  }
}

const SKILL_LVL_ABBRS = {
  106: '(Ab)',
  107: '(Ar)',
  110: '(Ab)',
  111: '(Aa)',
  112: '(As)',
  113: '(Ap)',
  114: '(Ar)',
  115: '(Ga)',
  116: '(Gs)',
  117: '(Gp)',
  118: '(Gr)'
};

@Pipe({ name: 'skillLevelToShortString' })
export class SkillLevelToShortStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= 0) { return ''; }
    if (value < 100) { return `(${value.toString()})`; }
    if (value === 100) { return '(Lx)'; }
    if (value < 106) { return `(A${value - 100})`; }
    return SKILL_LVL_ABBRS[value];
  }
}

@Pipe({ name: 'affinityToString' })
export class ElementAffinityToStringPipe implements PipeTransform {
  transform(value: number): string {
    return value > 0 ? `+${value}` : value.toString();
  }
}

@Pipe({ name: 'lvlToNumber' })
export class LvlToNumberPipe implements PipeTransform {
  transform(value: number): number {
    return Math.floor(value);
  }
}

@Pipe({ name: 'reslvlToString' })
export class ReslvlToStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value < -1000) { return 'ab'; }
    if (value < 0) { return 'rp'; }
    if (value === 0) { return 'nu'; }
    if (value < 100) { return 'rs'; }
    if (value < 1000) { return 'no'; }
    if (value < 2000) { return 'wk'; }
    return 'fr';
  }
}

@Pipe({ name: 'roundInheritPercent' })
export class RoundInheritPercentPipe implements PipeTransform {
  transform(value: number): number {
    if (value === 0) { return 0; }
    if (value < 100) { return 50; }
    if (value === 100) { return 100; }
    if (value < 800) { return 500; }
    return 1000;
  }
}
