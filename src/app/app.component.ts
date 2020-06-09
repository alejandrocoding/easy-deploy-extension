import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormArray, FormGroup, FormBuilder } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Environment } from '@interfaces';
import { getSettingsStorage, setSettingsStorage } from '@helpers';
import { DEFAULT_ENVIRONMENT } from '@constants';

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

  get environments() {
    return this.form.controls.environments as FormArray;
  }

  get token() {
    return this.form.controls.token as FormControl;
  }

  private addEnvironmentToForm(env: Environment, emitEvent = true) {
    const control = this.fb.group({
      id: env.id,
      name: env.name,
      description: env.description,
      event: env.event,
      repoOwner: env.repoOwner,
      repoName: env.repoName,
    });
    this.environments.push(control);
    this.selected.setValue(this.environments.controls.length - 1, { emitEvent });
  }

  addEnv() {
    this.addEnvironmentToForm(DEFAULT_ENVIRONMENT);
  }

  removeEnv(index: number) {
    this.environments.removeAt(index);
  }

  private async recover() {
    const settings = await getSettingsStorage();
    if (!settings) {
      this.addEnvironmentToForm(DEFAULT_ENVIRONMENT, false);
      return;
    }
    settings.environments.forEach(environment => this.addEnvironmentToForm(environment, false));
    this.form.setValue(settings, { emitEvent: false });
  }

  private save() {
    setSettingsStorage(this.form.value);
  }
}
