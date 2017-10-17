import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'skillCostToString' })
export class SkillCostToStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) { return 'Auto'; }
    if (value < -5) { return `${-1 * value} HP`; }
    if (value < 0) { return `${-1 * value} CC`; }
    if (value < 100) { return `${value}% HP`; }
    return `${value / 100} SP`;
  }
}

@Pipe({ name: 'skillLevelToString' })
export class SkillLevelToStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 0) { return `${-1 * value}-Star Auction`; }
    if (value === 0) { return 'Innate'; }
    return value.toString();
  }
}

@Pipe({ name: 'skillLevelToShortString' })
export class SkillLevelToShortStringPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 0)   { return `(A${-1 * value})`; }
    if (value === 0) { return ''; }
    return `(${value})`;
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
