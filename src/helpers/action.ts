import LL from "../i18n/i18n-svelte"

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