<script lang="ts">
    import { getText } from "../helpers/action"
    import { onMount } from "svelte"
    import { requestToApi } from "../helpers/api"
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"

    export let user: UserType

    let buttonDisabled: boolean = false
    let error: string = ""
    let loading: boolean = true
    let permissionSave: boolean = false
    let profileChooseId: number = 0
    let profilePermissions: WindowPermissionType[] = []
    let profiles: ProfileType[] = []

    async function getPermissionOfProfile(id: number) {
        let response = await requestToApi("GET", `Admin/${id}/Permissions?module=SmartSurvey`)
        if (response.statusCode === 200 && response.data.length > 0) {
            profilePermissions = response.data
        } else {
            error = response.error
        }
    }

    async function getProfiles() {
        let response = await requestToApi("GET", `Profiles`)
        if (response.statusCode === 200) profiles = response.data
        if (profiles.length > 0) {
            profileChooseId = profiles[0].idperfil
        } else {
            error = response.error
        }
        loading = false
    }

    async function saveSettings() {
        buttonDisabled = true

        let permissionsGranted: number[] = []
        if (profilePermissions.length !== 0) {
            profilePermissions.forEach(window => {
                window.permissions.forEach(permission => {
                    if (permission.hasPermission) permissionsGranted = [...permissionsGranted, permission.permissionId]
                })
            })
        }

        let response = await requestToApi("POST", `Admin/${profileChooseId}/Permissions?module=SmartSurvey`, permissionsGranted)
        if (response.statusCode === 200) {
            toast.success($LL.PermissionsSaved())
            setTimeout(() => { window.location.href = "/" }, 2000)
        } else {
            toast.error($LL.ErrorType.CannotSavePermissions())
            buttonDisabled = false
        }
    }

    onMount(async () => {
        const module = user.authorizations.find(temp => temp.moduleType == "SmartSurvey")
        const windowPermissions = module?.windowPermissions.find(temp => temp.windowType == "Permissions")
        const permission = windowPermissions && windowPermissions.permissions.find(temp => temp.permissionType == "Create")
        if (permission?.hasPermission) permissionSave = true

        getProfiles()
    })
</script>

{#if loading}
    <div class="flex flex-col justify-center w-full">
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
        <div class="flex flex-col">
            <p class="font-semibold text-lg text-black">{$LL.ChooseProfile()}</p>
            <p class="text-xs text-gray-400">{$LL.ChooseProfileText()}</p>
        </div>
        {#if profiles.length > 0}
            <select bind:value={profileChooseId} class="border p-2 rounded text-sm border-gray-300 bg-gray-200">
                {#each profiles as profile}
                    <option value={profile.idperfil}>{profile.idperfil} - {profile.nome}</option>
                {/each}
            </select>

            <div class="flex flex-col gap-y-5">
                {#await getPermissionOfProfile(profileChooseId)}
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
                {:then}
                    <div class="flex flex-col gap-y-5">
                        {#if profilePermissions.length !== 0}
                            {#each profilePermissions as wp}
                                <div class="flex flex-col gap-y-2">
                                    <li class="font-medium">{getText(wp.windowType)}</li>
                                    <div class="flex flex-col gap-y-2">
                                        {#each wp.permissions as p}
                                            <div class="flex gap-x-2 justify-between">
                                                <p>{getText(p.permissionType)}</p>
                                                <div class="border-b-2 flex-grow border-gray-300"></div>
                                                <label class="toggle">
                                                    <input bind:checked={p.hasPermission} id={`permission_${p.permissionId}`} type="checkbox" />
                                                    <span class="slider" />
                                                </label>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                            <button
                                on:click={() => saveSettings()}
                                class="flex font-semibold items-center justify-center mt-5 mx-auto py-2 rounded w-[100px] bg-blue-500 hover:bg-blue-600 text-white {permissionSave ? 'inline' : 'hidden'}"
                                disabled={buttonDisabled}
                            >
                                {#if buttonDisabled}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...$$props}>
                                        <g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                                            <path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9">
                                                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0" />
                                                <animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
                                            </path>
                                            <path stroke-dasharray="64" stroke-dashoffset="64" stroke-opacity="0.5" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
                                                <animate fill="freeze" attributeName="stroke-dashoffset" dur="1.2s" values="64;0" />
                                            </path>
                                        </g>
                                    </svg>
                                {:else}
                                    {$LL.Save()}
                                {/if}
                            </button>
                        {:else}
                            <div class="border-2 font-semibold p-2 rounded text-sm border-red-800 bg-red-700 text-white">
                                <span>{$LL.ErrorType.NoPermissionsOfProfile()}</span>
                            </div>
                        {/if}
                    </div>
                {/await}
            </div>
        {:else}
            <div class="border-2 font-semibold p-2 rounded text-sm border-red-800 bg-red-700 text-white">
                <span>{$LL.ErrorType.NoProfiles()}</span>
            </div>
        {/if}
    </div>
{/if}

<style>
    .toggle {
        display: inline-block;
        height: 22px;
        position: relative;
        width: 40px;
    }
    .toggle input {
        display: none;
    }
    .slider {
        background-color: gray;
        border-radius: 34px;
        bottom: 0;
        cursor: pointer;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: .4s;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 4px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked+.slider { background-color: #3B82F6; }
    input:checked+.slider:before { transform: translateX(14px); }
</style>