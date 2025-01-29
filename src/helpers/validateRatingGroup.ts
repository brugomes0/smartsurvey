import { getLanguageText } from "./action"
import LL from "../i18n/i18n-svelte"

export function validateRatingGroup(ratingGroup: CreateRatingGroupType, step: number, languages: string[]) {
    let message: string = ""

    if (step == 0) {
        if (ratingGroup.title === "") return message = errorMessage("ratingGroupTitle")
        if (languages.length === 0) return message = errorMessage("noLanguages")
    }
}

function errorMessage(type: string, language?: string): string {
    let errorMessage: string = ""
    let subscription = LL.subscribe(ll => {
        switch(type) {
            case "noLanguages":
                errorMessage = ll.ErrorType.NoLanguagesChoice()
                break
            case "ratingGroupTitle":
                errorMessage = ll.ErrorType.NoRatingGroupTitle()
                break
            default:
                errorMessage = ll.Error()
                break
        }
    })

    subscription()
    return errorMessage
}