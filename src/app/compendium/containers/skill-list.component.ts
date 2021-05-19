import { ChangeDetectorRef, OnInit, OnDestroy, Directive } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

import { Skill, Compendium, FusionDataService } from '../models';

@Directive()
export abstract class SkillListContainerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  skills: Observable<Skill[]>;
  initListLen = 50;
  appName = 'List of Skills - Test App';
  defaultSortFun = (a: Skill, b: Skill) => a.name.localeCompare(b.name);

  constructor(
    private title2: Title,
    private changeDetectorRef2: ChangeDetectorRef,
    private fusionDataService2: FusionDataService
  ) { }

  ngOnInit() {
    this.title2.setTitle(this.appName);

    this.subscriptions.push(
      this.fusionDataService2.compendium.subscribe(
        this.onCompendiumUpdated.bind(this)));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onCompendiumUpdated(compendium: Compendium) {
    this.changeDetectorRef2.markForCheck();
    this.skills = Observable.create(observer => {
      const skills = compendium.allSkills;
      skills.sort(this.defaultSortFun);
      observer.next(skills.slice(0, this.initListLen));
      setTimeout(() => observer.next(skills));
    });
  }
}
