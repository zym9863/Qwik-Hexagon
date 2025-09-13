import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import type { Ball, Hexagon } from '../types/physics'
import { defaultConfig, rotateHex, step, getHexagonVertices } from './physics/engine'
import { vec } from '../utils/vector'

// 可调参数接口
interface SimulatorProps {
  width?: number
  height?: number
  hexRadius?: number
  hexAngularVelocity?: number // 弧度/秒
}

/**
 * HexagonSimulator 组件
 * 在一个旋转的正六边形内部模拟受重力下落并与墙壁弹性碰撞的球体。
 * - 使用 canvas 渲染
 * - 使用 requestAnimationFrame 驱动
 * - 支持墙面随角速度旋转
 */
export const HexagonSimulator = component$<SimulatorProps>((props) => {
  const canvasRef = useSignal<HTMLCanvasElement>()
  // 初始化球 & 六边形 & 配置
  const cfg = defaultConfig()
  const ballSig = useSignal<Ball>({
    pos: vec(0, 0),
    vel: vec(120, 0),
    radius: 18,
    restitution: 0.85
  })
  const hexSig = useSignal<Hexagon>({
    center: vec(0, 0),
    radius: props.hexRadius ?? 180,
    rotation: 0,
    angularVelocity: props.hexAngularVelocity ?? Math.PI / 6 // 30°/s
  })

  const lastTime = useSignal<number>(0)

  useVisibleTask$(({ cleanup }) => {
    const canvas = canvasRef.value!
    const ctx = canvas.getContext('2d')!

    function resize() {
      canvas.width = props.width ?? 480
      canvas.height = props.height ?? 480
      hexSig.value.center = vec(canvas.width / 2, canvas.height / 2)
      // 初始球位置在上方
      ballSig.value.pos = vec(canvas.width / 2 + 40, canvas.height / 2 - 120)
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // 绘制六边形
      const hex = hexSig.value
      const verts = getHexagonVertices(hex)
      ctx.save()
      ctx.lineWidth = 3
      ctx.strokeStyle = '#888'
      ctx.beginPath()
      verts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      })
      ctx.closePath()
      ctx.stroke()

      // 绘制球
      const ball = ballSig.value
      ctx.fillStyle = '#ff8c00'
      ctx.beginPath()
      ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      // 文本信息
      ctx.fillStyle = '#333'
      ctx.font = '14px monospace'
      ctx.fillText(`速度: (${ball.vel.x.toFixed(1)}, ${ball.vel.y.toFixed(1)})`, 10, 20)
      ctx.fillText(`角度: ${(hex.rotation * 180 / Math.PI).toFixed(1)}°`, 10, 40)
    }

    function loop(ts: number) {
      if (!lastTime.value) lastTime.value = ts
      const dtMs = ts - lastTime.value
      lastTime.value = ts
      let dt = dtMs / 1000
      // 拆分大时间步
      const frame = cfg.frameInterval
      while (dt > 0) {
        const stepDt = Math.min(frame, dt)
        rotateHex(hexSig.value, stepDt)
        step(ballSig.value, hexSig.value, cfg, stepDt)
        dt -= stepDt
      }
      draw()
      requestAnimationFrame(loop)
    }
    const id = requestAnimationFrame(loop)

    cleanup(() => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', resize)
    })
  })

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} style={{ width: props.width ?? 480 + 'px', height: props.height ?? 480 + 'px', border: '1px solid #ccc', background: '#fafafa' }} />
    </div>
  )
})
