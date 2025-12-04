import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo, QueryTodos, CreateTodo, UpdateTodo, DeleteTodos, ResponseStatus } from 'src/dtos';
import { ApiHttpClient } from 'src/components/services/api-http-client.service';
import { PageComponent } from '../page.component';
import { ErrorSummaryComponent } from 'src/components/error-summary.component';
import { SrcPageComponent } from 'src/shared/src-page.component';

@Component({
    selector: 'app-todos',
    templateUrl: './todos.component.html',
    imports: [
        CommonModule,
        FormsModule,
        PageComponent,
        ErrorSummaryComponent,
        SrcPageComponent,
    ],
})
export class TodoMvcComponent implements OnInit {
    client = inject(ApiHttpClient);

    todos: Todo[] = [];
    newTodoText = '';
    filter: 'all' | 'active' | 'completed' = 'all';
    editingTodoId: number | null = null;
    editingTodoText = '';
    loading = false;
    error: ResponseStatus | null = null;

    ngOnInit(): void {
        this.loadTodos();
    }

    loadTodos(): void {
        this.loading = true;
        this.client.api(new QueryTodos()).subscribe({
            next: (todos) => {
                this.todos = todos.results;
                this.loading = false;
            },
            error: (err) => {
                this.error = err;
                console.error('Error loading todos:', err);
                this.loading = false;
            }
        });
    }

    addTodo(): void {
        if (!this.newTodoText.trim()) return;

        this.loading = true;

        this.client.api(new CreateTodo({
            text: this.newTodoText.trim()
        })).subscribe({
            next: (todo) => {
                this.todos.push(todo);
                this.newTodoText = '';
                this.loading = false;
            },
            error: (err) => {
                this.error = err;
                console.error('Error adding todo:', err);
                this.loading = false;
            }
        });
    }

    toggleCompleted(todo: Todo): void {
        this.client.api(new UpdateTodo({ ...todo, isFinished: !todo.isFinished })).subscribe({
            next: (updated) => {
                const index = this.todos.findIndex(t => t.id === updated.id);
                if (index !== -1) {
                    this.todos[index] = updated;
                }
            },
            error: (err) => {
                this.error = err;
                console.error('Error updating todo:', err);
                // Revert the local change
                const index = this.todos.findIndex(t => t.id === todo.id);
                if (index !== -1) {
                    this.todos[index] = { ...todo };
                }
            }
        });
    }

    toggleAll(isFinished: boolean): void {
        this.todos.forEach(todo => {
            if (todo.isFinished !== isFinished) {
                this.client.api(new UpdateTodo({ ...todo, isFinished })).subscribe({
                    next: (updated) => {
                        const index = this.todos.findIndex(t => t.id === updated.id);
                        if (index !== -1) {
                            this.todos[index] = updated;
                        }
                    },
                    error: (err) => {
                        this.error = err;
                        console.error('Error updating todo:', err);
                    }
                });
            }
        });
    }

    startEditing(todo: Todo): void {
        this.editingTodoId = todo.id!;
        this.editingTodoText = todo.text;
    }

    doneEditing(todo: Todo): void {
        if (this.editingTodoId === null) return;

        const text = this.editingTodoText.trim();
        if (text) {
            this.client.api(new UpdateTodo({ ...todo, text })).subscribe({
                next: (updated) => {
                    const index = this.todos.findIndex(t => t.id === updated.id);
                    if (index !== -1) {
                        this.todos[index] = updated;
                    }
                },
                error: (err) => {
                    this.error = err;
                    console.error('Error updating todo:', err);
                }
            });
        } else {
            this.deleteTodo(todo.id!);
        }
        this.editingTodoId = null;
    }

    cancelEditing(): void {
        this.editingTodoId = null;
    }

    deleteTodo(id: number): void {
        this.client.api(new DeleteTodos({ ids: [id] })).subscribe({
            next: () => {
                this.todos = this.todos.filter(todo => todo.id !== id);
            },
            error: (err) => {
                this.error = err;
                console.error('Error deleting todo:', err);
            }
        });
    }

    clearCompleted(): void {
        const completedTodos = this.todos.filter(todo => todo.isFinished);
        if (completedTodos.length === 0) return;

        this.client.api(new DeleteTodos({
            ids: completedTodos.map(todo => todo.id)
        })).subscribe({
            next: () => {
                this.todos = this.todos.filter(todo => !todo.isFinished);
            },
            error: (err) => {
                this.error = err;
                console.error('Error clearing completed todos:', err);
            }
        });
    }

    get filteredTodos(): Todo[] {
        switch (this.filter) {
            case 'active':
                return this.todos.filter(todo => !todo.isFinished);
            case 'completed':
                return this.todos.filter(todo => todo.isFinished);
            default:
                return this.todos;
        }
    }

    get activeCount(): number {
        return this.todos.filter(todo => !todo.isFinished).length;
    }

    get completedCount(): number {
        return this.todos.filter(todo => todo.isFinished).length;
    }

    get allCompleted(): boolean {
        return this.todos.length > 0 && this.todos.every(todo => todo.isFinished);
    }

    get itemsLeftText(): string {
        return `${this.activeCount} ${this.activeCount === 1 ? 'item' : 'items'} left`;
    }

    dismissError(): void {
        this.error = null;
    }
}
