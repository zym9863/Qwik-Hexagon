// 向量基础运算工具函数
// 提供函数级注释便于复用
import type { Vec2 } from '../types/physics'

export const vec = (x = 0, y = 0): Vec2 => ({ x, y })
export const clone = (v: Vec2): Vec2 => ({ x: v.x, y: v.y })
export const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y })
export const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y })
export const scale = (v: Vec2, s: number): Vec2 => ({ x: v.x * s, y: v.y * s })
export const dot = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y
export const length = (v: Vec2): number => Math.hypot(v.x, v.y)
export const normalize = (v: Vec2): Vec2 => {
  const len = length(v)
  if (len === 0) return { x: 0, y: 0 }
  return { x: v.x / len, y: v.y / len }
}
export const project = (v: Vec2, n: Vec2): Vec2 => {
  // 投影到 n (不要求 n 单位化)
  const nn = normalize(n)
  const k = dot(v, nn)
  return scale(nn, k)
}
export const perp = (v: Vec2): Vec2 => ({ x: -v.y, y: v.x })
