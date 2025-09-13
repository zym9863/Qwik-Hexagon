import { component$, type Signal } from '@builder.io/qwik'
import type { Ball, Hexagon, PhysicsConfig } from '../types/physics'

interface ControlPanelProps {
  ball: Signal<Ball>
  hex: Signal<Hexagon>
  config: PhysicsConfig
  onGravityChange: (gravity: number) => void
  onDampingChange: (damping: number) => void
  onFrictionChange: (friction: number) => void
  onRestitutionChange: (restitution: number) => void
  onAngularVelocityChange: (velocity: number) => void
  onResetBall: () => void
}

export const ControlPanel = component$<ControlPanelProps>((props) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem',
      padding: '2rem',
      background: 'var(--card-background)',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--card-border)',
      backdropFilter: 'blur(10px)',
      boxShadow: 'var(--shadow-soft)'
    }}>
      <h3 style={{
        gridColumn: '1 / -1',
        fontSize: '1.3rem',
        margin: '0 0 1rem 0',
        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        🎛️ 物理参数控制面板
      </h3>

      {/* Gravity Control */}
      <div style={{ minWidth: '200px' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          🌍 重力强度: {props.config.gravity.y.toFixed(0)} px/s²
        </label>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={props.config.gravity.y}
          onInput$={(e) => props.onGravityChange(Number((e.target as HTMLInputElement).value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
            outline: 'none',
            appearance: 'none'
          }}
        />
      </div>

      {/* Air Damping Control */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          💨 空气阻力: {(props.config.linearDamping * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={props.config.linearDamping}
          onInput$={(e) => props.onDampingChange(Number((e.target as HTMLInputElement).value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
            outline: 'none',
            appearance: 'none'
          }}
        />
      </div>

      {/* Wall Friction Control */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          🧱 墙面摩擦: {(props.config.wallFriction * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={props.config.wallFriction}
          onInput$={(e) => props.onFrictionChange(Number((e.target as HTMLInputElement).value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
            outline: 'none',
            appearance: 'none'
          }}
        />
      </div>

      {/* Ball Restitution Control */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          ⚡ 弹性系数: {(props.ball.value.restitution * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={props.ball.value.restitution}
          onInput$={(e) => props.onRestitutionChange(Number((e.target as HTMLInputElement).value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
            outline: 'none',
            appearance: 'none'
          }}
        />
      </div>

      {/* Angular Velocity Control */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          🔄 旋转速度: {(props.hex.value.angularVelocity * 180 / Math.PI).toFixed(1)}°/s
        </label>
        <input
          type="range"
          min="-3.14"
          max="3.14"
          step="0.1"
          value={props.hex.value.angularVelocity}
          onInput$={(e) => props.onAngularVelocityChange(Number((e.target as HTMLInputElement).value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
            outline: 'none',
            appearance: 'none'
          }}
        />
      </div>

      {/* Reset Button */}
      <div style={{
        gridColumn: '1 / -1',
        textAlign: 'center',
        marginTop: '1rem'
      }}>
        <button
          onClick$={props.onResetBall}
          style={{
            padding: '0.8rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, var(--accent-color), #f97316)',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            color: 'white',
            cursor: 'pointer',
            transition: 'var(--transition)',
            boxShadow: 'var(--shadow-soft)'
          }}
        >
          🎯 重置小球位置
        </button>
      </div>
    </div>
  )
})