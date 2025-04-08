<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { FormControl, FormDescription, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import { settingsSchema, type SettingsSchema } from "./schema";
    import { Save } from "lucide-svelte";
    import { roleSelector } from "$lib/permissions.js";
    import { Select, SelectTrigger } from "$lib/components/ui/select";
    import { toast } from "svelte-sonner";

    $breadcrumbs = [{ label: "Settings", href: "/settings" }];
    $header = headerSnippet

    let { data }: { data: { form: SuperValidated<Infer<SettingsSchema>> } } = $props();

    const form = superForm(data.form, {
        validators: valibotClient(settingsSchema),
        onUpdated: ({ form }) => {
            if (form.valid) toast.success("Settings saved successfully.");
        }
    });

    const { form: formData, enhance, allErrors } = form;
    let role = roleSelector.find(role => role.id === $formData.role);
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1>Settings</h1>
        <Button onclick={() => form.submit()} disabled={$allErrors.length > 0}>
            <Save /> Save
        </Button>
    </div>
{/snippet}

<main>
    <Card>
        <CardHeader>
            <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
            <form method="POST" use:enhance>
                <FormField {form} name="name">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Name</FormLabel>
                            <Input {...props} bind:value={$formData.name} />
                        {/snippet}
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormFieldErrors />
                </FormField>

                <FormField {form} name="email">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Email</FormLabel>
                            <Input {...props} bind:value={$formData.email} disabled />
                        {/snippet}
                    </FormControl>
                    <FormDescription>Your email cannot be changed.</FormDescription>
                    <FormFieldErrors />
                </FormField>

                <FormField {form} name="role">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Role</FormLabel>
                            <Select type="single" disabled bind:value={$formData.role}>
                                <SelectTrigger class="w-full">
                                    <div class="flex flex-row items-center">
                                        {#if role?.icon}
                                            <role.icon class="size-4 mr-2" />
                                        {/if}
                                        {role?.name || "None"}
                                    </div>
                                </SelectTrigger>
                            </Select>
                        {/snippet}
                    </FormControl>
                    <FormDescription>Your role can only be changed by an admin.</FormDescription>
                    <FormFieldErrors />
                </FormField>
            </form>
        </CardContent>
    </Card>
</main>


<style lang="postcss">
    main {
        @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-8;
    }
</style>
