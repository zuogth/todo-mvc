import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Filter, FilterButton } from 'src/app/models/filtering.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit,OnDestroy {
  filterButtons:FilterButton[]=[
    {type:Filter.All,label:'All',isActive:true},
    {type:Filter.Active,label:'Active',isActive:false},
    {type:Filter.Completed,label:'Completed',isActive:false}
  ]

  length=0;
  hasComplete$!: Observable<boolean>;
  destroy$:Subject<null>=new Subject<null>();

  constructor(private todoService:TodoService) { }

  ngOnInit(): void {
    this.hasComplete$=this.todoService.todos$.pipe(
      map(todos=>todos.some(t=>t.isCompleted)),
      takeUntil(this.destroy$)//sẽ unsubcribe khi component này destroy
    );
    this.todoService.length$.pipe(takeUntil(this.destroy$)).subscribe(l=>this.length=l);
  }

  filter(type:Filter){
    this.setActiveFilterBtn(type);
    this.todoService.filterTodos(type);
  }

  filterCompleted(){
    this.todoService.filterTodoCompleted();
  }
  setActiveFilterBtn(type:Filter){
    this.filterButtons.forEach(filter=>{
      filter.isActive=filter.type===type;
    });
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}
