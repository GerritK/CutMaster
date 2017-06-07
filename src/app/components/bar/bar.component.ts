import {Component, Input} from '@angular/core';

@Component({
  selector: 'cm-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent {
  @Input('index') index: number;
  @Input('length') length: number;
  @Input('data') data;

  getPartArray(part) {
    return new Array(part.quantity).fill(0).map((x, i) => i);
  }

  getPartTitle(part) {
    if(part.title != null && part.title.length > 0) {
      return part.title;
    }
    return 'Part #' + part.index;
  }

  getWaste() {
    let sum = 0;

    for(const part of this.data.parts) {
      sum += part.length * part.quantity;
    }
    sum += this.data.remnant;

    return this.length - sum;
  }
}
