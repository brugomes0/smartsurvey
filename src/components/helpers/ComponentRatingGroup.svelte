<script lang="ts">
    import { CalendarIcon, EarthIcon, PencilIcon, UserIcon, XIcon } from "lucide-svelte"
    import { convertUTCToLocalDateShort } from "../../helpers/date"
    import { createEventDispatcher } from "svelte"
    import { navigate } from "svelte-routing"
    import LL from "../../i18n/i18n-svelte"

    export let buttonDelete: boolean = false
    export let ratingGroup: RatingGroupType
    export let lang: string

    const dispatch = createEventDispatcher()

    function handleDelete() {
        dispatch("delete", ratingGroup.ratingGroupId)
    }
</script>

<div class="border flex flex-col gap-y-2 px-5 py-[10px] rounded-lg shadow relative group border-gray-300">
    <div class="flex gap-x-5">
        <div class="flex flex-col flex-grow gap-y-1">
            <span class="font-semibold text-lg">{ratingGroup.title}</span>
            <div class="flex flex-col lg:flex-row gap-x-4 gap-y-1 lg:items-center text-xs lg:text-sm text-black">
                <div class="flex gap-x-1 items-center">
                    <svelte:component this={EarthIcon} size={16} />
                    <div class="flex items-center gap-x-1">
                        {#each ratingGroup.availableLangs as language, index}
                            <span>{language}</span>
                            {#if ratingGroup.availableLangs.length != index + 1}|{/if}
                        {/each}
                    </div>
                </div>
                <div class="flex gap-x-1 items-center">
                    <svelte:component this={UserIcon} size={16} />
                    <span>{ratingGroup.username}</span>
                </div>
                <div class="flex gap-x-1 items-center">
                    <svelte:component this={CalendarIcon} size={16} />
                    <span>{convertUTCToLocalDateShort(ratingGroup.date, lang)}</span>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-y-[5px] opacity-0 group-hover:opacity-100 transition-opacity">
            <button on:click={() => navigate(`/ratingGroups/${ratingGroup.ratingGroupId}`)} class="rounded text-gray-400 hover:text-black" title={$LL.EditCategory()}>
                <svelte:component this={PencilIcon} size={18} />
            </button>
            {#if buttonDelete}
                <button on:click={() => handleDelete()} class="rounded text-gray-400 hover:text-black" title={$LL.DeleteCategory()}>
                    <svelte:component this={XIcon} size={20} />
                </button>
            {/if}
        </div>
    </div>
    <hr>
    <span class="text-xs text-gray-400">{ratingGroup.description}</span>
</div>