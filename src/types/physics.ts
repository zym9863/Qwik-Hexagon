// 物理相关类型定义
// 向量接口
export interface Vec2 {
  x: number
  y: number
}

// 小球状态
export interface Ball {
  pos: Vec2
  vel: Vec2
  radius: number
  restitution: number // 弹性系数 0-1
}

// 六边形容器参数
export interface Hexagon {
  center: Vec2
  radius: number // 外接圆半径
  rotation: number // 当前旋转角度 (弧度)
  angularVelocity: number // 旋转角速度 (弧度/秒)
}

// 物理世界参数
export interface PhysicsConfig {
  gravity: Vec2 // 重力加速度
  linearDamping: number // 线性阻尼(空气摩擦) 0-1 (每秒衰减系数)
  frameInterval: number // 期望帧间隔 (秒)
  wallFriction: number // 与墙壁接触产生的切向速度衰减系数 (0-1 保留比例)
  maxStepsPerFrame?: number // 防止大 dt 爆炸
}
