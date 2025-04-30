<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import { assetTypeSchema, type AssetTypeSchema } from "../../schema";
    import { Save } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";
    import CategorySelect from "$components/CategorySelect.svelte";

    $header = headerSnippet;

    let { data }: { data: { form: SuperValidated<Infer<AssetTypeSchema>> } } = $props();

    const form = superForm(data.form, {
        validators: valibotClient(assetTypeSchema),
        onUpdated: ({ form }) => {
            if (form.valid) {
                goto("/type");
                toast.success("Asset type updated successfully.");
            }
        }
    });

    const { form: formData, enhance, allErrors } = form;

    $breadcrumbs = [
        { label: "Asset Types", href: "/type" },
        { label: $formData.name },
        { label: "Edit Type" }
    ];
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1 class="flex flex-row items-center gap-4">
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
            <CardTitle>Edit Asset Type</CardTitle>
        </CardHeader>
        <CardContent>
            <form method="POST" use:enhance>
                <FormField {form} name="name">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Name</FormLabel>
                            <Input {...props} bind:value={$formData.name} placeholder="Type Name" />
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                <CategorySelect {form} name="category" label="Category" bind:value={$formData.category} allowNone />
            </form>
        </CardContent>
    </Card>
</main>


<style lang="postcss">
    main {
        @apply w-full max-w-lg m-8;
    }
</style>
