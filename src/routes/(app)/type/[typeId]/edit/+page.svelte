<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import type { FullCustomField } from "$lib/types";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import AssetTypeForm from "../../AssetTypeForm.svelte";
    import { type AssetTypeSchema, assetTypeSchema } from "../../schema";
    import { Save } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";

    $header = headerSnippet;

    let { data }: {
        data: { form: SuperValidated<Infer<AssetTypeSchema>>, customFields: FullCustomField[] }
    } = $props();

    let form = superForm(data.form, {
        validators: valibotClient(assetTypeSchema(data.customFields)),
        dataType: "json",
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

<AssetTypeForm bind:form />
