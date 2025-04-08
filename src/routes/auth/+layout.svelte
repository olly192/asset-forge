<script lang="ts">
    let { children } = $props();
</script>

<div class="auth-container">
    <div class="auth-background">
        <img src="/background/yellow.jpg" alt="Background" />
    </div>
    <div class="auth-content">
        {@render children?.()}
    </div>
</div>

<style lang="postcss">
    .auth-container {
        @apply fixed inset-0;
        @apply flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0;

        div.auth-background {
            @apply relative h-full p-10 hidden lg:flex flex-col;
            @apply bg-muted text-white border-r;
            img {
                @apply absolute inset-0 size-full object-cover;
            }
        }

        div.auth-content {
            @apply w-full sm:w-[350px] mx-auto lg:p-8;
            @apply flex flex-col justify-center gap-y-6;
        }
    }
</style>
