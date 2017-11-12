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

@Pipe({ name: 'skillLevelToString' })
export class SkillLevelToStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) { return 'Innate'; }
    if (value < 100) { return value.toString(); }
    if (value === 100) { return 'Max Loyalty'; }
    return `${value - 100}-star Auction`;
  }
}

@Pipe({ name: 'skillLevelToShortString' })
export class SkillLevelToShortStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) { return ''; }
    if (value < 100) { return `(${value.toString()})`; }
    if (value === 100) { return '(ML)'; }
    return `(A${value - 100})`;
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
