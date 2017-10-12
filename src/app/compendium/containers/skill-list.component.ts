import {
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Skill, Compendium, FusionDataService } from '../models';

export abstract class SkillListContainerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  protected skills: Observable<Skill[]>;
  protected appName = 'List of Skills - Test App';
  protected initListLen = 50;
  protected defaultSortFun = (a: Skill, b: Skill) => a.name.localeCompare(b.name);

  constructor(
    private title: Title,
    private changeDetectorRef: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) { }

  ngOnInit() {
    this.title.setTitle(this.appName);

    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(
        this.onCompendiumUpdated.bind(this)));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onCompendiumUpdated(compendium: Compendium) {
    this.changeDetectorRef.markForCheck();
    this.skills = Observable.create(observer => {
      const skills = compendium.allSkills;
      skills.sort(this.defaultSortFun);
      observer.next(skills.slice(0, this.initListLen));
      setTimeout(() => observer.next(skills));
    });
  }
}
