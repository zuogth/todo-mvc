import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';

const fadeStrikeThroughAnimations = trigger('fadeStrikeThrough', [
  state('active', style({
    fontSize: '18px',
    color: 'black',
  })),
  state('completed', style({
    fontSize: '17px',
    color: 'lightgrey',
    textDecoration: 'line-through',
  })),
  transition('active <=> completed', [animate(250)]),
]);
@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  animations: [fadeStrikeThroughAnimations]
})
export class TodoItemComponent implements OnInit {

  isHovered = false;
  isEditing = false;
  textChange!: string;
  @Input() todo!: Todo;
  @Output() changeStatus: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() changeContent: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() removeTodo: EventEmitter<Todo> = new EventEmitter<Todo>();
  constructor() { }

  ngOnInit() {
  }
  changeTodoStatus() {
    this.changeStatus.emit({ ...this.todo, isCompleted: !this.todo.isCompleted });
  }
  onChangeContent(event: KeyboardEvent) {
    const { keyCode } = event;
    event.preventDefault();//pravent form to submit default
    if (keyCode === 13) {
      this.changeContent.emit({ ...this.todo });
      this.isEditing = false;
    }
  }
  onRemoveTodo() {
    this.removeTodo.emit({ ...this.todo })
  }
}
