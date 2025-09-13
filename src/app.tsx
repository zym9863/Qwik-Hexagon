import { component$, useSignal } from '@builder.io/qwik'

import qwikLogo from './assets/qwik.svg'
import viteLogo from '/vite.svg'
import './app.css'
import { HexagonSimulator } from './components/HexagonSimulator'
import { ThemeToggle } from './components/ThemeToggle'

export const App = component$(() => {
  const count = useSignal(0)

  return (
    <>
      <ThemeToggle />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://qwik.dev" target="_blank">
          <img src={qwikLogo} class="logo qwik" alt="Qwik logo" />
        </a>
      </div>
      <h1>Vite + Qwik + Physics</h1>
      <div class="card">
        <button onClick$={() => count.value++}>count is {count.value}</button>
      </div>
      <p class="read-the-docs">下面是一个旋转六边形内弹跳小球的示例。</p>
      <HexagonSimulator hexRadius={180} hexAngularVelocity={Math.PI / 6} />
    </>
  )
})
