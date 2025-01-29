<script lang="ts">
    import { ChevronLeftIcon, ChevronRightIcon, CircleFadingPlusIcon, FilePlus2Icon, Trash2Icon } from "lucide-svelte"
    import { requestToApi } from "../helpers/api"
    import { Steps } from "svelte-steps"
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"
    import { validateRatingGroup } from "../helpers/validateRatingGroup";
    import { getLanguageText } from "../helpers/action";
    import { navigate } from "svelte-routing";

    let current: number = 0
    let editableRatingOption: CreateRatingOptionType
    let languagesChoosen: string[] = []
    let languagesList: string[] = ["PT", "EN", "ES", "FR", "PL"]
    let languagesShow: string = ""
    let ratingGroup: CreateRatingGroupType = { title: '', description: '', ratingOptions: [] }
    let steps = [{ text: $LL.Steps.Details() }, { text: $LL.Steps.RatingOptions() }]

    const handleStepBackward = () => {
        if (current != 0) current -= 1
    }

    const handleStepForward = () => {
        let check = checkStep(current)
        if (!check) return
        if (current != steps.length - 1) {
            current += 1
        } else {
            document.getElementById("buttonForward")?.setAttribute("disabled", "disabled")
            saveRatingGroup()
        }
    }

    async function saveRatingGroup() {
        let response = await requestToApi("POST", `SmartSurvey/RatingGroups`, ratingGroup)
        if (response.statusCode === 201) {
            toast.success($LL.CreatedRatingGroupSaved())
            navigate("/ratingGroups")
        } else if (response.details === "Category with this title already exists.") {
            document.getElementById("buttonForward")?.removeAttribute("disabled")
            toast.error($LL.CreatedRatingGroupSameTitle())
        } else {
            document.getElementById("buttonForward")?.removeAttribute("disabled")
            toast.error($LL.CreatedRatingGroupFailed())
        }
    }

    function addRatingOption() {
        ratingGroup.ratingOptions = [
            ...ratingGroup.ratingOptions,
            {
                numericValue: ratingGroup.ratingOptions.length,
                needComment: false,
                translations: languagesChoosen.map(l => ({ language: l, title: '', description: '' }))
            }
        ]
        editableRatingOption = ratingGroup.ratingOptions[ratingGroup.ratingOptions.length - 1]
    }

    function checkStep(step: number) {
        let message = validateRatingGroup(ratingGroup, step, languagesChoosen)
        if (message != null && message != "") {
            toast.error(message)
            return false
        }

        if (step === 0) {
            languagesChoosen.sort((a, b) => languagesList.indexOf(a) - languagesList.indexOf(b))
            languagesShow = languagesChoosen[0]
            ratingGroup.ratingOptions.forEach((_, index) => {
                languagesChoosen.forEach(language => {
                    const exists = ratingGroup.ratingOptions[index].translations.find(t => t.language === language)
                    if (!exists) ratingGroup.ratingOptions[index].translations.push({ language, title: '', description: '' })
                })
                ratingGroup.ratingOptions[index].translations = ratingGroup.ratingOptions[index].translations.filter(t => languagesChoosen.includes(t.language))
            })
        }

        return true
    }

    function deleteRatingOption(index: number) {
        if (!Array.isArray(ratingGroup.ratingOptions)) return
        if (index >= 0 && index < ratingGroup.ratingOptions.length) {
            ratingGroup.ratingOptions = ratingGroup.ratingOptions.filter((_, i) => i !== index)
            for (let i = 0; i < ratingGroup.ratingOptions.length; i++) {
                ratingGroup.ratingOptions[i].numericValue = i
            }
        }
    }

    function handleStepClick(step: number, nextStep: number): number {
        if (step > nextStep) return nextStep

        for (let i = step; i < nextStep; i++) {
            let check = checkStep(i)
            if (!check) return i
        }

        return nextStep
    }

    function isCheckboxChecked(language: string) {
        return languagesChoosen.includes(language)
    }

    function toggleCheckbox(event: Event, language: string) {
        const target = event.target as HTMLInputElement
        if (target.checked) {
            languagesChoosen = [...languagesChoosen, language]
        } else {
            languagesChoosen = languagesChoosen.filter(temp => temp !== language)
        }
    }

    $: console.log(ratingGroup)
</script>

