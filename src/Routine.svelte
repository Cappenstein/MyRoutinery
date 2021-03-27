<script>
	import Task from './Task.svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
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

	export let todos = [];

	function moveUp(event) {
		const routine_id = event.detail;
		for (var i = 0; i < todos.length; i++) {
			if (todos[i].routine_id == routine_id) {
				if (i === 0) {
					return;
				}
				let move_todo = todos[i - 1];
				todos[i - 1] = todos[i];
				todos[i] = move_todo;
			}
		}
	}
	function moveDown(event) {
		const routine_id = event.detail;
		for (var i = 0; i < todos.length; i++) {
			if (todos[i].routine_id == routine_id) {
				if (i === todos.length - 1) {
					return;
				}
				let move_todo = todos[i + 1];
				todos[i + 1] = todos[i];
				todos[i] = move_todo;
				break;
			}
		}
	}

	function remove(event) {
		todos = todos.filter((t) => t.routine_id !== event.detail);
		console.log(todos);
	}
</script>

{#each todos as todo (todo.routine_id)}
	<div
		in:receive={{ key: todo.routine_id }}
		out:send={{ key: todos.routine_id }}
		animate:flip={{ duration: 200 }}
	>
		<Task
			{...todo}
			on:moveup={moveUp}
			on:movedown={moveDown}
			on:remove={remove}
		/>
	</div>
{/each}

<style>
</style>
