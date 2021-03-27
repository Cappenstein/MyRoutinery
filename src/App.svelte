<script lang="ts">
	import Routine from './Routine.svelte';
	import { content } from './localstore';

	let uid = 0;
	let new_value: string = '';
	let new_duration: number = null;
	let todos: Array<{
		todo_name: string;
		routine_id: number;
		duration: number;
	}> = [];

	todos = $content;

	// todos.push({ name: 'Shower', routine_id: uid++, duration: 15 * 60 });
	// todos.push({ name: 'Brush Teeth', routine_id: uid++, duration: 3 * 60 });
	// todos.push({ name: 'Change Clothes', routine_id: uid++, duration: 5 * 60 });

	function addTodo() {
		todos = [
			...todos,
			{
				todo_name: new_value,
				duration: new_duration * 60,
				routine_id: uid++,
			},
		];
		content.update(() => {
			return todos;
		});

		new_value = '';
		new_duration = null;
	}
</script>

<main>
	<div class="add_new">
		<input type="text" placeholder="Add New" bind:value={new_value} />
		<input type="number" placeholder="Minutes" bind:value={new_duration} />
		<button on:click={() => addTodo()}>Save</button>
	</div>
	<div class="routine">
		<Routine bind:todos />
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	.routine {
		max-width: 36em;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
