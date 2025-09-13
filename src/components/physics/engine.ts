// 简易物理引擎：处理小球在旋转六边形中的运动、重力、阻尼、与墙壁碰撞反弹
// 提供面向函数的 API 供组件调用
import type { Ball, Hexagon, PhysicsConfig, Vec2 } from '../../types/physics'
import { add, scale, normalize, dot, vec, sub, project, perp } from '../../utils/vector'

// 生成六边形顶点（按当前 rotation 旋转）
export function getHexagonVertices(hex: Hexagon): Vec2[] {
  const pts: Vec2[] = []
  for (let i = 0; i < 6; i++) {
    const angle = hex.rotation + (Math.PI / 3) * i
    pts.push({
      x: hex.center.x + hex.radius * Math.cos(angle),
      y: hex.center.y + hex.radius * Math.sin(angle)
    })
  }
  return pts
}

interface StepContext {
  ball: Ball
  hex: Hexagon
  cfg: PhysicsConfig
  dt: number
}

// 应用重力与阻尼
function integrateLinear({ ball, cfg, dt }: StepContext) {
  // v = v + g * dt
  ball.vel.x += cfg.gravity.x * dt
  ball.vel.y += cfg.gravity.y * dt
  // 线性阻尼 (指数衰减近似)
  const damp = Math.pow(1 - cfg.linearDamping, dt)
  ball.vel.x *= damp
  ball.vel.y *= damp
  // 位置更新
  ball.pos.x += ball.vel.x * dt
  ball.pos.y += ball.vel.y * dt
}

// 处理与六边形边的碰撞
function resolveCollisions({ ball, hex, cfg }: StepContext) {
  const verts = getHexagonVertices(hex)
  for (let i = 0; i < 6; i++) {
    const a = verts[i]
    const b = verts[(i + 1) % 6]
    const edge = sub(b, a)
    const normal = normalize(perp(edge)) // 左手法线，使得六边形内部 normal 指向内部？
    // 判断点到直线距离（有向），我们希望 normal 指向多边形内侧
    // 检查 normal 方向是否正确：用中心到边中点向量与 normal 点积>0 则 normal 指向外部，需要反转
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    const toCenter = sub(hex.center, mid)
    if (dot(toCenter, normal) < 0) {
      normal.x *= -1
      normal.y *= -1
    }
    // 点到线距离: ( (P - A) · n )
    const dist = dot(sub(ball.pos, a), normal)
    const penetration = ball.radius - dist
    if (penetration > 0) {
      // 修正位置：沿 normal 推开
      ball.pos.x += normal.x * penetration
      ball.pos.y += normal.y * penetration
      // 速度分解
      const vn = project(ball.vel, normal) // 法向分量
      const vt = sub(ball.vel, vn) // 切向分量
      // 反射法向并乘以 restitution
      const reflectedN = scale(vn, -ball.restitution)
      // 切向施加墙壁摩擦 (保留一定比例)
      const tangential = scale(vt, cfg.wallFriction)
      ball.vel = add(reflectedN, tangential)
    }
  }
}

// 单步更新
export function step(ball: Ball, hex: Hexagon, cfg: PhysicsConfig, dt: number) {
  const safeDt = Math.min(dt, cfg.frameInterval * (cfg.maxStepsPerFrame ?? 5))
  const ctx: StepContext = { ball, hex, cfg, dt: safeDt }
  integrateLinear(ctx)
  resolveCollisions(ctx)
}

// 更新六边形旋转
export function rotateHex(hex: Hexagon, dt: number) {
  hex.rotation += hex.angularVelocity * dt
}

// 初始化默认配置
export function defaultConfig(): PhysicsConfig {
  return {
    gravity: vec(0, 500), // px/s^2 向下
    linearDamping: 0.1, // 阻尼
    frameInterval: 1 / 60,
    wallFriction: 0.8,
    maxStepsPerFrame: 5
  }
}
