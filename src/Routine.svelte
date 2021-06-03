<script>
	import Task from './Task.svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { taskStorage } from './localstore';

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
			};
		},
	});

	export let tasks = [];
	let taskComponents = [];

	/**
	 * Move the task associated with the button up in the routine
	 * @param event
	 */
	function moveUp(event) {
		// TODO: Make this smarter
		const routine_id = event.detail;
		for (var i = 0; i < tasks.length; i++) {
			if (tasks[i].routine_id == routine_id) {
				if (i === 0) {
					return;
				}
				let move_task = tasks[i - 1];
				tasks[i - 1] = tasks[i];
				tasks[i] = move_task;
			}
		}
		taskStorage.set(tasks);
	}

	/**
	 * Move the task associated with the button down in the routine
	 * @param event
	 */
	function moveDown(event) {
		// TODO: Make this smarter
		const routine_id = event.detail;
		for (var i = 0; i < tasks.length; i++) {
			if (tasks[i].routine_id == routine_id) {
				if (i === tasks.length - 1) {
					return;
				}
				let move_task = tasks[i + 1];
				tasks[i + 1] = tasks[i];
				tasks[i] = move_task;
				break;
			}
		}
		taskStorage.set(tasks);
	}

	function completeChecked(event) {
		let task = null;
		if (!event.detail.completed) {
			return;
		}
		for (let i = 0; i < tasks.length; i++) {
			if (
				tasks[i].routine_id == event.detail.routine_id &&
				i + 1 < tasks.length
			) {
				const next_routine_id = tasks[i + 1].routine_id;
				task = taskComponents[next_routine_id];
				break;
			}
		}
		if (task) {
			task.timerClick();
		}
	}

	/**
	 * Remove the task associated with the button from the routine
	 * @param event
	 */
	function remove(event) {
		tasks = tasks.filter((t) => t.routine_id !== event.detail);
		taskStorage.set(tasks);
	}
</script>

{#each tasks as task (task.routine_id)}
	<div
		in:receive={{ key: task.routine_id }}
		out:send={{ key: task.routine_id }}
		animate:flip={{ duration: 200 }}
	>
		<Task
			{...task}
			on:moveup={moveUp}
			on:movedown={moveDown}
			on:remove={remove}
			on:completeChecked={completeChecked}
			bind:this={taskComponents[task.routine_id]}
		/>
	</div>
{/each}

<style>
</style>
