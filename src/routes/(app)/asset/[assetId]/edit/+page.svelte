<script lang="ts">
    import { page } from "$app/state";
    import IdCell from "$components/table/cell/IdCell.svelte";
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import type { FullCustomField } from "$lib/types";
    import type { AssetType, Category } from "@prisma/client";
    import { Save } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { toast } from "svelte-sonner";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import AssetForm from "../../AssetForm.svelte";
    import { assetSchema, type AssetSchema } from "../../schema";

    let { data }: {
        data: {
            form: SuperValidated<Infer<AssetSchema>>,
            customFields: FullCustomField[]
            assetTypes: AssetType[],
            categories: Category[]
        }
    } = $props();

    let form = superForm(data.form, {
        validators: valibotClient(assetSchema(data.customFields, data.typeCustomFields)),
        dataType: "json",
        onUpdated: ({ form }) => {
            if (form.valid) {
                goto("/asset");
                toast.success("Asset updated successfully.");
            }
        }
    });

    const { form: formData, allErrors } = form;
    let assetType = $derived(data.assetTypes?.find(t => t.id === $formData.type));

    $effect(() => {
        $breadcrumbs = [
            { label: "Assets", href: "/asset" },
            { label: `${assetType?.name} (${$formData.assetId})`, href: `/asset/${page.params.assetId}` },
            { label: "Edit Asset" }
        ];
    });

    $header = headerSnippet;
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1 class="flex flex-row items-center gap-4">
            <span>{assetType?.name}</span>
            <IdCell bind:value={$formData.assetId} class="bg-muted/50 p-1 pl-3 rounded-lg text-xl font-medium" />
        </h1>
        <Button onclick={() => form.submit()} disabled={$allErrors.length > 0}>
            <Save /> Save
        </Button>
    </div>
{/snippet}

<AssetForm bind:form />
