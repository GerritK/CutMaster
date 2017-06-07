import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdIconModule, MdInputModule, MdListModule,
  MdToolbarModule, MdTooltipModule
} from '@angular/material';
import {BarCuttingComponent} from './components/bar-cutting/bar-cutting.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {BarComponent} from './components/bar/bar.component';

@NgModule({
  declarations: [
    AppComponent,
    BarCuttingComponent,
    BarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MdToolbarModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdCheckboxModule,
    MdIconModule,
    MdTooltipModule,
    MdListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
