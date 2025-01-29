import LL from "../i18n/i18n-svelte"

export function getLanguageText(lang: string): string {
    let text: string = ""
    let subscription = LL.subscribe(ll => {
        switch(lang) {
            case "PT":
                text = ll.Language.PT()
                break
            case "EN":
                text = ll.Language.EN()
                break
            case "ES":
                text = ll.Language.ES()
                break
            case "FR":
                text = ll.Language.FR()
                break
            case "PL":
                text = ll.Language.PL()
                break
            default:
                text = "Not supposed to be here"
                break
        }
    })

    subscription()
    return text
}

export function getText(name: string): string {
    let text: string = ""
    let subscription = LL.subscribe(ll => {
        switch(name) {
            case "Categories":
                text = ll.Categories()
                break
            case "Home":
                text = ll.Home()
                break
            case "Permissions":
                text = ll.Permissions()
                break
            case "RatingGroups":
                text = ll.RatingGroups()
                break
            case "Statistics":
                text = ll.Statistics()
                break
            case "Submissions":
                text = ll.Submissions()
                break
            case "Surveys":
                text = ll.Surveys()
                break
            case "Create":
                text = ll.PermissionsType.Create()
                break
            case "Delete":
                text = ll.PermissionsType.Delete()
                break
            case "Patch":
                text = ll.PermissionsType.Patch()
                break
            case "Read":
                text = ll.PermissionsType.Read()
                break
            case "Update":
                text = ll.PermissionsType.Update()
                break
            default:
                text = ll.Error()
                break
        }
    })

    subscription()
    return text
}

export function isCheckboxChecked(langs: string[], lang: string): boolean {
    return langs.includes(lang)
}