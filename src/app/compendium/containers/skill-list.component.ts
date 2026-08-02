import { Directive, computed, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FUSION_DATA_SERVICE, makeDefaultSkillSort } from '../constants';
import { Skill } from '../models';

@Directive()
export abstract class SkillListContainerComponent {
  title = inject(Title);
  fusionDataService = inject(FUSION_DATA_SERVICE);
  abstract elemOrder: { [elem: string]: number };
  abstract appName: string;
  initListLen = 50;

  skills$ = signal<Skill[]>([]);
  allSkills$ = computed(() => {
    const skills = this.fusionDataService.compendium$().allSkills;
    skills.sort(makeDefaultSkillSort(this.elemOrder));
    return skills;
  });

  constructor() {
    effect(() => {
      this.title.setTitle(this.appName);
      this.skills$.set(this.allSkills$().slice(0, this.initListLen));
      setTimeout(() => this.skills$.set(this.allSkills$()));
    });
  }
}
