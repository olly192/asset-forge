<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import CustomFieldForm from "../../CustomFieldForm.svelte";
    import { customFieldSchema, type CustomFieldSchema } from "../../schema";
    import { Save } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";

    $header = headerSnippet;

    let { data }: { data: { form: SuperValidated<Infer<CustomFieldSchema>> } } = $props();

    let form = superForm(data.form, {
        validators: valibotClient(customFieldSchema),
        dataType: "json",
        onUpdated: ({ form }) => {
            if (form.valid) {
                goto("/field");
                toast.success("Custom field updated successfully.");
            }
        }
    });

    const { form: formData, allErrors } = form;

    $breadcrumbs = [
        { label: "Custom Fields", href: "/field" },
        { label: $formData.name },
        { label: "Edit Field" }
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
            <CardTitle>Edit Custom Field</CardTitle>
        </CardHeader>
        <CardContent>
            <CustomFieldForm bind:form />
        </CardContent>
    </Card>
</main>


<style lang="postcss">
    main {
        @apply w-full max-w-lg m-8;
    }
</style>
