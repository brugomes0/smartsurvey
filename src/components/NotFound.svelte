<script lang="ts">
    import { BadgeXIcon } from "lucide-svelte"
</script>

<div class="flex flex-col gap-y-1 h-full items-center justify-center w-full">
    <svelte:component this={BadgeXIcon} size={50} strokeWidth={1.5} />
    <span>Not Found Page</span>
</div>