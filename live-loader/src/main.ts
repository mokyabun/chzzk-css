import { mount } from 'svelte'
import Modal from './App.svelte'

const app = mount(Modal, {
    target: (() => {
        const app = document.createElement('div')
        document.body.appendChild(app)
        return app
    })(),
})

export default app
