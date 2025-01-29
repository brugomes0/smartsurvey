import { getCookie, setCookie } from "./cookie"
import { getUrl } from "../stores/apiStore"

export async function requestNewTokens() {
    let apiUrl = getUrl()

    let response = await fetch(`${apiUrl}Accounts`, {
        credentials: "include",
        method: "POST",
    })
}

export async function requestToApi(method: string, endpoint: string, body?: any) {
    let apiUrl = getUrl()

    let response = await fetch(`${apiUrl}` + endpoint, {
        credentials: "include",
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: body && JSON.stringify(body)
    })
    let responseJson = await response.json()
    if (responseJson.error === "Token has expired") {
        await requestNewTokens()
        requestToApi(method, endpoint, body)
    }

    return responseJson
}

export async function requestTokens(authToken: string) {
    let apiUrl = getUrl()

    try {
        let response = await fetch(`${apiUrl}Accounts?token=${authToken}`, {
            credentials: "include",
            method: "GET"
        })
        let responseJson = await response.json()
        return responseJson
    } catch (err) {
        console.error(err)
    }
}

// export async function requestNewTokens() {
//     let apiUrl = getUrl()
//     let accessToken = getCookie("ss_at") ?? ""
//     let refreshToken = getCookie("ss_rt") ?? ""

//     refreshToken = encodeURIComponent(refreshToken)
//     let response = await fetch(`${apiUrl}Accounts?refreshToken=${refreshToken}`, {
//         method: "POST",
//         headers: {
//             "Authorizations": "Bearer " + accessToken,
//             "Content-Type": "application/json"
//         }
//     })

//     if (response.status === 200) {
//         let responseJson = await response.json()
//         setCookie("ss_at", responseJson.data.token)
//         setCookie("ss_rt", responseJson.data.refreshToken)
//     }
// }

// export async function requestToApi(method: string, endpoint: string, body?: any) {
//     let apiUrl = getUrl()
//     let accessToken = getCookie("ss_at") ?? ""

//     let response = await fetch(`${apiUrl}` + endpoint, {
//         method: method,
//         headers: {
//             'Authorization': 'Bearer ' + accessToken,
//             'Content-Type': 'application/json'
//         },
//         body: body && JSON.stringify(body)
//     })

//     let responseJson = await response.json()
//     if (responseJson.error === "Token has expired") {
//         let refreshToken = getCookie("ss_rt") ?? ""
//         refreshToken = encodeURIComponent(refreshToken)

//         await requestNewTokens()

//         accessToken = getCookie("ss_at") ?? ""
//         refreshToken = getCookie("ss_rt") ?? ""

//         let response = await fetch(`${apiUrl}` + endpoint, {
//             method: method,
//             headers: {
//                 'Authorization': 'Bearer ' + accessToken,
//                 'Content-Type': 'application/json'
//             },
//             body: body && JSON.stringify(body)
//         })

//         let responseJson = await response.json()
//         return responseJson
//     }

//     return responseJson
// }

// export async function requestTokens(authToken: string) {
//     let apiUrl = getUrl()
//     let response = await fetch(`${apiUrl}Accounts?token=${authToken}`)
//     let responseJson = await response.json()
//     return responseJson
// }