import LL from "../i18n/i18n-svelte"

export function validateSurvey(survey: CreateSurveyType, step: number, langs: string[]) {
    let message: string = ""

    if (step == 0) {
        if (survey.title === "") return message = errorMessage("surveyTitle")
        if (langs.length === 0) return message = errorMessage("noLanguages")
    }
}

function errorMessage(type: string) {
    let errorMessage: string = ""
    let subscription = LL.subscribe(ll => {
        switch (type) {
            case "noLanguages":
                errorMessage = ll.ErrorType.NoLanguagesChoice()
                break
            case "surveyTitle":
                errorMessage = ll.ErrorType.NoSurveyTitle()
                break
            default:
                errorMessage = ll.Error()
                break
        }
    })

    subscription()
    return errorMessage
}