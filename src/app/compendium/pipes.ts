import { Pipe, PipeTransform } from '@angular/core';

const SKILL_COST_TYPES = [
  'Auto', ' HP',  '% HP', ' MP',  '% MP', ' SP',  '% SP', ' Ex',  '% Ex', ' MG',  '% MG', '0x0B', '0x0C', '0x0D', '0x0E', ' CC',
  'Extra', 'Varies', 'Fusion', 'Magatsuhi', 'Sabbath'
];

@Pipe({ name: 'skillCostToString' })
export class SkillCostToStringPipe implements PipeTransform {
  transform(value: number): string {
    const costType = SKILL_COST_TYPES[value >> 10];
    const cost = (value & 0x3FF);
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

const AFFINITY_LVLS = [
  '-', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1',
  '0', '+1', '+2', '+3', '+4', '+5', '+6', '+7', '+8', '+9', 'O'
]

@Pipe({ name: 'affinityToString' })
export class ElementAffinityToStringPipe implements PipeTransform {
  transform(value: number): string {
    return AFFINITY_LVLS[value + 10];
  }
}

@Pipe({ name: 'lvlToNumber' })
export class LvlToNumberPipe implements PipeTransform {
  transform(value: number): number {
    return Math.floor(value);
  }
}

const RESIST_LVLS = ['??', 'ab', 'rp', 'nu', 'rs', 'no', 'wk', 'fr']

@Pipe({ name: 'reslvlToString' })
export class ReslvlToStringPipe implements PipeTransform {
  transform(value: number): string {
    return RESIST_LVLS[value >> 12];
  }
}

@Pipe({ name: 'resmodToString' })
export class ResmodToStringPipe implements PipeTransform {
  transform(value: number): string {
    return ((value >> 4) & 0xFF) * 5 + '%';
  }
}

const JA_RESIST_LVLS = ['??', '吸', '反', '無', '耐', 'ー', '弱']

@Pipe({ name: 'reslvlToStringJa' })
export class ReslvlToStringJaPipe implements PipeTransform {
  transform(value: number): string {
    return JA_RESIST_LVLS[value >> 12];
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
