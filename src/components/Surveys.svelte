<script lang="ts">
    import ComponentSurvey from "./helpers/ComponentSurvey.svelte"
    import LL from "../i18n/i18n-svelte"
    import Modal from "./Modal.svelte"
    import { AlertCircleIcon, CircleXIcon, PlusIcon, SearchIcon, XIcon } from "lucide-svelte"
    import { navigate } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import toast from "svelte-french-toast";

    export let lang: string
    export let user: UserType

    let buttonCreate: boolean = false
    let buttonDelete: boolean = false
    let error: string = ""
    let input: string = ""
    let loading: boolean = true
    let modalDeleteIsOpen: [boolean, string] = [false, ""]
    let page: number = 1
    let size: number = 5
    let status: string = "Active"
    let statusList = [
        { name: "Active", text: $LL.Status.Active() },
        { name: "NotStarted", text: $LL.Status.NotStarted() },
        { name: "Inactive", text: $LL.Status.Canceled() },
        { name: "Completed", text: $LL.Status.Completed() }
    ]
    let surveys: SurveysType[] = []
    let timeoutId: any
    let total: number = 0

    async function deleteSurvey(surveyId: string) {
        surveys = [], loading = true
        let response = await requestToApi("DELETE", `SmartSurvey/Surveys/${surveyId}`)
        if (response.statusCode === 200) {
            toast.success($LL.DeleteSurveySaved())
        } else { toast.error($LL.DeleteSurveyFailed()) }
        page = 1
        debounce(getSurveys, 500)
        exitModal()
    }

    async function getSurveys() {
        let response = await requestToApi("GET", `SmartSurvey/Surveys?page=${page}&pageSize=${size}&name=${input}&status=${status}`)
        if (response.statusCode === 200) {
            surveys = response.data
            total = response.totalCount
        } else {
            surveys = []
            error = response.error
        }
        loading = false
    }

    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    function exitModal() {
        modalDeleteIsOpen = [false, ""]
    }

    function handleInputChanges() {
        surveys = [], loading = true, total = 0
        debounce(getSurveys, 1000)
    }

    function openModal(surveyId: string) {
        modalDeleteIsOpen = [true, surveyId]
    }

    onMount(() => {
        buttonCreate = user.authorizations
            .find(m => m.moduleType === "SmartSurvey")?.windowPermissions
            .find(wp => wp.windowType === "Surveys")?.permissions
            .find(p => p.permissionType === "Create")?.hasPermission
        ?? false;

        buttonDelete = user.authorizations
            .find(m => m.moduleType === "SmartSurvey")?.windowPermissions
            .find(wp => wp.windowType === "Surveys")?.permissions
            .find(p => p.permissionType === "Delete")?.hasPermission
        ?? false;

        getSurveys()
    })
</script>

{#if modalDeleteIsOpen[0]}
    <Modal on:save={() => deleteSurvey(modalDeleteIsOpen[1])}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.DeleteSurvey()}</span>
            <button on:click={exitModal} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.DeleteSurveyAlertText()}</span>
        </div>
    </Modal>
{/if}

<div class="flex flex-col gap-y-5 w-full">
    <div class="flex flex-col lg:flex-row gap-x-20 gap-y-5 items-center justify-between">
        <div class="flex flex-col gap-y-1">
            <span class="font-semibold text-center lg:text-left text-2xl text-black">{$LL.Surveys()}</span>
            <span class="text-sm text-gray-400">{$LL.SurveysDescription()}</span>
        </div>
        {#if buttonCreate}
            <button
                on:click={() => navigate("/surveys/createSurvey")}
                class="flex font-semibold gap-x-1 items-center justify-center px-2 py-1 rounded text-sm whitespace-nowrap w-max bg-blue-500 hover:bg-blue-600 text-white"
            >
                <svelte:component this={PlusIcon} />
                <span>{$LL.CreateSurvey()}</span>
            </button>
        {/if}
    </div>

    <div class="flex relative">
        <input
            bind:value={input}
            on:input={() => { page = 1; handleInputChanges() }}
            class="border pl-12 pr-5 py-3 rounded-lg text-sm w-full border-gray-300 bg-gray-100"
            placeholder={$LL.InputSurvey()}
            type="text"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svelte:component this={SearchIcon} />
        </div>
    </div>

    <div class="flex flex-col">
        <div class="border flex flex-col lg:flex-row overflow-hidden rounded border-gray-300">
            {#each statusList as singleStatus, i}
                <button
                    on:click={() => { if (status != singleStatus.name) { status = singleStatus.name; handleInputChanges() }}}
                    class="flex-1 py-[5px] text-sm {singleStatus.name === status ? 'font-semibold bg-gray-100' : 'hover:bg-gray-100'} {i !== 0 ? 'lg:border-l border-gray-300': ''}"
                >
                    {singleStatus.text}
                </button>
            {/each}
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
                <div class="border-2 flex font-semibold gap-x-2 items-center p-2 rounded text-sm bg-red-600 border-red-700 text-white">
                    <svelte:component this={CircleXIcon} size={20} />
                    <span>{$LL.ErrorType.Surveys()}</span>
                </div>
            {:else}
                {#if surveys.length > 0}
                    {#each surveys as survey}
                        <ComponentSurvey on:delete={e => openModal(e.detail)} {buttonDelete} {lang} {survey} />
                    {/each}
                {:else}
                    <div class="flex items-center justify-center">
                        <div class="flex flex-col gap-y-2 items-center lg:w-[400px] p-5 text-gray-400">
                            <svelte:component this={AlertCircleIcon} size={50} strokeWidth={1.5} />
                            <span class="text-xs md:text-sm text-center">{input != "" ? $LL.NoSurveysFilter() : $LL.NoSurveysToShow()}</span>
                        </div>
                    </div>
                {/if}
            {/if}
        {/if}
    </div>
</div>