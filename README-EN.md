[中文版本](README.md)

# Qwik + Vite

## Rotating Hexagon with Bouncing Ball Example (New)

This project demonstrates a ball bouncing inside a **rotating regular hexagon** under gravity:
- Supports gravity acceleration, linear damping (air friction), wall friction (tangential velocity decay), and restitution coefficient
- The hexagon rotates at constant speed, and the ball collides with the edges at the current rotation position in real-time
- Uses `requestAnimationFrame` + adaptive time stepping (splitting large dt) for stability
- Implements a functional minimalist "semi-physics engine" (file: `src/components/physics/engine.ts`)

### Key Files
| File | Description |
| ---- | ---- |
| `src/components/HexagonSimulator.tsx` | Canvas rendering and animation main loop |
| `src/components/physics/engine.ts` | Hexagon vertex calculation, integration, collision, and rebound logic |
| `src/utils/vector.ts` | Vector basic operations utility |
| `src/types/physics.ts` | Physics-related type definitions |

### Parameter Adjustment
Import the component in `App`:
```tsx
<HexagonSimulator hexRadius={180} hexAngularVelocity={Math.PI / 6} />
```
Available props:
- `hexRadius` (number) Hexagon radius (circumradius), default `180`
- `hexAngularVelocity` (number) Hexagon angular velocity (radians/second), default `Math.PI / 6`

For further control: modify within `defaultConfig()`:
```ts
gravity: vec(0, 500)      // Gravity acceleration px/s^2
linearDamping: 0.1        // Linear damping (0-1), higher means more decay
wallFriction: 0.8         // Tangential velocity retention ratio after wall collision (0-1)
maxStepsPerFrame: 5       // Prevent penetration at low frame rates
```
`Ball.restitution` (ball's restitution coefficient) is set in `HexagonSimulator` initialization, default `0.85`.

### Running
```bash
pnpm install
pnpm run dev
```
Open the browser and visit the address output by the terminal to see the simulation.

### Physics Processing Explanation
1. Integration: Explicit Euler + exponential damping approximation
2. Collision Detection: Signed distance from ball center to each edge; if less than ball radius, penetration is detected
3. Collision Response:
   - Position pushed back along normal (minimum separation)
   - Velocity decomposed into normal + tangential
   - Normal component reversed and multiplied by `restitution`
   - Tangential component multiplied by `wallFriction` for friction/energy loss
4. Hexagon Rotation: Update `rotation` each frame, vertices recalculated dynamically

### Future Extension Suggestions
- Add multiple balls + ball-ball collision
- Support variable angular velocity (acceleration or easing)
- Add energy statistics and UI control panel (adjust gravity/friction/restitution)
- Use semi-implicit Euler or Verlet for better high-energy state stability
- Add "drag and launch" interaction