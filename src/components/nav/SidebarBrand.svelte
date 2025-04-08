<script lang="ts">
	import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "$lib/components/ui/sidebar";
	import { goto } from "$app/navigation"
</script>

<SidebarMenu>
	<SidebarMenuItem>
		<SidebarMenuButton
			class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full px-2"
			size="lg" onclick={() => goto("/")}
		>
			<div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
				<img src="/logo/glyph-white.svg" class="size-6" alt="Asset Forge Logo" />
			</div>
			<div class="grid flex-1 text-left text-lg leading-tight">
				<span class="font-semibold truncate">
					Asset Forge
				</span>
			</div>
		</SidebarMenuButton>
	</SidebarMenuItem>
</SidebarMenu>
