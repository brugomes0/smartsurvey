<script lang="ts">
    import { AlertCircleIcon, PlusIcon, SearchIcon } from "lucide-svelte"
    import { navigate } from "svelte-routing"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import LL from "../i18n/i18n-svelte"

    export let user: UserType

    let buttonCreate: boolean = false
    let buttonDelete: boolean = false
    let categories: any[] = []
    let error: string = ""
    let input: string = ""
    let langs: string[] = ["PT", "EN", "ES", "FR", "PL"]
    let langShowing: string = "PT"
    let loading: boolean = true
    let page: number = 1
    let size: number = 10
    let timeoutId: any
    let total: number = 0

    async function getCategories() {
        let response = await requestToApi("GET", `SmartSurvey/Categories?page=${page}&pageSize=${size}&language=${langShowing}&name=${input}`)
        if (response.statusCode === 200) {
            categories = response.data
            total = response.totalCount
        } else { error = response.error }
        loading = false
    }

    function chooseLanguage(language: string) {
        if (language == langShowing) return

        langShowing = language, input = ''
        handleInputChanges()
    }

    function debounce(func: any, delay: number) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
    }

    function handleInputChanges() {
        categories = [], loading = true, total = 0
        debounce(getCategories, 1000)
    }

    onMount(async () => {
        const module = user.authorizations.find(temp => temp.moduleType == "SmartSurvey")
        const windowPermissions = module && module.windowPermissions.find(temp => temp.windowType == "Categories")
        const permissionCreate = windowPermissions && windowPermissions.permissions.find(temp => temp.permissionType == "Create")
        const permissionDelete = windowPermissions && windowPermissions.permissions.find(temp => temp.permissionType == "Delete")

        if (permissionCreate && permissionCreate.hasPermission) { buttonCreate = true }
        if (permissionDelete && permissionDelete.hasPermission) { buttonDelete = true }

        getCategories()
    })
</script>

<div class="flex flex-col gap-y-5 w-full">
    <div class="border flex gap-x-1 mx-auto p-1 rounded text-xs border-gray-300 text-gray-500">
        {#each langs as language}
            <button
                on:click={() => chooseLanguage(language)}
                class="py-1 px-2 rounded {language === langShowing ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}"
            >
                {language}
            </button>
        {/each}
    </div>

    <div class="flex flex-col lg:flex-row gap-x-20 gap-y-5 items-center justify-between">
        <div class="flex flex-col gap-y-1 lg:gap-y-0">
            <span class="font-semibold text-center lg:text-left text-xl text-black">{$LL.Categories()}</span>
            <span class="text-sm text-gray-400">{$LL.CategoriesPageDescription()}</span>
        </div>
        {#if buttonCreate}
            <button
                on:click={() => navigate("/categories/createCategory")}
                class="flex font-semibold gap-x-1 items-center justify-center px-2 py-1 rounded text-sm w-max bg-blue-500 hover:bg-blue-600 text-white"
            >
                <svelte:component this={PlusIcon} />
                <span class="text-center">{$LL.CreateCategory()}</span>
            </button>
        {/if}
    </div>

    <div class="flex relative">
        <input
            bind:value={input}
            on:input={() => { page = 1; handleInputChanges() }}
            class="border pl-12 pr-5 py-3 rounded-lg text-sm w-full border-gray-300 bg-gray-100"
            placeholder="{$LL.InputCategory()}"
            type="text"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svelte:component this={SearchIcon} />
        </div>
    </div>

    <div class="flex flex-col">
        {#if loading}
            <div class="flex items-center justify-center">
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
                <div class="border-2 font-semibold p-2 rounded text-sm bg-red-600 border-red-800 text-white">
                    <p>{$LL.NoCategoriesToShow()}</p>
                </div>
            {:else}
                {#if categories.length > 0}
                    <span>List Categories</span>
                {:else}
                    <div class="flex items-center justify-center">
                        <div class="flex flex-col gap-y-2 items-center lg:w-[400px] p-5 text-gray-400">
                            <svelte:component this={AlertCircleIcon} size={50} strokeWidth={1.5} />
                            <span class="text-xs md:text-sm text-center">{input != "" ? $LL.NoCategoriesFilter() : $LL.NoCategoriesToShow()}</span>
                        </div>
                    </div>
                {/if}
            {/if}
        {/if}
    </div>
</div>