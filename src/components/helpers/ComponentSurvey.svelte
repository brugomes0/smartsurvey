<script lang="ts">
    import { CalendarClockIcon, CalendarIcon, EarthIcon, UserIcon, XIcon } from "lucide-svelte"
    import { convertUTCToLocalDateShort } from "../../helpers/date"
    import { createEventDispatcher } from "svelte"
    import LL from "../../i18n/i18n-svelte"

    export let buttonDelete: boolean
    export let lang: string
    export let survey: SurveysType

    const dispatch = createEventDispatcher()

    function handleDelete() {
        dispatch("delete", survey.surveyId)
    }
</script>

<div class="border flex flex-col gap-y-2 px-5 py-[10px] rounded-lg shadow relative group border-gray-300">
    <div class="flex gap-x-5">
        <div class="flex flex-col flex-grow gap-y-1">
            <span class="font-semibold text-lg">{survey.title}</span>
            <div class="flex flex-col lg:flex-row gap-x-4 gap-y-1 lg:items-center text-xs lg:text-sm text-black">
                <div class="flex gap-x-1 items-center">
                    <svelte:component this={EarthIcon} size={16} />
                    <div class="flex items-center gap-x-1">
                        {#each survey.availableLangs as lang, index}
                            <span>{lang}</span>
                            {#if survey.availableLangs.length != index + 1}|{/if}
                        {/each}
                    </div>
                </div>
                <div class="flex gap-x-1 items-center">
                    <svelte:component this={UserIcon} size={16} />
                    <span>{survey.username}</span>
                </div>
                <div class="flex gap-x-1 items-center">
                    <svelte:component this={CalendarIcon} size={16} />
                    <span>{convertUTCToLocalDateShort(survey.createDate, lang)}</span>
                </div>
                {#if survey.endDate}
                    <div class="flex gap-x-1 items-center">
                        <svelte:component this={CalendarClockIcon} size={16} />
                        <span>{convertUTCToLocalDateShort(survey.endDate, lang)}</span>
                    </div>
                {/if}
            </div>
        </div>
        <div class="flex flex-col gap-y-[5px] opacity-0 group-hover:opacity-100 transition-opacity">
            {#if buttonDelete && survey.status != "Active"}
                <button on:click={() => handleDelete()} class="rounded text-gray-400 hover:text-black" title={$LL.DeleteSurvey()}>
                    <svelte:component this={XIcon} size={20} />
                </button>
            {/if}
        </div>
    </div>
    <hr>
    <span class="text-xs text-gray-400">{survey.description}</span>
</div>