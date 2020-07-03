import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-option-value-image',
  templateUrl: './option-value-image.component.html',
  styleUrls: ['./option-value-image.component.scss']
})
export class OptionValueImageComponent implements OnInit, OnChanges {
  @Input() imageUrl;
  @Output() imageChanged = new EventEmitter<any>();
  image: any = {};

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.imageUrl.previousValue && changes.imageUrl.currentValue) {
      this.image.url = this.imageUrl;
    }
  }

  onSelectFile(event) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileReader = e.target as FileReader;
      this.image = {
        name: event.target.files[0].name,
        url: fileReader.result as string,
        file: event.target.files[0]
      };
      this.imageChanged.emit({ type: 'add', data: event.target.files[0] });
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  removeImage() {
    this.image = {};
    this.imageChanged.emit({ type: 'remove' });
  }

}
