<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();
	export let routine_id: number;
	export let task_name: string;
	export let duration: number;
	let playButton: HTMLButtonElement;
	let remaining_duration = duration;
	let completed: boolean = false;
	let elapsed: number = 0;
	let start: Date;
	let interval: number = null;
	$: remaining = Math.max(remaining_duration - elapsed, 0);

	/**
	 * Stop the timer for the task
	 */
	function stopTimer() {
		if (interval) {
			window.clearInterval(interval);
		}
		remaining_duration -= elapsed;
		elapsed = 0;
		interval = null;
		playButton.innerHTML = '▶';
	}

	/**
	 * Handle the timer start button getting clicked
	 * This function will stop the interval if it's already running (pause)
	 * OR create the interval to keep track of the time
	 */
	export function timerClick() {
		if (interval) {
			stopTimer();
			return;
		}

		// Every 100 ms update the remaining time
		start = new Date();
		interval = window.setInterval(() => {
			elapsed = Math.floor((Date.now() - start.getTime()) / 1000);
		}, 100);
		playButton.innerHTML = '⏸';
	}

	/**
	 * Update the remaining time to 0 when the task is marked as completed.
	 */
	function completeChecked() {
		if (completed) {
			stopTimer();
			elapsed = remaining_duration;
		} else {
			elapsed = 0;
		}
		dispatch('completeChecked', {
			routine_id: routine_id,
			completed: completed,
		});
	}

	/**
	 * Forward the moveup event to the parent
	 */
	function moveUp() {
		dispatch('moveup', routine_id);
	}

	/**
	 * Forward the movedown event to the parent
	 */
	function moveDown() {
		dispatch('movedown', routine_id);
	}

	/**
	 * Confirm the user wants to remove the task and then forward the event to the parent
	 */
	function remove() {
		// TODO: Make this use something other than the default window.confirm
		var conf = confirm('Are you sure you want to remove this task?');
		if (conf) {
			stopTimer();
			dispatch('remove', routine_id);
		}
	}
</script>

<div class="task" class:completed on:change={completeChecked}>
	<input id="routine-{routine_id}" type="checkbox" bind:checked={completed} />
	<label style="inline-block" for="routine-{routine_id}">
		{task_name} - {Math.floor(remaining / 60)}:{(remaining % 60)
			.toString()
			.padStart(2, '0')}
	</label>
	<span class="options">
		<button bind:this={playButton} on:click={timerClick}>▶</button>
		<button on:click={() => moveUp()}>⬆</button>
		<button on:click={() => moveDown()}>⬇</button>
		<button on:click={() => remove()}>❌</button>
	</span>
</div>

<style>
	.task {
		position: relative;
		line-height: 1.2;
		padding: 0.5em 2.5em 0.5em 2em;
		margin: 0 0 0.5em 0;
		border-radius: 2px;
		user-select: none;
		border: 1px solid hsl(240, 8%, 70%);
		background-color: hsl(240, 8%, 93%);
		color: #333;
		text-align: left;
	}

	.task .options {
		position: absolute;
		right: 0.2em;
		top: 0;
		height: 100%;
	}

	.task button {
		position: relative;
		top: 0;
		margin: 0 0.2em;
		height: 100%;
		width: 2.5em;
		opacity: 0;
		transition: opacity 0.2s;
		cursor: pointer;
	}

	.task:hover button {
		opacity: 1;
	}

	.task.completed {
		text-decoration: line-through;
	}
</style>
