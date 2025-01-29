<script lang="ts">
    import { ChevronLeftIcon, ChevronRightIcon, CircleFadingPlusIcon, FilePlus2Icon, Trash2Icon } from "lucide-svelte"
    import { Steps } from "svelte-steps"
    import { getLanguageText, isCheckboxChecked } from "../helpers/action"
    import { navigate } from "svelte-routing"
    import { requestToApi } from "../helpers/api"
    import { validateCategory } from "../helpers/validateCategory"
    import LL from "../i18n/i18n-svelte"
    import toast from "svelte-french-toast"

    let category: CreateCategoryType
    let current: number = 0
    let editableQuestion: any
    let languagesChoosen: string[] = []
    let languagesList: string[] = ["PT", "EN", "ES", "FR", "PL"]
    let languagesShow: string = ""
    let page: number = 0
    let steps = [
        { text: $LL.Steps.Details() },
        { text: $LL.Steps.RatingQuestions() },
        { text: $LL.Steps.TextQuestions() }
    ]

    const handleStepBackward = (event: Event) => {
        if (current != 0) current -= 1
    }

    const handleStepForward = (event: Event) => {
        let check = checkStep(current)
        if (!check) return
        if (current != steps.length - 1) {
            current += 1
        } else {
            document.getElementById("buttonForward")?.setAttribute("disabled", "disabled")
            saveCategory()
        }
    }

    async function saveCategory() {
        let response = await requestToApi("POST", `SmartSurvey/Categories`, category)
        if (response.statusCode === 201) {
            toast.success($LL.CreatedCategorySaved())
            navigate("/categories")
        } else if (response.details === "Category with this title already exists.") {
            document.getElementById("buttonForward")?.removeAttribute("disabled")
            toast.error($LL.CreatedCategorySameTitle())
        } else {
            document.getElementById("buttonForward")?.removeAttribute("disabled")
            toast.error($LL.CreatedCategoryFailed())
        }
    }

    function addQuestion(type: string) {
        if (type === 'Rating') {
            let insertIndex = category.questions.length

            for (let i = 0; i < category.questions.length; i++) {
                if (category.questions[i].type === "Text") {
                    insertIndex = i
                    break
                }
            }

            category.questions = [
                ...category.questions.slice(0, insertIndex),
                { type: 'Rating', translations: languagesChoosen.map(language => ({ language, title: '', description: '' })) },
                ...category.questions.slice(insertIndex)
            ]
            editableQuestion = category.questions[insertIndex]
        } else if (type === 'Text') {
            category.questions = [
                ...category.questions,
                { type: 'Text', translations: languagesChoosen.map(language => ({ language, title: '', description: '' })) }
            ]
            editableQuestion = category.questions[category.questions.length - 1]
        }
    }

    function checkStep(step: number) {
        let message = validateCategory(category, step)
        if (message != null && message != "") {
            toast.error(message)
            return false
        }

        return true
    }

    function deleteQuestion(index: number) {
        if (!Array.isArray(category.questions)) return
        if (index >= 0 && index < category.questions.length) category.questions = category.questions.filter((_, i) => i !== index)
    }

    function handleStepClick(step: number, nextStep: number): number {
        if (step > nextStep) return nextStep

        for (let i = step; i < nextStep; i++) {
            let check = checkStep(i)
            if (!check) return i
        }

        return nextStep
    }

    function toggleCheckbox(event: Event, language: string) {
        const target = event.target as HTMLInputElement
        if (target.checked) {
            languagesChoosen = [...languagesChoosen, language]
        } else {
            languagesChoosen = languagesChoosen.filter((lang) => lang !== language)
        }

        languagesChoosen.sort((a, b) => languagesList.indexOf(a) - languagesList.indexOf(b))
    }

    function validateLanguages() {
        if (languagesChoosen.length === 0) {
            toast.error($LL.ErrorType.NoLanguagesChoice())
        } else {
            category = {
                questions: [],
                translations: languagesChoosen.map((lang) => ({
                    language: lang, title: '', description: ''
                }))
            }
            languagesShow = category.translations[0].language
            page++
        }
    }
</script>

