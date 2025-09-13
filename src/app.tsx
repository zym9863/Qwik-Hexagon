import { component$ } from '@builder.io/qwik'

import './app.css'
import { HexagonSimulator } from './components/HexagonSimulator'
import { ThemeToggle } from './components/ThemeToggle'

export const App = component$(() => {
  return (
    <>
      <ThemeToggle />
      <div class="app-header">
        <h1>六边形物理模拟器</h1>
        <p class="app-description">一个旋转六边形内弹跳小球的物理模拟演示</p>
      </div>
      <HexagonSimulator hexRadius={180} hexAngularVelocity={Math.PI / 6} />
    </>
  )
})
