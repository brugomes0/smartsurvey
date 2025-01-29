import { getLanguageText } from "./action"
import LL from "../i18n/i18n-svelte"

export function validateCategory(category: CreateCategoryType, step: number) {
    let message: string = ""

    if (step == 0) {
        for (let translation of category.translations) {
            if (translation.title === "") return message = errorMessage("categoryTitle", getLanguageText(translation.language))
        }
    } else {
        if (step == 2 && category.questions.length == 0) return message = errorMessage("noQuestions")
        
        for (let question of category.questions) {
            for (let translation of question.translations) {
                if (step == 1 && question.type == "Rating" && translation.title == "") return message = errorMessage("ratingQuestionTitle", translation.language)
                if (step == 2 && question.type == "Text" && translation.title == "") return message = errorMessage("textQuestionTitle", translation.language)
            }
        }
    }
    
    return message
}

function errorMessage(type: string, language?: string): string {
    let errorMessage: string = ""
    let subscription = LL.subscribe(ll => {
        switch(type) {
            case "categoryTitle":
                errorMessage = ll.ErrorType.NoCategoryTitle({ language })
                break
            case "noQuestions":
                errorMessage = ll.ErrorType.NoQuestions()
                break
            case "ratingQuestionTitle":
                errorMessage = ll.ErrorType.NoRatingQuestionTitle({ language })
                break
            case "textQuestionTitle":
                errorMessage = ll.ErrorType.NoTextQuestionTitle({ language })
            default:
                errorMessage = ll.Error()
                break
        }
    })

    subscription()
    return errorMessage
}