<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import { locationSchema, type LocationSchema } from "../../schema";
    import { Save } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import ColorSelect from "$components/select/ColorSelect.svelte";
    import IconSelect from "$components/select/IconSelect.svelte";
    import { goto } from "$app/navigation";
    import LocationSelect from "$components/select/LocationSelect.svelte";
    import { page } from "$app/state";
    import { nameToIcon } from "$lib/utils";

    $header = headerSnippet

    let { data }: { data: { form: SuperValidated<Infer<LocationSchema>> } } = $props();

    const form = superForm(data.form, {
        validators: valibotClient(locationSchema),
        onUpdated: ({ form }) => {
            if (form.valid) {
                goto("/location");
                toast.success("Location updated successfully.");
            }
        }
    });

    const { form: formData, enhance, allErrors } = form;

    $breadcrumbs = [
        { label: "Locations", href: "/location" },
        { label: $formData.name },
        { label: "Edit Location" }
    ];
</script>

{#snippet headerSnippet()}
    {@const Icon = nameToIcon($formData.icon)}
    <div class="header">
        <h1 class="flex flex-row items-center gap-4">
            <Icon class="size-8 stroke-{$formData.color ? $formData.color + '-500' : 'white'}" />
            {$formData.name}
        </h1>
        <Button onclick={() => form.submit()} disabled={$allErrors.length > 0}>
            <Save /> Save
        </Button>
    </div>
{/snippet}

<main>
    <Card>
        <CardHeader>
            <CardTitle>Edit Location</CardTitle>
        </CardHeader>
        <CardContent>
            <form method="POST" use:enhance>
                <FormField {form} name="name">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Name</FormLabel>
                            <Input {...props} bind:value={$formData.name} placeholder="Location Name" />
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                <ColorSelect {form} name="color" label="Location Color" bind:value={$formData.color} />
                <IconSelect {form} name="icon" label="Location Icon" bind:value={$formData.icon} color={$formData.color} />
                <LocationSelect {form} name="parent" label="Parent Location" bind:value={$formData.parent} exclude={page.params.locationId} />
            </form>
        </CardContent>
    </Card>
</main>


<style lang="postcss">
    main {
        @apply w-full max-w-lg m-8;
    }
</style>
