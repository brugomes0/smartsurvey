<script lang="ts">
	import { API_URL } from "./stores/apiStore"
	import { ActivityIcon, BadgeInfoIcon, BadgeXIcon, ChartLineIcon, ClipboardIcon, HomeIcon, LayoutListIcon, ListIcon, PenSquareIcon, ShieldIcon, UsersIcon } from "lucide-svelte"
	import { baseLocale, isLocale } from "./i18n/i18n-util"
	import { deleteCookie, getCookie, setCookie } from "./helpers/cookie"
	import { loadAllLocales } from "./i18n/i18n-util.sync"
    import { onMount } from "svelte"
	import { requestToApi, requestTokens } from "./helpers/api"
	import { Route, Router } from "svelte-routing"
	import { Toaster } from "svelte-french-toast"
	import Categories from "./components/Categories.svelte"
	import Header from "./components/Header.svelte"
	import LL, { setLocale } from "./i18n/i18n-svelte"
	import NotFound from "./components/NotFound.svelte"
	import Permissions from "./components/Permissions.svelte"
	import Sidebar from "./components/Sidebar.svelte"
	import Tailwind from "./components/Tailwind.svelte"
	import type { Locales } from "./i18n/i18n-types"

	export let authToken: string
	export let baseUrl: string
	export let lang: string = "PT"

	let loading: boolean = true
	let menuBackoffice = [
		{ name: "Home", endpoint: "/", icon: HomeIcon, permission: true },
		{ name: "Surveys", endpoint: "/surveys", icon: ClipboardIcon, permission: false },
		{ name: "Categories", endpoint: "/categories", icon: LayoutListIcon, permission: false },
		{ name: "RatingGroups", endpoint: "/ratingGroups", icon: ListIcon, permission: false },
		{ name: "Statistics", endpoint: "/statistics", icon: ChartLineIcon, permission: false },
		{ name: "Permissions", endpoint: "/permissions", icon: ShieldIcon, permission: false }
	]
	let menuFrontOffice = [
		{ name: "Home", endpoint: "/", icon: HomeIcon, permission: true },
		{ name: "Submissions", endpoint: "/submissions", icon: PenSquareIcon, permission: true },
		{ name: "Performance", endpoint: "/performance", icon: ActivityIcon, permission: true },
		{ name: "Team", endpoint: "/team", icon: UsersIcon, permission: true }
	]
	let sidebar: boolean = false
	let token: { accessToken: string, refreshToken: string } = { accessToken: "", refreshToken: "" }
	let user: UserType

	function safeSetLocale(locale: string) {
		if (isLocale(locale)) {
			setLocale(locale as Locales)
		} else {
			console.log(`Locale not found. Falling back to ${baseLocale}`)
			setLocale(baseLocale)
		}
	}

	onMount(async () => {
		API_URL.update((temp: any) => temp = baseUrl)

		if (authToken) {
			authToken = encodeURIComponent(authToken)
			deleteCookie("ss_at")
			deleteCookie("ss_rt")
			let response = await requestTokens(authToken)
			if (response.statusCode === 200) {
				token.accessToken = response.data.token
				token.refreshToken = response.data.refreshToken
				setCookie("ss_at", token.accessToken)
				setCookie("ss_rt", token.refreshToken)
			}
		} else {
			token.accessToken = getCookie("ss_at") ?? ""
			token.refreshToken = getCookie("ss_rt") ?? ""
		}

		if (token.accessToken !== "" && token.refreshToken !== "") {
			let responseUser = await requestToApi("GET", "Users/Me")
			if (responseUser.statusCode === 200) user = responseUser.data
		}

		if (user && user.profileType === "Backoffice") {
			menuBackoffice.forEach(item => {
				if (item.name == "Home") return

				const module = user.authorizations.find(temp => temp.moduleType == "SmartSurvey")
				const windowPermissions = module?.windowPermissions.find(temp => temp.windowType == item.name)
				const permission = windowPermissions?.permissions.find(temp => temp.permissionType == "Read")

				if (permission?.hasPermission) item.permission = true
			})
		} else if (user && user.profileType === "Frontoffice" && user.isSuperior == true) {
			menuFrontOffice = menuFrontOffice.map(item => item.name == "Team" ? { ...item, permission: true } : item)
		}

		loading = false
	})

	loadAllLocales()
	safeSetLocale(lang.toLowerCase().slice(0, 2) as Locales)
</script>

<Tailwind />
<Toaster />

{#if loading}
	<div class="flex flex-col items-center justify-center min-h-screen">
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
	{#if user && user.profileType === "Backoffice"}
		<Router>
			<main class="flex min-h-screen">
				{#if sidebar}
					<div class="fixed 2xl:hidden inset-0 bg-black bg-opacity-50 z-30"></div>
					<Sidebar menu={menuBackoffice} bind:sidebar {user} />
				{/if}
				<div class="flex flex-col flex-1 items-center {sidebar ? '2xl:ml-[250px]' : ''}">
					<Header bind:sidebar bind:user />
					<div class="flex flex-col flex-1 items-center w-full">
						<div class="flex flex-col flex-1 items-center max-w-[1400px] w-full p-[10px] lg:p-5">
							<Route path="/categories" component={Categories} {user} />
							<Route path="/permissions" component={Permissions} {user} />
							<Route component={NotFound} />
						</div>
					</div>
				</div>
			</main>
		</Router>
	{:else if user && user.profileType === "Frontoffice"}
		<p>frontoffice</p>
	{:else if user}
		<div class="flex flex-col gap-y-5 items-center justify-center min-h-screen">
			<svelte:component this={BadgeInfoIcon} class="w-16 h-16 text-black" strokeWidth={1.5} />
			<div class="flex flex-col gap-y-2 items-center justify-center max-w-80">
				<p class="font-semibold text-center">{$LL.NoProfileUser()}</p>
				<p class="font-light text-center text-sm text-gray-400">{$LL.NoProfileUserText()}</p>
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-y-5 items-center justify-center min-h-screen">
			<svelte:component this={BadgeXIcon} class="w-16 h-16 text-black" strokeWidth={1.5} />
			<div class="flex flex-col gap-y-2 items-center justify-center max-w-80">
				<p class="font-semibold text-center">{$LL.NoLogin()}</p>
				<p class="font-light text-center text-sm text-gray-400">{$LL.NoLoginText()}</p>
			</div>
		</div>
	{/if}
{/if}