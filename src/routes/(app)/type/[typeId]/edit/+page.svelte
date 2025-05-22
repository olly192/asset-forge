<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import AssetTypeForm from "../../AssetTypeForm.svelte";
    import { assetTypeSchema, type AssetTypeSchema } from "../../schema";
    import { Save } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";

    $header = headerSnippet;

    let { data }: { data: { form: SuperValidated<Infer<AssetTypeSchema>> } } = $props();

    let form = superForm(data.form, {
        validators: valibotClient(assetTypeSchema),
        onUpdated: ({ form }) => {
            if (form.valid) {
                goto("/type");
                toast.success("Asset type updated successfully.");
            }
        }
    });

    const { form: formData, allErrors } = form;

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
            <AssetTypeForm bind:form />
        </CardContent>
    </Card>
</main>


<style lang="postcss">
    main {
        @apply w-full max-w-lg m-8;
    }
</style>
