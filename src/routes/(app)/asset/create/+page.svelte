<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import type { FullCustomField } from "$lib/types";
    import type { AssetType, Category } from "@prisma/client";
    import { Save } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { toast } from "svelte-sonner";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import AssetForm from "../AssetForm.svelte";
    import { assetSchema, type AssetSchema } from "../schema";

    let { data }: {
        data: {
            form: SuperValidated<Infer<AssetSchema>>,
            customFields: FullCustomField[],
            typeCustomFields: FullCustomField[],
            assetTypes: AssetType[],
            categories: Category[]
        }
    } = $props();

    let form = superForm(data.form, {
        validators: valibotClient(assetSchema(data.customFields)),
        dataType: "json",
        onUpdated: ({ form }) => {
            if (form.valid) {
                goto("/asset");
                toast.success("Asset created successfully.");
            }
        }
    });

    const { allErrors } = form;

    $breadcrumbs = [
        { label: "Assets", href: "/asset" },
        { label: "Create Asset" }
    ];
    $header = headerSnippet;

    $inspect("errors", $allErrors)
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1>Create Asset</h1>
        <Button onclick={() => form.submit()} disabled={$allErrors.length > 0}>
            <Save /> Save
        </Button>
    </div>
{/snippet}

<AssetForm bind:form />
