import { writable } from 'svelte/store';

export const taskStorage = writable<Array<{ task_name: string, duration: number, routine_id: number }>>(localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []);

taskStorage.subscribe((value) => localStorage.tasks = JSON.stringify(value));