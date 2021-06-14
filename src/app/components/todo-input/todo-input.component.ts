import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.scss']
})
export class TodoInputComponent implements OnInit {

  textContent='';
  constructor(private todoService:TodoService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.textContent.trim()===''){
      return ;
    }
    this.todoService.addTodo(this.textContent);
    this.textContent='';
  }

}
