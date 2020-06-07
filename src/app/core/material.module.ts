import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    imports: [
        MatToolbarModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatTabsModule,
    ],
    exports: [
        MatToolbarModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatTabsModule,
    ],
})
export class MaterialModule { }
