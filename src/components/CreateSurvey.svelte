<script lang="ts">
    import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, FilePlus2Icon } from "lucide-svelte"
    import { Steps } from "svelte-steps"
    import { getLanguageText } from "../helpers/action"
    import { navigate } from "svelte-routing"
    import { requestToApi } from "../helpers/api"
    import { validateSurvey } from "../helpers/validateSurvey"
    import LL from "../i18n/i18n-svelte"
    import SveltyPicker from "svelty-picker"
    import toast from "svelte-french-toast"

    let current: number = 0
    let languagesChoosen: string[] = []
    let languagesList: string[] = ["PT", "EN", "ES", "FR", "PL"]
    let steps = [
        { text: $LL.Steps.Details() },
        { text: $LL.Steps.Template() },
        { text: $LL.Steps.Employees() },
        { text: $LL.Steps.Activate() }
    ]
    let survey: CreateSurveyType = {
        title: "",
        description: "",
        endDate: null,
        template: { availableLangs: [], categories: [] },
        surveyEmployeeIds: []
    }

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
            createSurvey()
        }
    }

    async function createSurvey() {
        let response = await requestToApi("POST", `SmartSurvey/Surveys`, survey)
        if (response.statusCode === 201) {
            toast.success($LL.CreatedSurveySaved())
            navigate("/surveys")
        } else if (response.details === "Survey with this title already exists.") {
            document.getElementById("buttonForward")?.removeAttribute("disabled")
            toast.error($LL.CreatedSurveySameTitle())
        } else {
            document.getElementById("buttonForward")?.removeAttribute("disabled")
            toast.error($LL.CreatedSurveyFailed())
        }
    }

    function checkStep(step: number) {
        let message = validateSurvey(survey, step, languagesChoosen)
        if (message != null && message != "") {
            toast.error(message)
            return false
        }

        if (step === 0) {
            languagesChoosen.sort((a, b) => languagesList.indexOf(a) - languagesList.indexOf(b))
            survey.template.availableLangs = languagesChoosen
        }

        return true
    }

    function handleStepClick(step: number, nextStep: number) {
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
</script>

<div class="flex flex-col gap-y-5 w-full">
    <div class="flex flex-col md:flex-row gap-x-5 items-center">
        <div class="block">
            <svelte:component this={FilePlus2Icon} class="text-blue-500" size="90" />
        </div>
        <div class="flex flex-col gap-y-2">
            <span class="font-semibold text-center md:text-left text-lg md:text-2xl text-blue-500">{$LL.CreateSurvey()}</span>
            <span class="text-center md:text-left text-sm text-gray-400">{$LL.CreateSurveyDescription()}</span>
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
                <span class="font-semibold text-base text-black">{$LL.SurveyTitle()}</span>
                <span class="text-xs text-gray-400">{$LL.SurveyTitleText()}</span>
                <input
                    bind:value={survey.title}
                    class="border my-1 p-2 peer rounded text-xs w-auto text-black"
                    maxlength="100"
                    name="titleSurvey"
                />
            </div>
            <div class="flex flex-col">
                <span class="font-semibold text-base text-black">{$LL.SurveyDescription()}</span>
                <span class="text-xs text-gray-400">{$LL.SurveyDescriptionText()}</span>
                <textarea
                    bind:value={survey.description}
                    class="border my-1 p-2 peer rounded text-xs w-auto text-black"
                    maxlength="300"
                    name="descriptionSurvey"
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

        </div>
    {:else if current == 3}
        <div class="flex flex-col gap-y-5">
            <div class="flex flex-col">
                <span class="font-semibold text-base text-black">{$LL.ActivateSurvey()}</span>
                <span class="text-xs text-gray-400">{$LL.ActivateSurveyText()}</span>
            </div>
            <div class="flex gap-x-2 items-center">
                <svelte:component this={CalendarDaysIcon} size={20} />
                <SveltyPicker bind:value={survey.endDate} format="yyyy-mm-dd hh:ii" inputClasses="border p-2 rounded bg-gray-100 border-gray-300" />
            </div>
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