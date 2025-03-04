<script lang="ts">
	import SidebarItems from "$lib/components/nav/SidebarItems.svelte";
	import UserMenu from "$lib/components/nav/UserMenu.svelte";
	import SidebarBrand from "$lib/components/nav/SidebarBrand.svelte";
	import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail } from "$lib/components/ui/sidebar";
	import type { ComponentProps } from "svelte";

	let { ref = $bindable(null) }: ComponentProps<typeof Sidebar> = $props();

	import ChartPie from "lucide-svelte/icons/chart-pie";
	import Map from "lucide-svelte/icons/map";
	import { Boxes, Package, ScanSearch, Settings, Tag } from "lucide-svelte"

	// This is sample data.
	const data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg"
		},
		nav: [
			{ title: "Dashboard", url: "/", icon: ChartPie },
			{ title: "Assets", url: "/asset", icon: Package },
			{ title: "Locations", url: "/location", icon: Map },
			{ title: "Categories", url: "/category", icon: Boxes },
			{ title: "Tags", url: "/tag", icon: Tag },
			{ title: "Scanner", url: "/scanner", icon: ScanSearch },
			{
				title: "Workspace Settings",
				url: "#",
				icon: Settings,
				active: true,
				items: [
					{ title: "General", url: "/settings" },
					{ title: "Users", url: "/settings/users" },
					{ title: "Custom Fields", url: "/settings/fields" },
					{ title: "Authentication", url: "/settings/auth" }
				]
			}
		]
	};
</script>

<Sidebar bind:ref collapsible="icon">
	<SidebarHeader>
		<SidebarBrand />
	</SidebarHeader>
	<SidebarContent>
		<SidebarItems items={data.nav} />
	</SidebarContent>
	<SidebarFooter>
		<UserMenu user={data.user} />
	</SidebarFooter>
	<SidebarRail />
</Sidebar>