<div class="flex flex-col gap-y-5 w-full">
    <div class="flex flex-col md:flex-row gap-x-5 items-center">
        <div class="block">
            <svelte:component this={FilePlus2Icon} class="text-blue-500" size="90" />
        </div>
        <div class="flex flex-col gap-y-2">
            <span class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.CreateRatingGroup()}</span>
            <span class="text-center md:text-left text-sm text-gray-400">{$LL.CreateRatingGroupDescription()}</span>
        </div>
    </div>

    <div class="hidden lg:flex justify-center text-xs text-gray-400">
        <div class="w-[950px]">
            <Steps
                on:click={(e) => current = handleStepClick(e.detail.last, e.detail.current)}
                bind:current
                clickable={true}
                size="2.3em"
                {steps}
            />
        </div>
    </div>

    {#if current == 0}
        <div class="flex flex-col gap-y-5">
            <div class="flex flex-col">
                <span class="font-semibold text-base text-black">{$LL.RatingGroupTitle()}</span>
                <span class="text-xs text-gray-400">{$LL.RatingGroupTitleText()}</span>
                <input
                    bind:value={ratingGroup.title}
                    class="border my-1 p-2 peer rounded text-xs w-auto text-black"
                    maxlength="100"
                    name="titleRatingGroup"
                />
            </div>
            <div class="flex flex-col">
                <span class="font-semibold text-base text-black">{$LL.RatingGroupDescription()}</span>
                <span class="text-xs text-gray-400">{$LL.RatingGroupDescriptionText()}</span>
                <textarea
                    bind:value={ratingGroup.description}
                    class="border my-1 p-2 peer rounded text-xs w-auto text-black"
                    maxlength="300"
                    name="descriptionRatingGroup"
                    rows="4"
                />
            </div>
            <div class="flex flex-col">
                <span class="font-semibold text-base text-black">{$LL.LanguageChoiceTitle()}</span>
                <span class="text-xs text-gray-400">{$LL.LanguageChoiceRatingGroupDescription()}</span>
                <div class="flex flex-col px-5 py-[10px]">
                    {#each languagesList as language}
                        <label class="cursor-pointer flex gap-x-[10px] w-min">
                            <input
                                on:change={(e) => toggleCheckbox(e, language)}
                                checked={isCheckboxChecked(language)}
                                id="language{language}"
                                type="checkbox"
                            />
                            {getLanguageText(language)}
                        </label>
                    {/each}
                </div>
            </div>
        </div>
    {:else if current == 1}
        <div class="flex flex-col gap-y-5">
            {#if languagesChoosen.length > 1}
                <div class="flex gap-x-5 items-center">
                    <span class="font-semibold text-base text-black">{$LL.ShowInLanguage()}:</span>
                    <select bind:value={languagesShow} class="border p-[5px] rounded text-sm bg-gray-100 border-gray-300 text-black">
                        {#each languagesChoosen as lang}
                            <option value={lang}>{getLanguageText(lang)}</option>
                        {/each}
                    </select>
                </div>
            {/if}
            <div class="flex flex-col">
                <span class="font-semibold text-base text-black">{$LL.RatingOptions()}</span>
                <span class="text-xs text-gray-400">{$LL.RatingOptionsText()}</span>
            </div>
            <div class="border flex flex-col gap-y-3 p-3 rounded bg-gray-100 border-gray-300">
                {#each ratingGroup.ratingOptions as ratingOption, index}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div on:click={() => editableRatingOption = ratingOption} class="flex gap-x-5 items-start px-[10px] py-[5px] w-full {editableRatingOption == ratingOption ? 'border-l-2 rounded-r border-blue-500' : 'cursor-pointer rounded hover:bg-gray-200'}">
                        {#each ratingOption.translations as rtoTranslation}
                            {#if rtoTranslation.language == languagesShow}
                                {#if editableRatingOption == ratingOption}
                                    <span class="font-medium text-base">{ratingOption.numericValue}</span>
                                    <div class="flex flex-col flex-grow">
                                        <label class="flex flex-col font-medium rounded text-xs w-full text-black">
                                            {$LL.RatingOptionTitle()}
                                            <input
                                                bind:value={rtoTranslation.title}
                                                class="border font-normal my-1 p-2 peer rounded text-xs w-auto text-black"
                                                maxlength="100"
                                                type="text"
                                            />
                                        </label>
                                        <label class="flex flex-col font-medium rounded text-xs w-full text-black">
                                            {$LL.RatingOptionDescription()}
                                            <textarea
                                                bind:value={rtoTranslation.description}
                                                class="border font-normal my-1 p-2 peer rounded text-xs w-auto text-black"
                                                maxlength="300"
                                                rows="2"
                                            />
                                        </label>
                                        <label class="flex font-medium gap-x-2 rounded text-xs w-full text-black">
                                            {$LL.RatingOptionNeedComment()}
                                            <input bind:checked={ratingOption.needComment} type="checkbox" />
                                        </label>
                                    </div>
                                    <button on:click={() => deleteRatingOption(index)} class="hover:text-red-500 text-gray-400" title={$LL.DeleteRatingOption()}>
                                        <svelte:component this={Trash2Icon} size={20} />
                                    </button>
                                {:else}
                                    <span class="font-medium text-base text-black">{ratingOption.numericValue}</span>
                                    <div class="flex flex-col flex-grow">
                                        <span class="font-medium text-base text-black">{rtoTranslation.title !== '' ? rtoTranslation.title : '(' + $LL.NoTitle() + ')'} {ratingOption.needComment ? '*' : ''}</span>
                                        <span class="text-xs text-gray-400">{rtoTranslation.description !== '' ? rtoTranslation.description : '(' + $LL.NoDescription() +')'}</span>
                                    </div>
                                {/if}
                            {/if}
                        {/each}
                    </div>
                {/each}
                <button on:click={addRatingOption} class="border border-dashed flex gap-x-3 items-center justify-center p-2 rounded text-sm border-gray-300 hover:bg-gray-200 text-gray-400">
                    <svelte:component this={CircleFadingPlusIcon} />
                    {$LL.AddRatingOption()}
                </button>
            </div>
        </div>
    {/if}

    <div class="flex {current != 0 ? 'justify-between' : 'justify-end'}">
        {#if current != 0}
            <button on:click={handleStepBackward} class="flex items-center gap-x-2 text-sm md:text-base font-semibold px-5 py-2 border rounded hover:bg-gray-100" id="buttonReturn">
                <svelte:component this={ChevronLeftIcon} strokeWidth={4} size={20} />
                {$LL.Return()}
            </button>
        {/if}
        <button on:click={handleStepForward} class="flex items-center gap-x-2 text-sm md:text-base font-semibold px-5 py-2 border rounded bg-blue-500 hover:bg-blue-600 text-white" id="buttonForward">
            {#if current != steps.length - 1}
                {$LL.Forward()}
            {:else}
                {$LL.Finalize()}
            {/if}
            <svelte:component this={ChevronRightIcon} strokeWidth={4} size={20} />
        </button>
    </div>
</div>