<div class="flex flex-col gap-y-5 w-full">
    <div class="flex flex-col md:flex-row gap-x-5 items-center">
        <div class="block">
            <svelte:component this={FilePlus2Icon} class="text-blue-500" size="90" />
        </div>
        <div class="flex flex-col gap-y-2">
            <span class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.CreateCategory()}</span>
            <span class="text-center md:text-left text-sm text-gray-400">{$LL.CreateCategoryDescription()}</span>
        </div>
    </div>

    {#if page == 0}
        <div class="flex flex-col">
            <span class="font-semibold text-base text-black">{$LL.LanguageChoiceTitle()}</span>
            <span class="text-xs text-gray-400">{$LL.LanguageChoiceCategoryDescription()}</span>
            <div class="flex flex-col mt-2 px-5">
                {#each languagesList as lang}
                    <label class="cursor-pointer flex gap-x-[10px] text-sm w-min">
                        <input
                            on:change={(e) => toggleCheckbox(e, lang)}
                            checked={isCheckboxChecked(languagesChoosen, lang)}
                            id="languageOption_{lang}"
                            type="checkbox"
                        />
                        {getLanguageText(lang)}
                    </label>
                {/each}
            </div>
        </div>
        <button
            on:click={validateLanguages}
            class="font-semibold mx-auto lg:ml-0 lg:mr-auto py-[5px] rounded w-[200px] bg-blue-500 hover:bg-blue-600 text-white"
        >
            {$LL.Continue()}
        </button>
    {:else if page == 1}
        <div class="flex flex-col gap-y-5 text-xs text-gray-400">
            <div class="hidden lg:flex justify-center">
                <div class="w-[950px]">
                    <Steps
                        on:click={(e) => current = handleStepClick(e.detail.last, e.detail.current)}
                        clickable={true}
                        size="2.3em"
                        {steps}
                        bind:current
                    />
                </div>
            </div>

            {#if current == 0}
                <div class="flex gap-x-2 {languagesChoosen.length == 1 ? 'hidden' : 'inline'}">
                    <span class="font-semibold text-base text-black">{$LL.ShowInLanguage()}:</span>
                    <select bind:value={languagesShow} class="border p-[5px] rounded bg-gray-100 border-gray-300 text-black">
                        {#each languagesChoosen as lang}
                            <option value={lang}>{getLanguageText(lang)}</option>
                        {/each}
                    </select>
                </div>
                <div class="flex flex-col">
                    <span class="font-semibold text-base text-black">{$LL.CategoryTitle()}</span>
                    <span class="text-xs text-gray-400">{$LL.CategoryTitleText()}</span>
                    {#each category.translations as translation}
                        {#if translation.language === languagesShow}
                            <input
                                bind:value={translation.title}
                                class="border my-1 p-2 peer rounded text-xs w-auto text-black"
                                maxlength="100"
                                name="titleCategory"
                            />
                        {/if}
                    {/each}
                </div>
                <div class="flex flex-col">
                    <span class="font-semibold text-base text-black">{$LL.CategoryDescription()}</span>
                    <span class="text-xs text-gray-400">{$LL.CategoryDescriptionText()}</span>
                    {#each category.translations as translation}
                        {#if translation.language === languagesShow}
                            <textarea
                                bind:value={translation.description}
                                class="border my-1 p-2 peer rounded text-xs w-auto text-black"
                                maxlength="300"
                                name="descriptionCategory"
                                rows="4"
                            />
                        {/if}
                    {/each}
                </div>
            {:else if current == 1}
                <div class="flex gap-x-2 {languagesChoosen.length == 1 ? 'hidden' : 'inline'}">
                    <span class="font-semibold text-base text-black">{$LL.ShowInLanguage()}:</span>
                    <select bind:value={languagesShow} class="border p-[5px] rounded bg-gray-100 border-gray-300 text-black">
                        {#each languagesChoosen as lang}
                            <option value={lang}>{getLanguageText(lang)}</option>
                        {/each}
                    </select>
                </div>
                <div class="flex flex-col">
                    <span class="font-semibold text-base text-black">{$LL.CreateQuestionsOfRatingLabel()}</span>
                    <span class="text-xs text-gray-400">{$LL.CreateQuestionsOfRatingText()}</span>
                </div>
                <div class="border flex flex-col gap-y-3 p-3 rounded bg-gray-100 border-gray-300">
                    {#each category.questions as question, index}
                        {#if question.type == "Rating"}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div
                                on:click={() => editableQuestion = question}
                                class="flex gap-x-5 items-start px-[10px] py-[5px] w-full {editableQuestion == question ? 'border-l-2 rounded-r border-blue-500' : 'cursor-pointer rounded hover:bg-gray-200'}"
                            >
                                {#each question.translations as rtoTranslation}
                                    {#if rtoTranslation.language == languagesShow}
                                        {#if editableQuestion == question}
                                            <div class="flex flex-col flex-grow">
                                                <label class="flex flex-col font-medium rounded text-xs w-full text-black">
                                                    {$LL.QuestionTitle()}
                                                    <input
                                                        bind:value={rtoTranslation.title}
                                                        class="border font-normal px-2 py-1 rounded text-sm border-gray-300"
                                                        maxlength="100"
                                                        type="text"
                                                    />
                                                </label>
                                                <label class="flex flex-col font-medium rounded text-xs w-full text-black">
                                                    {$LL.QuestionDescription()}
                                                    <textarea
                                                        bind:value={rtoTranslation.description}
                                                        class="border font-normal px-2 py-1 rounded text-sm border-gray-300"
                                                        maxlength="300"
                                                        rows="2"
                                                    />
                                                </label>
                                            </div>
                                            <button on:click={() => deleteQuestion(index)} class="hover:text-red-500 text-gray-400" title={$LL.DeleteQuestion()}>
                                                <svelte:component this={Trash2Icon} size={20} />
                                            </button>
                                        {:else}
                                            <div class="flex flex-col flex-grow">
                                                <span class="font-medium text-base text-gray-900">{rtoTranslation.title ? rtoTranslation.title : "(" + $LL.NoTitle() + ")"}</span>
                                                <span class="text-xs text-gray-400">{rtoTranslation.description ? rtoTranslation.description : "(" + $LL.NoDescription() + ")"}</span>
                                            </div>
                                        {/if}
                                    {/if}
                                {/each}
                            </div>
                        {/if}
                    {/each}
                    <button on:click={() => addQuestion("Rating")} class="border border-dashed flex gap-x-3 items-center justify-center p-2 rounded text-sm border-gray-300 hover:bg-gray-200 text-gray-400">
                        <svelte:component this={CircleFadingPlusIcon} />
                        <span>{$LL.AddQuestion()}</span>
                    </button>
                </div>
            {:else if current == 2}
                <div class="flex gap-x-2 {languagesChoosen.length == 1 ? 'hidden' : 'inline'}">
                    <span class="font-semibold text-base text-black">{$LL.ShowInLanguage()}:</span>
                    <select bind:value={languagesShow} class="border p-[5px] rounded bg-gray-100 border-gray-300 text-black">
                        {#each languagesChoosen as lang}
                            <option value={lang}>{getLanguageText(lang)}</option>
                        {/each}
                    </select>
                </div>
                <div class="flex flex-col">
                    <span class="font-semibold text-base text-black">{$LL.CreateQuestionsOfTextLabel()}</span>
                    <span class="text-xs text-gray-400">{$LL.CreateQuestionsOfTextText()}</span>
                </div>
                <div class="border flex flex-col gap-y-3 p-3 rounded bg-gray-100 border-gray-300">
                    {#each category.questions as question, index}
                        {#if question.type == "Text"}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div
                                on:click={() => editableQuestion = question}
                                class="flex gap-x-5 items-start px-[10px] py-[5px] w-full {editableQuestion == question ? 'border-l-2 rounded-r border-blue-500' : 'cursor-pointer rounded hover:bg-gray-200'}"
                            >
                                {#each question.translations as rtoTranslation}
                                    {#if rtoTranslation.language == languagesShow}
                                        {#if editableQuestion == question}
                                            <div class="flex flex-col flex-grow">
                                                <label class="flex flex-col font-medium rounded text-xs w-full text-black">
                                                    {$LL.QuestionTitle()}
                                                    <input
                                                        bind:value={rtoTranslation.title}
                                                        class="border font-normal px-2 py-1 rounded text-sm border-gray-300"
                                                        maxlength="100"
                                                        type="text"
                                                    />
                                                </label>
                                                <label class="flex flex-col font-medium rounded text-xs w-full text-black">
                                                    {$LL.QuestionDescription()}
                                                    <textarea
                                                        bind:value={rtoTranslation.description}
                                                        class="border font-normal px-2 py-1 rounded text-sm border-gray-300"
                                                        maxlength="300"
                                                        rows="2"
                                                    />
                                                </label>
                                            </div>
                                            <button on:click={() => deleteQuestion(index)} class="hover:text-red-500 text-gray-400" title={$LL.DeleteQuestion()}>
                                                <svelte:component this={Trash2Icon} size={20} />
                                            </button>
                                        {:else}
                                            <div class="flex flex-col flex-grow">
                                                <span class="font-medium text-base text-black">{rtoTranslation.title ? rtoTranslation.title : "(" + $LL.NoTitle() + ")"}</span>
                                                <span class="text-xs text-gray-400">{rtoTranslation.description ? rtoTranslation.description : "(" + $LL.NoDescription() + ")"}</span>
                                            </div>
                                        {/if}
                                    {/if}
                                {/each}
                            </div>
                        {/if}
                    {/each}
                    <button on:click={() => addQuestion("Text")} class="border border-dashed flex gap-x-3 items-center justify-center p-2 rounded text-sm border-gray-300 hover:bg-gray-200 text-gray-400">
                        <svelte:component this={CircleFadingPlusIcon} />
                        <span>{$LL.AddQuestion()}</span>
                    </button>
                </div>
            {/if}

            <div class="flex {current != 0 ? 'justify-between' : 'justify-end'}">
                {#if current != 0}
                    <button
                        on:click={handleStepBackward}
                        class="flex items-center gap-x-2 text-sm md:text-base font-semibold px-5 py-2 border rounded hover:bg-gray-100"
                        id="buttonReturn"
                    >
                        <svelte:component this={ChevronLeftIcon} strokeWidth={4} size={20} />
                        {$LL.Return()}
                    </button>
                {/if}
                <button
                    on:click={handleStepForward}
                    class="flex items-center gap-x-2 text-sm md:text-base font-semibold px-5 py-2 border rounded bg-blue-500 hover:bg-blue-600 text-white"
                    id="buttonForward"
                >
                    {#if current != steps.length - 1}
                        {$LL.Forward()}
                    {:else}
                        {$LL.Finalize()}
                    {/if}
                    <svelte:component this={ChevronRightIcon} strokeWidth={4} size={20} />
                </button>
            </div>
        </div>
    {/if}
</div>