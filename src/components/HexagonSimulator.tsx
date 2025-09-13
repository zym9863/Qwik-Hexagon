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
      
      // Add subtle background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      )
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)')
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0.02)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw hexagon with enhanced styling
      const hex = hexSig.value
      const verts = getHexagonVertices(hex)
      ctx.save()
      
      // Hexagon shadow
      ctx.shadowColor = 'rgba(99, 102, 241, 0.3)'
      ctx.shadowBlur = 15
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 5
      
      // Hexagon fill
      ctx.fillStyle = 'rgba(99, 102, 241, 0.1)'
      ctx.beginPath()
      verts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      })
      ctx.closePath()
      ctx.fill()
      
      // Reset shadow for stroke
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      
      // Hexagon stroke with gradient
      const strokeGradient = ctx.createLinearGradient(verts[0].x, verts[0].y, verts[3].x, verts[3].y)
      strokeGradient.addColorStop(0, '#6366f1')
      strokeGradient.addColorStop(0.5, '#8b5cf6')
      strokeGradient.addColorStop(1, '#6366f1')
      
      ctx.lineWidth = 4
      ctx.strokeStyle = strokeGradient
      ctx.beginPath()
      verts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      })
      ctx.closePath()
      ctx.stroke()

      // Draw ball with enhanced effects
      const ball = ballSig.value
      
      // Ball shadow
      ctx.shadowColor = 'rgba(245, 158, 11, 0.4)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 3
      ctx.shadowOffsetY = 8
      
      // Ball gradient
      const ballGradient = ctx.createRadialGradient(
        ball.pos.x - ball.radius * 0.3, ball.pos.y - ball.radius * 0.3, 0,
        ball.pos.x, ball.pos.y, ball.radius
      )
      ballGradient.addColorStop(0, '#fbbf24')
      ballGradient.addColorStop(0.7, '#f59e0b')
      ballGradient.addColorStop(1, '#d97706')
      
      ctx.fillStyle = ballGradient
      ctx.beginPath()
      ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2)
      ctx.fill()
      
      // Ball highlight
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      
      const highlightGradient = ctx.createRadialGradient(
        ball.pos.x - ball.radius * 0.4, ball.pos.y - ball.radius * 0.4, 0,
        ball.pos.x - ball.radius * 0.4, ball.pos.y - ball.radius * 0.4, ball.radius * 0.6
      )
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx.fillStyle = highlightGradient
      ctx.beginPath()
      ctx.arc(ball.pos.x - ball.radius * 0.3, ball.pos.y - ball.radius * 0.3, ball.radius * 0.4, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      // Enhanced text information with better styling
      ctx.save()
      ctx.fillStyle = 'rgba(99, 102, 241, 0.8)'
      ctx.font = 'bold 14px Inter, system-ui, sans-serif'
      ctx.textAlign = 'left'
      
      // Background for text
      const textBg = ctx.createLinearGradient(0, 0, 200, 0)
      textBg.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
      textBg.addColorStop(1, 'rgba(255, 255, 255, 0.7)')
      ctx.fillStyle = textBg
      ctx.fillRect(8, 8, 220, 60)
      
      // Text border
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'
      ctx.lineWidth = 1
      ctx.strokeRect(8, 8, 220, 60)
      
      // Text content
      ctx.fillStyle = '#374151'
      ctx.fillText(`⚡ 速度: (${ball.vel.x.toFixed(1)}, ${ball.vel.y.toFixed(1)})`, 15, 28)
      ctx.fillText(`🔄 角度: ${(hex.rotation * 180 / Math.PI).toFixed(1)}°`, 15, 48)
      ctx.fillText(`🎯 位置: (${ball.pos.x.toFixed(0)}, ${ball.pos.y.toFixed(0)})`, 15, 63)
      
      ctx.restore()
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
    <div style={{ 
      textAlign: 'center', 
      marginTop: '2rem',
      padding: '2rem',
      background: 'var(--card-background)',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--card-border)',
      backdropFilter: 'blur(10px)',
      boxShadow: 'var(--shadow-soft)',
      transition: 'var(--transition)'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: '600'
      }}>
        物理模拟演示
      </h2>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: (props.width ?? 480) + 'px', 
          height: (props.height ?? 480) + 'px', 
          border: '2px solid var(--card-border)', 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.1), var(--shadow-soft)',
          transition: 'var(--transition)'
        }} 
      />
      <div style={{
        marginTop: '1rem',
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.7)',
        fontFamily: 'monospace'
      }}>
        <p style={{ margin: '0.5rem 0' }}>🎯 重力影响下的弹性碰撞模拟</p>
        <p style={{ margin: '0.5rem 0' }}>⚡ 实时物理引擎驱动</p>
        <p style={{ margin: '0.5rem 0' }}>🌟 现代化视觉效果</p>
      </div>
    </div>
  )
})
