import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Settings, Environment } from './interfaces';
import { DEFAULT_ENVIROMENT } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  form: FormGroup;
  private destroy$ = new Subject();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.recover();
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.save());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.form = this.fb.group({
      selected: [0],
      environments: this.fb.array([]),
      token: ''
    });
  }

  get selected() {
    return this.form.controls.selected as FormControl;
  }

  get envs() {
    return this.form.controls.environments as FormArray;
  }

  get token() {
    return this.form.controls.token as FormControl;
  }

  private addEnviromentToForm(env: Environment, emitEvent = true) {
    const control = this.fb.group({
      id: env.id,
      name: env.name,
      description: env.description,
      repo: env.repo,
      event: env.event
    });
    this.envs.push(control);
    this.selected.setValue(this.envs.controls.length - 1, { emitEvent });
  }

  addEnv() {
    this.addEnviromentToForm(DEFAULT_ENVIROMENT);
  }

  removeEnv(index: number) {
    this.envs.removeAt(index);
  }

  private recover() {
    chrome.storage.sync.get(['settings'], (data: { settings: Settings }) => {
      if (data?.settings?.environments?.length) {
        for (const env of data.settings.environments) {
          this.addEnviromentToForm(env, false);
        }
        this.form.setValue(data.settings, { emitEvent: false });
      } else {
        this.addEnviromentToForm(DEFAULT_ENVIROMENT, false);
      }
    });
  }

  private save() {
    chrome.storage.sync.set({ settings: this.form.value });
  }
}
