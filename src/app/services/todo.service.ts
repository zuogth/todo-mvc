import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter } from '../models/filtering.model';
import { Todo } from '../models/todo.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private static readonly TodoStorageKey = 'todos';

  private todos!: Todo[];
  private filteredTodos!: Todo[];
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private displayTodosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  private currentFilter: Filter = Filter.All;

  todos$: Observable<Todo[]> = this.displayTodosSubject.asObservable();
  length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService: LocalStorageService) { }

  fetchFromLocalStorage() {
    this.todos = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    this.filteredTodos = [...this.todos]; // copy lại todos
    this.updateTodosData();
  }

  toggleTodoAll(){
    this.todos=this.todos.map(todo=>{
      return{
        ...todo,
        isCompleted:!this.todos.every(t=>t.isCompleted)
      }
    });
    this.updateToLocalStorage();
  };

  filterTodoCompleted(){
    this.todos=this.todos.filter(todo=>!todo.isCompleted);
    this.updateToLocalStorage();
  }
  updateToLocalStorage() {
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);
    this.filterTodos(this.currentFilter, false);
    this.updateTodosData();
  }
  filterTodos(filter: Filter, isFiltering: boolean=true) {
    this.currentFilter = filter;
    switch (filter) {
      case Filter.Active:
        this.filteredTodos = this.todos.filter(todo => !todo.isCompleted);
        break;
      case Filter.Completed:
        this.filteredTodos = this.todos.filter(todo => todo.isCompleted);
        break;
      case Filter.All:
        this.filteredTodos = [...this.todos];
        break;
    }
    if(isFiltering){
      this.updateTodosData();
    }
  }
  addTodo(textContent:string){
    const date=new Date(Date.now()).getTime();
    const newTodo=new Todo(date,textContent);
    this.todos.unshift(newTodo);
    this.updateToLocalStorage();
  }

  changeStatus(id:number,isCompleted:boolean){
    const index=this.todos.findIndex(t=>t.id===id);
    const todo=this.todos[index];
    todo.isCompleted=isCompleted;
    this.todos.splice(index,1,todo);
    this.updateToLocalStorage();
  }
  changeContent(id:number,content:string){
    const index=this.todos.findIndex(t=>t.id===id);
    const todo=this.todos[index];
    todo.content=content;
    this.todos.splice(index,1,todo);
    this.updateToLocalStorage();
  }
  onRemoveTodoService(id:number){
    const index=this.todos.findIndex(t=>t.id===id);
    this.todos.splice(index,1);
    this.updateToLocalStorage();
  }
  private updateTodosData() {
    this.displayTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }
}
