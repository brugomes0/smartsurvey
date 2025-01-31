<script lang="ts">
    import LL from "../i18n/i18n-svelte"
    import { convertUTCToLocalDateShort } from "../helpers/date"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import { CalendarIcon, EarthIcon, PencilIcon, Trash2Icon, UserIcon, XIcon } from "lucide-svelte"
    import Modal from "./Modal.svelte";
    import { navigate } from "svelte-routing";
    import toast from "svelte-french-toast";

    export let lang: string
    export let ratingGroupId: string
    export let user: UserType

    let buttonDelete: boolean = false
    let buttonEdit: boolean = false
    let languageChoosen: string = lang
    let loading: boolean = true
    let modalDeleteIsOpen: boolean = false
    let modalEditIsOpen: boolean = false
    let ratingGroup: RatingGroupType

    async function deleteRatingGroup(ratingGroupId: string) {
        let response = await requestToApi("DELETE", `SmartSurvey/RatingGroups/${ratingGroupId}`)
        if (response.statusCode === 200) {
            toast.success($LL.DeleteRatingGroupSaved())
            navigate("/ratingGroups")
        } else { toast.error($LL.DeleteRatingGroupFailed()) }
    }

    async function getRatingGroup() {
        let response = await requestToApi("GET", `SmartSurvey/RatingGroups/${ratingGroupId}`)
        if (response.statusCode === 200) {
            ratingGroup = response.data
            loading = false
        }
    }

    function exitModal(action: string) {
        switch (action) {
            case "Delete":
                modalDeleteIsOpen = false
                break
            case "Edit":
                modalEditIsOpen = false
                break
            default: break
        }
    }

    function getTranslation(object: any) {
        let translation = object.translations.find((t: any) => t.language === languageChoosen)
        if (!translation) {
            translation = object.translations.find((t: any) => t.language === "PT")
            if (translation) languageChoosen = "PT"
        }

        if (!translation) {
            translation = object.translations[0]
            languageChoosen = translation.language
        }

        return translation
    }

    onMount(async () => {
        buttonDelete = user.authorizations
            .find(m => m.moduleType === "SmartSurvey")?.windowPermissions
            .find(wp => wp.windowType === "RatingGroups")?.permissions
            .find(p => p.permissionType === "Delete")?.hasPermission
        ?? false;

        buttonEdit = user.authorizations
            .find(m => m.moduleType === "SmartSurvey")?.windowPermissions
            .find(wp => wp.windowType === "RatingGroups")?.permissions
            .find(p => p.permissionType === "Update")?.hasPermission
        ?? false;

        getRatingGroup()
    })
</script>

{#if modalDeleteIsOpen}
    <Modal on:save={() => deleteRatingGroup(ratingGroupId)}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.DeleteRatingGroup()}</span>
            <button on:click={() => exitModal("Delete")} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.DeleteRatingGroupAlertText()}</span>
        </div>
    </Modal>
{/if}

