<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import { tagSchema, type TagSchema } from "../schema";
    import { Save } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import { Textarea } from "$lib/components/ui/textarea";
    import ColorSelect from "$components/ColorSelect.svelte";
    import { goto } from "$app/navigation";

    $breadcrumbs = [
        { label: "Tags", href: "/tag" },
        { label: "Create Tag", href: "/tag/create" }
    ];
    $header = headerSnippet;

    let { data }: { data: { form: SuperValidated<Infer<TagSchema>> } } = $props();

    const form = superForm(data.form, {
        validators: valibotClient(tagSchema),
        onUpdated: ({ form }) => {
            if (form.valid) {
                goto("/tag");
                toast.success("Tag created successfully.");
            }
        }
    });

    const { form: formData, enhance, allErrors } = form;
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1>Create Tag</h1>
        <Button onclick={() => form.submit()} disabled={$allErrors.length > 0}>
            <Save /> Save
        </Button>
    </div>
{/snippet}

<main class="w-full max-w-lg m-8">
    <Card>
        <CardHeader>
            <CardTitle>New Tag</CardTitle>
        </CardHeader>
        <CardContent>
            <form method="POST" use:enhance>
                <FormField {form} name="name">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Tag Name</FormLabel>
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

                <ColorSelect {form} name="color" label="Tag Color" bind:value={$formData.color} />
            </form>
        </CardContent>
    </Card>
</main>
