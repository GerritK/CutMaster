import {Component} from '@angular/core';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'cm-bar-cutting',
  templateUrl: './bar-cutting.component.html',
  styleUrls: ['./bar-cutting.component.css']
})
export class BarCuttingComponent {
  extrusionLength = 3000;
  sawBlade = 3.2;
  smallestRemnant = 0;

  remnants = [
    {length: 1520, quantity: 1, enabled: true}
  ];

  parts = [
    {name: '', length: 0, quantity: 0, enabled: true}
  ];

  result = [];

  addPart() {
    this.parts.push({
      name: '',
      length: 0,
      quantity: 0,
      enabled: true
    });
  }

  removePart(part) {
    const index = this.parts.indexOf(part);
    this.parts.splice(index, 1);
  }

  getPart(index) {
    return this.parts[index];
  }

  addRemnant() {
    this.remnants.push({
      length: 0,
      quantity: 0,
      enabled: true
    });
  }

  removeRemnant(remnant) {
    const index = this.remnants.indexOf(remnant);
    this.remnants.splice(index, 1);
  }

  calculate() {
    const result = [];
    let remnantId = 0;
    let barLength = this.extrusionLength;
    let currentBar = [];
    const calculatedParts = [];
    for (const part of this.parts) {
      const index = this.parts.indexOf(part);
      calculatedParts[index] = 0;
    }

    let partsToCut = this.getPartsToCut(calculatedParts);
    let minPartLength = this.getMinPartLength(partsToCut);
    while (partsToCut.length > 0) {
      if (remnantId < this.remnants.length) {
        barLength = this.remnants[remnantId].length;
      } else {
        barLength = this.extrusionLength;
      }
      let remaining = this.getRemainingLength(currentBar, barLength);

      while (remaining >= minPartLength + this.smallestRemnant && partsToCut.length > 0) {
        const part = this.getPartWithBestRatio(partsToCut, remaining);
        const index = this.parts.indexOf(part);

        const partInBar = currentBar.find((part) => part.index === index);
        if (partInBar == null) {
          currentBar.push({index: index, length: part.length, quantity: 1});
        } else {
          partInBar.quantity++;
        }
        calculatedParts[index]++;

        remaining = this.getRemainingLength(currentBar, barLength);
        partsToCut = this.getPartsToCut(calculatedParts);
        minPartLength = this.getMinPartLength(partsToCut);
      }

      currentBar.sort((p0, p1) => p1.quantity - p0.quantity);
      const barData = currentBar.map((part) => {
        return {
          index: part.index,
          title: this.getPart(part.index).name,
          length: part.length,
          quantity: part.quantity
        };
      });
      result.push({
        isRemnant: barLength !== this.extrusionLength,
        length: barLength,
        remnant: remaining,
        parts: barData
      });
      currentBar = [];
      remnantId++;
    }
    this.result = result;
  }

  download() {
    const data = new Blob([JSON.stringify(this.parts)], {type: 'application/json;charset=utf-8'});
    FileSaver.saveAs(data, 'cutmaster-parts.json');
  }

  onFileChange(e) {
    const file = e.srcElement.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(reader.result);
        this.parts = data;
      } catch (e) {

      }
    };

    reader.readAsText(file);
  }

  private getRemainingLength(bar, totalLength) {
    let length = 0;

    for (const part of bar) {
      length += (part.length + this.sawBlade) * part.quantity;
    }

    return totalLength - length;
  }

  private getMinPartLength(parts) {
    let result = 0;

    for (const part of parts) {
      if (result === 0 || part.length < result) {
        result = part.length;
      }
    }

    return result;
  }

  private getPartWithBestRatio(parts, length) {
    let result = null;
    let ratio = 0;
    let lowestRatio = 2;

    for (const part of parts) {
      if (this.needToCut(part) && length > part.length) {
        ratio = length / (part.length + this.sawBlade) % 1;
        if (ratio < lowestRatio) {
          lowestRatio = ratio;
          result = part;
        }
      }
    }

    return result;
  }

  private getPartsToCut(calculatedParts) {
    return this.parts.filter((part) => {
      const index = this.parts.indexOf(part);
      return this.needToCut(part) && (calculatedParts[index] == null || calculatedParts[index] < part.quantity);
    });
  }

  private needToCut(part) {
    return part.enabled && part.quantity > 0 && part.length > 0;
  }
}
