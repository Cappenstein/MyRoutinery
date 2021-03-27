import { writable } from 'svelte/store';

export const content = writable<Array<{ todo_name: string, duration: number, routine_id: number }>>([]);

// content.subscribe((value) => localStorage.content = JSON.stringify(value));