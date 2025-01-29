<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import { createEventDispatcher } from "svelte"

    let dispatch = createEventDispatcher()
    let confirmChanges = () => { dispatch('save') }
</script>

<div class="fixed top-0 left-0 bg-black bg-opacity-75 flex flex-col items-center justify-center w-screen h-full transition-opacity duration-500 z-40">
    <div class="flex flex-col gap-y-2 mx-auto p-2 rounded bg-gray-100 w-full h-full md:w-[400px] md:h-auto">
        <slot name="header" />
        <hr>
        <slot name="content" />
        <hr>
        <div class="flex justify-end">
            <button on:click={confirmChanges} class="font-medium px-1 rounded bg-blue-500 hover:bg-blue-600 text-white">{$LL.Confirm()}</button>
        </div>
    </div>
</div>