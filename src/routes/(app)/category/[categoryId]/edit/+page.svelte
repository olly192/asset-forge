<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import { categorySchema, type CategorySchema } from "../../schema";
    import { Save } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import { Textarea } from "$lib/components/ui/textarea";
    import ColorSelect from "$components/ColorSelect.svelte";
    import IconSelect from "$components/IconSelect.svelte";
    import { goto } from "$app/navigation";
    import CategorySelect from "$components/CategorySelect.svelte";
    import { page } from "$app/state";
    import { nameToIcon } from "$lib/utils";

    $header = headerSnippet

    let { data }: { data: { form: SuperValidated<Infer<CategorySchema>> } } = $props();

    const form = superForm(data.form, {
        validators: valibotClient(categorySchema),
        onUpdated: ({ form }) => {
            if (form.valid) {
                goto("/category");
                toast.success("Category updated successfully.");
            }
        }
    });

    const { form: formData, enhance, allErrors } = form;

    $breadcrumbs = [
        { label: "Categories", href: "/category" },
        { label: $formData.name },
        { label: "Edit Category" }
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
            <CardTitle>Edit Category</CardTitle>
        </CardHeader>
        <CardContent>
            <form method="POST" use:enhance>
                <FormField {form} name="name">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Category Name</FormLabel>
                            <Input {...props} bind:value={$formData.name} />
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                <FormField {form} name="description">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Description</FormLabel>
                            <Textarea {...props} bind:value={$formData.description} />
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                <ColorSelect {form} name="color" label="Category Color" bind:value={$formData.color} />
                <IconSelect {form} name="icon" label="Category Icon" bind:value={$formData.icon} color={$formData.color} />
                <CategorySelect {form} name="parent" label="Parent Category" bind:value={$formData.parent} exclude={page.params.categoryId} />
            </form>
        </CardContent>
    </Card>
</main>


<style lang="postcss">
    main {
        @apply w-full max-w-lg m-8;
    }
</style>
