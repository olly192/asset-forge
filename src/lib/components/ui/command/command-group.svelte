<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		children,
		heading,
		headingSnippet,
		...restProps
	}: CommandPrimitive.GroupProps & {
		heading?: string;
		headingSnippet?: Snippet;
	} = $props();
</script>

<CommandPrimitive.Group
	class={cn("text-foreground overflow-hidden p-1", className)}
	bind:ref
	{...restProps}
>
	{#if heading}
		<CommandPrimitive.GroupHeading
			class="text-muted-foreground px-2 py-1.5 text-xs font-medium"
		>
			{heading}
		</CommandPrimitive.GroupHeading>
	{:else if headingSnippet}
		<CommandPrimitive.GroupHeading
			class="text-muted-foreground px-2 py-1.5 text-xs font-medium flex flex-row items-center gap-1"
		>
			{@render headingSnippet()}
		</CommandPrimitive.GroupHeading>
	{/if}
	<CommandPrimitive.GroupItems {children} />
</CommandPrimitive.Group>
