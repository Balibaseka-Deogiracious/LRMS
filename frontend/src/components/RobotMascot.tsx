import './RobotMascot.css'

interface RobotMascotProps {
  className?: string
}

export default function RobotMascot({ className = '' }: RobotMascotProps) {
  return (
    <div className={`robot-mascot ${className}`.trim()} aria-hidden="true">
      <div className="robot-platform-glow" />
      <div className="robot-platform" />

      <div className="robot-body">
        <div className="robot-antenna" />

        <div className="robot-head">
          <span className="robot-ear robot-ear-left" />
          <span className="robot-ear robot-ear-right" />
          <div className="robot-face">
            <span className="robot-eye" />
            <span className="robot-eye" />
          </div>
        </div>

        <div className="robot-neck" />

        <div className="robot-torso">
          <span className="robot-core" />
        </div>

        <div className="robot-arm robot-arm-left" />
        <div className="robot-arm robot-arm-right" />

        <div className="robot-feet">
          <span className="robot-foot" />
          <span className="robot-foot" />
        </div>
      </div>
    </div>
  )
}