{#if modalEditIsOpen}
    <Modal on:save={() => navigate(`/ratingGroup/${ratingGroupId}/edit`)}>
        <div class="flex items-center justify-between" slot="header">
            <span class="font-medium text-base text-gray-800">{$LL.EditRatingGroup()}</span>
            <button on:click={() => exitModal("Edit")} class="p-2 rounded hover:bg-gray-200">
                <svelte:component this={XIcon} size={20} />
            </button>
        </div>
        <div class="flex flex-col gap-y-2" slot="content">
            <span class="text-sm text-gray-400">{$LL.EditRatingGroupAlertText()}</span>
        </div>
    </Modal>
{/if}

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
    <div class="flex flex-col gap-y-5 w-full">
        <div class="flex flex-col gap-y-1">
            <span class="font-semibold text-center lg:text-left text-2xl text-black">{ratingGroup.title}</span>
            <span class="text-center lg:text-left text-sm text-gray-400">{ratingGroup.description}</span>
        </div>
        <div class="flex flex-col gap-y-2">
            <span class="border-b font-medium px-2 py-1 text-black border-gray-300">{$LL.RatingGroupDetails()}:</span>
            <div class="flex flex-col lg:flex-row gap-y-2 gap-x-10 px-4">
                <!-- AVAILABLE LANGUAGES -->
                <div class="flex flex-col">
                    <div class="flex gap-x-2">
                        <svelte:component this={EarthIcon} size={16} />
                        <span class="font-medium uppercase text-xs text-gray-500">{$LL.AvailableInLangs()}:</span>
                    </div>
                    <div class="flex items-center gap-x-1 ml-6">
                        {#each ratingGroup.availableLangs as language, index}
                            <button on:click={() => languageChoosen = language} class="text-sm {language === languageChoosen ? 'text-blue-500' : 'text-black'}">
                                {language}
                            </button>
                            {#if ratingGroup.availableLangs.length != index + 1}|{/if}
                        {/each}
                    </div>
                </div>
                <!-- CREATED BY USER -->
                <div class="flex flex-col">
                    <div class="flex gap-x-2">
                        <svelte:component this={UserIcon} size={16} />
                        <span class="font-medium uppercase text-xs text-gray-500">{$LL.CreatedBy()}:</span>
                    </div>
                    <div class="flex items-center gap-x-1 ml-6">
                        <span class="text-sm">{ratingGroup.username}</span>
                    </div>
                </div>
                <!-- CREATED DATE -->
                <div class="flex flex-col">
                    <div class="flex gap-x-2">
                        <svelte:component this={CalendarIcon} size={16} />
                        <span class="font-medium uppercase text-xs text-gray-500">{$LL.CreatedBy()}:</span>
                    </div>
                    <div class="flex items-center gap-x-1 ml-6">
                        <span class="text-sm">{convertUTCToLocalDateShort(ratingGroup.date, lang)}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-y-2 w-full">
            <span class="border-b font-medium px-2 py-1 text-black border-gray-300">{$LL.RatingOptions()}:</span>
            {#key languageChoosen}
                <div class="flex flex-col lg:flex-row items-start justify-between w-full">
                    <div class="flex flex-col gap-y-2 px-4">
                        {#each ratingGroup.ratingOptions as ratingOption, index}
                            <div class="flex flex-col">
                                <span>{index + 1}. {getTranslation(ratingOption).title} {ratingOption.needComment ? '*' : ''}</span>
                            </div>
                        {/each}
                    </div>
                    <span class="px-4 text-xs">{$LL.RatingOptionNeedComment().toLowerCase()}: *</span>
                </div>
            {/key}
        </div>
        <div class="flex flex-col gap-y-2">
            <span class="border-b font-medium px-2 py-1 text-black border-gray-300">{$LL.Actions()}:</span>
            <div class="flex flex-col gap-y-2 px-4">
                <!-- EDIT ACTION -->
                {#if buttonEdit}
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.EditRatingGroup()}</span>
                            <span class="hidden md:inline text-xs text-gray-400">{$LL.EditRatingGroupText()}</span>
                        </div>
                        <button on:click={() => modalEditIsOpen = true} class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={PencilIcon} size={20} />
                            <span>{$LL.Edit()}</span>
                        </button>
                    </div>
                {/if}

                <!-- DELETE ACTION -->
                {#if buttonDelete}
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm">{$LL.DeleteRatingGroup()}</span>
                            <span class="hidden md:inline text-xs text-gray-400">{$LL.DeleteRatingGroupText()}</span>
                        </div>
                        <button on:click={() => modalDeleteIsOpen = true} class="flex font-semibold gap-x-2 items-center px-2 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                            <svelte:component this={Trash2Icon} size={20} />
                            <span>{$LL.Delete()}</span>
                        </button>
                    </div>
                {/if}

                <!-- IF NO ACTIONS AVAILABLE -->
                {#if !buttonDelete && !buttonEdit}
                    <div class="flex">
                        <span class="text-sm">{$LL.NoActionsAvailable()}</span>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}