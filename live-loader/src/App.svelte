<script lang="ts">
    import { GM_deleteValue, GM_getValue, GM_setValue } from '$'
    import { fly } from 'svelte/transition'
    import { watch } from './watch.svelte.ts'

    const customStyle = document.createElement('style')
    document.head.appendChild(customStyle)

    const files = import.meta.glob('../../*.css', { query: '?raw', import: 'default' })
    const fileNames = Object.keys(files).map((filename) => filename.replace('../../', ''))

    let selected = $state<string | undefined>(GM_getValue('selected'))
    watch(
        () => selected,
        (value) => {
            if (!value) {
                GM_deleteValue('selected')
                customStyle.textContent = ''
                return
            }

            const importer = files[`../../${value}`] as () => Promise<string>
            if (!importer) {
                selected = undefined
                return
            }

            GM_setValue('selected', value)
            importer().then((css) => {
                customStyle.textContent = css
            })
        },
    )
</script>

<div
    class="tw-fixed tw-right-0 tw-top-0 tw-z-50 tw-flex tw-w-48 tw-gap-3 tw-p-4"
    transition:fly={{ duration: 100, opacity: 0, y: -100 }}
>
    <select
        class="tw-focus:tw-border-[#4e41db] tw-focus:tw-outline-none tw-w-full tw-rounded-lg tw-border tw-border-[#dddddd] tw-p-2"
        bind:value={selected}
    >
        <option value={undefined}>기본 CSS</option>
        {#each fileNames as file}
            <option>{file}</option>
        {/each}
    </select>
</div>

<style lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
