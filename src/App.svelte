<script lang="ts">
	import Routine from './Routine.svelte';
	import { taskStorage } from './localstore';

	let uid = 0;
	let new_value: string = '';
	let new_duration: number = null;
	let tasks: Array<{
		task_name: string;
		routine_id: number;
		duration: number;
	}> = [];

	tasks = $taskStorage;

	taskStorage.subscribe((tasks) => {
		tasks.forEach((task) => {
			if (task.routine_id >= uid) {
				uid = task.routine_id + 1;
				console.log('uid set to the highest routine_id ' + uid);
			}
		});
	});

	// tasks.push({ name: 'Shower', routine_id: uid++, duration: 15 * 60 });
	// tasks.push({ name: 'Brush Teeth', routine_id: uid++, duration: 3 * 60 });
	// tasks.push({ name: 'Change Clothes', routine_id: uid++, duration: 5 * 60 });

	/**
	 * Add a new task based on the current values in the inputs and clear the inputs
	 */
	function addTask() {
		tasks = [
			...tasks,
			{
				task_name: new_value,
				duration: new_duration * 60,
				routine_id: uid++,
			},
		];
		taskStorage.update(() => {
			return tasks;
		});

		new_value = '';
		new_duration = null;
		document.getElementById('add_new_task').focus();
	}
</script>

<main>
	<div class="add_new">
		<input
			id="add_new_task"
			type="text"
			placeholder="Add New"
			bind:value={new_value}
		/>
		<input type="number" placeholder="Minutes" bind:value={new_duration} />
		<button on:click={() => addTask()}>Save</button>
	</div>
	<div class="routine">
		<Routine bind:tasks />
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
