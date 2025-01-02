<script lang="ts">
    import { CircleUserRoundIcon, XIcon } from "lucide-svelte"
    import { fly } from "svelte/transition"
    import { getText } from "../helpers/action"
    import { Link } from "svelte-routing"
    import LL from "../i18n/i18n-svelte"

    export let menu: any
    export let sidebar: boolean
    export let user: UserType

    function handleClick() {
        const mediaQuery = window.matchMedia('(max-width: 1535px)')
        if (mediaQuery.matches) { sidebar = false }
    }
</script>

<nav transition:fly={{ delay: 0, duration: 200, x: -50 }} class="border-r fixed flex flex-col min-h-screen w-[250px] z-30 bg-gray-50 border-gray-300">
    <div class="hidden 2xl:flex h-auto px-3 py-5 bg-gray-200">
        <div class="flex gap-x-2 items-center">
            <svelte:component this={CircleUserRoundIcon} class="h-14 w-14" strokeWidth={1.5} />
            <div class="flex flex-col justify-center">
                <p class="font-semibold">{$LL.Hello()}</p>
                <p class="line-clamp-1 cursor-pointer">
                    {#if user && user.userName}
                        <p class="text-sm" title="{user.userName}">{user.userName}</p>
                    {:else}
                        <p class="text-sm">{$LL.User()}</p>
                    {/if}
                </p>
            </div>
        </div>
    </div>

    <div class="flex 2xl:hidden items-center justify-end p-2">
        <button on:click={() => sidebar = false} class="hover:bg-gray-200 rounded">
            <svelte:component this={XIcon} />
        </button>
    </div>

    <div class="flex flex-col items-center justify-center mx-5 mb-5 2xl:m-5 border-b border-gray-300">
        <p class="font-medium text-sm pb-3">{user.profileType == "Backoffice" ? $LL.BackofficeMenu() : $LL.FrontofficeMenu()}</p>
    </div>

    <div class="flex flex-col">
        {#each menu as item}
            {#if item.permission}
                <Link
                    on:click={handleClick}
                    class="flex items-center justify-between h-10 px-3 cursor-pointer hover:font-semibold hover:bg-gray-200"
                    to={item.endpoint}
                >
                    <div class="flex gap-x-2 items-center">
                        <svelte:component this={item.icon} />
                        <p>{getText(item.name)}</p>
                    </div>
                </Link>
            {/if}
        {/each}
    </div>
</nav>