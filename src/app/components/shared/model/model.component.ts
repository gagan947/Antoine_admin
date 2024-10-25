import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent {
  @Input() title: string = 'Modal Title';
  @Input() confirmLabel: string = '';
  @Output() confirmed = new EventEmitter<void>();

  isVisible: boolean = false;

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  confirm() {
    this.confirmed.emit();
    this.close();
  }
}
