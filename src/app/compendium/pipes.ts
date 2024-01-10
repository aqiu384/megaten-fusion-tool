import { Pipe, PipeTransform } from '@angular/core';

const SKILL_COST_TYPES = [
  'Auto', ' HP',  '% HP', ' MP',  '% MP', ' SP',  '% SP', ' Ex',  '% Ex', ' MG',  '% MG', '0x0B', '0x0C', '0x0D', '0x0E', '0x0F',
  'Extra', 'Varies', 'Fusion', 'Magatsuhi', 'Sabbath'
];

@Pipe({ name: 'skillCostToString' })
export class SkillCostToStringPipe implements PipeTransform {
  transform(value: number): string {
    const costType = SKILL_COST_TYPES[value >> 24];
    const cost = (value & 0xFFFFFF);
    return cost === 0 ? costType : (cost.toString() + costType);
  }
}

@Pipe({ name: 'skillLevelToString' })
export class SkillLevelToStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 2) { return 'Innate'; }
    if (value < 120) { return value.toString(); }
    return String.fromCharCode(Math.floor(value / 100) + 32) + String.fromCharCode(value % 100 + 32);
  }
}

@Pipe({ name: 'skillLevelToShortString' })
export class SkillLevelToShortStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 2) { return ''; }
    if (value < 120) { return `(${value.toString()})`; }
    return '(' + String.fromCharCode(Math.floor(value / 100) + 32) + String.fromCharCode(value % 100 + 32) + ')';
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

@Pipe({ name: 'reslvlToStringJa' })
export class ReslvlToStringJaPipe implements PipeTransform {
  transform(value: number): string {
    if (value < -1000) { return '吸'; }
    if (value < 0) { return '反'; }
    if (value === 0) { return '無'; }
    if (value < 100) { return '耐'; }
    if (value < 1000) { return 'ー'; }
    if (value < 2000) { return '弱'; }
    return '?';
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
