[English Version](README-EN.md)

# Qwik + Vite

## 旋转六边形内弹跳小球示例 (新增)

本项目演示了一个在**旋转的正六边形**内部受重力影响弹跳的小球：
- 支持重力加速度、线性阻尼(空气摩擦)、墙面摩擦(切向速度衰减)与弹性系数
- 六边形匀速旋转，球与当前旋转位置的边实时碰撞
- 使用 `requestAnimationFrame` + 自适应时间步（拆分大 dt）保证稳定性
- 采用函数式极简“半物理引擎”实现（文件：`src/components/physics/engine.ts`）

### 关键文件
| 文件 | 说明 |
| ---- | ---- |
| `src/components/HexagonSimulator.tsx` | Canvas 渲染与动画主循环 |
| `src/components/physics/engine.ts` | 六边形顶点计算、积分、碰撞与反弹逻辑 |
| `src/utils/vector.ts` | 向量基础运算工具 |
| `src/types/physics.ts` | 物理相关类型定义 |

### 参数调整
在 `App` 中引入组件：
```tsx
<HexagonSimulator hexRadius={180} hexAngularVelocity={Math.PI / 6} />
```
可用 props：
- `hexRadius` (number) 六边形半径（外接圆半径），默认 `180`
- `hexAngularVelocity` (number) 六边形角速度 (弧度/秒)，默认 `Math.PI / 6`

如需进一步控制：可以修改 `defaultConfig()` 内：
```ts
gravity: vec(0, 500)      // 重力加速度 px/s^2
linearDamping: 0.1        // 线性阻尼 (0-1) 越大衰减越明显
wallFriction: 0.8         // 与墙碰撞后切向速度保留比例 (0-1)
maxStepsPerFrame: 5       // 防止低帧率时穿透
```
`Ball.restitution`（球的弹性系数）在 `HexagonSimulator` 初始化处设置，默认 `0.85`。

### 运行
```bash
pnpm install
pnpm run dev
```
打开浏览器访问终端输出的地址即可看到模拟效果。

### 物理处理说明
1. 积分：显式欧拉 + 指数阻尼近似
2. 碰撞检测：球心到每条边的**有向距离**，若小于球半径即判定穿透
3. 碰撞响应：
   - 位置沿法线推回 (最小分离)
   - 速度分解为法向 + 切向
   - 法向分量反向并乘以 `restitution`
   - 切向分量乘以 `wallFriction` 作为摩擦/能量损失
4. 六边形旋转：每帧更新 `rotation`，顶点动态重算

### 后续可扩展建议
- 增加多个球 + 球-球碰撞
- 支持可变角速度（加速度或缓动）
- 加入能量统计与 UI 控制面板 (调节重力/摩擦/弹性)
- 使用半隐式 Euler 或 Verlet 改善高能状态稳定性
- 增加“拖拽发射”交互
