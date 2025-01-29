<script lang="ts">
    import { AlertCircleIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon, SignalZero, XIcon } from "lucide-svelte"
    import { navigate } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"
    import ComponentRatingGroup from "./helpers/ComponentRatingGroup.svelte"
    import Modal from "./Modal.svelte";

    export let lang: string
    export let user: UserType

    let buttonCreate: boolean = false
    let buttonDelete: boolean = false
    let error: string = ""
    let firstElement: number = 0
    let input: string = ""
    let lastElement: number = 0
    let loading: boolean = true
    let modalDeleteIsOpen: [boolean, string] = [false, ""]
    let page: number = 1
    let ratingGroups: RatingGroupType[] = []
    let size: number = 5
    let timeoutId: any
    let total: number = 0

    async function deleteRatingGroup(ratingGroupId: string) {
        ratingGroups = [], loading = true
        let response = await requestToApi("DELETE", `SmartSurvey/RatingGroups/${ratingGroupId}`)
        if (response.statusCode === 200) {
            toast.success($LL.DeleteRatingGroupSaved())
        } else { toast.error($LL.DeleteRatingGroupFailed()) }
        page = 1
        debounce(getRatingGroups, 500)
        exitModal()
    }

    async function getRatingGroups() {
        let response = await requestToApi("GET", `SmartSurvey/RatingGroups?page=${page}&pageSize=${size}&name=${input}`)
        console.log(response)
        if (response.statusCode === 200) {
            ratingGroups = response.data
            total = response.totalCount
        } else {
            ratingGroups = []
            error = response.error
        }
        loading = false
    }

    function changePage(change: string) {
        ratingGroups = [], loading = true
        if (change === 'increment' && page < Math.ceil(total / size)) {
            page++
        } else if (change === 'decrement' && page > 1) {
            page--
        }
        debounce(getRatingGroups, 500)
    }

    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    function exitModal() {
        modalDeleteIsOpen = [false, ""]
    }

    function handleInputChanges() {
        ratingGroups = [], loading = true, total = 0
        debounce(getRatingGroups, 1000)
    }

    function openModal(ratingGroupId: string) {
        modalDeleteIsOpen = [true, ratingGroupId]
    }

    onMount(async () => {
        buttonCreate = user.authorizations
            .find(m => m.moduleType === "SmartSurvey")?.windowPermissions
            .find(wp => wp.windowType === "RatingGroups")?.permissions
            .find(p => p.permissionType === "Create")?.hasPermission
        ?? false;

        buttonDelete = user.authorizations
            .find(m => m.moduleType === "SmartSurvey")?.windowPermissions
            .find(wp => wp.windowType === "RatingGroups")?.permissions
            .find(p => p.permissionType === "Delete")?.hasPermission
        ?? false;

        getRatingGroups()
    })

    $: {
        firstElement = Math.min((page - 1) * size + 1, total)
        lastElement = Math.min(page * size, total)
    }
</script>

{#if modalDeleteIsOpen[0]}
    <Modal on:save={() => deleteRatingGroup(modalDeleteIsOpen[1])}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.DeleteRatingGroup()}</span>
            <button on:click={exitModal} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.DeleteRatingGroupAlertText()}</span>
        </div>
    </Modal>
{/if}

<div class="flex flex-col gap-y-5 w-full">
    <div class="flex flex-col lg:flex-row gap-x-20 gap-y-5 items-center justify-between">
        <div class="flex flex-col gap-y-1">
            <span class="font-semibold text-center lg:text-left text-2xl text-black">{$LL.RatingGroups()}</span>
            <span class="text-sm text-gray-400">{$LL.CategoriesPageDescription()}</span>
        </div>
        {#if buttonCreate}
            <button
                on:click={() => navigate("/ratingGroups/createRatingGroup")}
                class="flex font-semibold gap-x-1 items-center justify-center px-2 py-1 rounded text-sm whitespace-nowrap w-max bg-blue-500 hover:bg-blue-600 text-white"
            >
                <svelte:component this={PlusIcon} />
                <span class="flex text-center">{$LL.CreateRatingGroup()}</span>
            </button>
        {/if}
    </div>

    <div class="flex relative">
        <input
            bind:value={input}
            on:input={() => { page = 1; handleInputChanges()}}
            class="border pl-12 pr-5 py-3 rounded-lg text-sm w-full border-gray-300 bg-gray-100"
            placeholder={$LL.InputRatingGroup()}
            type="text"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svelte:component this={SearchIcon} />
        </div>
    </div>

    <div class="flex flex-col gap-y-4">
        {#if loading}
            <div class="flex px-2 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="4" cy="12" r="3" fill="currentColor">
                        <animate id="svgSpinners3DotsScale0" attributeName="r" begin="0;svgSpinners3DotsScale1.end-0.5s" dur="1.5s" values="3;.2;3"/>
                    </circle>
                    <circle cx="12" cy="12" r="3" fill="currentColor">
                        <animate attributeName="r" begin="svgSpinners3DotsScale0.end-1.2s" dur="1.5s" values="3;.2;3"/>
                    </circle>
                    <circle cx="20" cy="12" r="3" fill="currentColor">
                        <animate id="svgSpinners3DotsScale1" attributeName="r" begin="svgSpinners3DotsScale0.end-0.9s" dur="1.5s" values="3;.2;3"/>
                    </circle>
                </svg>
            </div>
        {:else}
            {#if error}
                <div class="border-2 font-semibold p-2 rounded text-sm bg-red-600 border-red-700 text-white">
                    <p>{$LL.ErrorType.RatingGroups()}</p>
                </div>
            {:else}
                {#if ratingGroups.length > 0}
                    {#each ratingGroups as ratingGroup}
                        <ComponentRatingGroup bind:ratingGroup on:delete={e => openModal(e.detail)} {buttonDelete} {lang} />
                    {/each}
                {:else}
                    <div class="flex items-center justify-center">
                        <div class="flex flex-col gap-y-2 items-center lg:w-[400px] p-5 text-gray-400">
                            <svelte:component this={AlertCircleIcon} size={50} strokeWidth={1.5} />
                            <span class="text-xs md:text-sm text-center">{input != "" ? $LL.NoRatingOptionsFilter() : $LL.NoRatingOptionsToShow()}</span>
                        </div>
                    </div>
                {/if}
            {/if}
        {/if}
    </div>

    {#if !loading && total != 0}
        <div class="flex justify-between px-[5px] -mt-3 text-xs">
            <span>{$LL.ShowItemsLabel({ firstElement, lastElement, total })}</span>
            {#if total > 5}
                <div class="flex gap-x-[10px]">
                    <button
                        on:click={() => { if (page != 1) changePage('decrement') }}
                        class="border flex items-center mx-auto rounded shadow h-5 w-5 lg:h-6 lg:w-6 border-gray-300 hover:bg-gray-100 {page != 1 ? 'visible' : 'invisible'}"
                    >
                        <svelte:component this={ChevronLeftIcon} class="h-5 w-5 lg:h-6 lg:w-6" />
                    </button>
                    <button
                        on:click={() => { if (lastElement != total) changePage('increment') }}
                        class="border flex items-center mx-auto rounded shadow h-5 w-5 lg:h-6 lg:w-6 border-gray-300 hover:bg-gray-100 {lastElement != total ? 'visible' : 'invisible'}"
                    >
                        <svelte:component this={ChevronRightIcon} class="h-5 w-5 lg:h-6 lg:w-6" />
                    </button>
                </div>
            {/if}
        </div>
    {/if}
</div>