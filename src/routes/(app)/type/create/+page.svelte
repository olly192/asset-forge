<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import type { FullCustomField } from "$lib/types";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import AssetTypeForm from "../AssetTypeForm.svelte";
    import { type AssetTypeSchema, assetTypeSchema } from "../schema";
    import { Save } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";

    $breadcrumbs = [
        { label: "Asset Types", href: "/type" },
        { label: "Create Type", href: "/type/create" }
    ];
    $header = headerSnippet

    let { data }: {
        data: { form: SuperValidated<Infer<AssetTypeSchema>>, customFields: FullCustomField[] }
    } = $props();

    let createInstance = false
    let form = superForm(data.form, {
        validators: valibotClient(assetTypeSchema(data.customFields)),
        dataType: "json",
        onUpdated: ({ form }) => {
            if (form.valid) {
                goto(createInstance ? `/asset/create?type=${form.assetTypeId}` : "/type");
                toast.success("Asset type created successfully.");
            }
        }
    });

    function saveAndCreateInstance() {
        createInstance = true;
        form.submit();
    }

    const { allErrors } = form;
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1>Create Asset Type</h1>
        <div>
            <Button onclick={() => form.submit()} disabled={$allErrors.length > 0}>
                <Save /> Save
            </Button>
            <Button variant="secondary" onclick={saveAndCreateInstance} disabled={$allErrors.length > 0}>
                <Save /> Save & Create Instance
            </Button>
        </div>
    </div>
{/snippet}

<AssetTypeForm bind:form />

