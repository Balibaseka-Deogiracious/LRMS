import './LibrisLogo.css'

interface LibrisLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number
  className?: string
  showText?: boolean
}

const sizeMap = {
  sm: 32,
  md: 64,
  lg: 96,
  xl: 128,
}

export default function LibrisLogo({ size = 'md', className = '', showText = false }: LibrisLogoProps) {
  const sizeValue = typeof size === 'number' ? size : sizeMap[size]

  return (
    <div className={`libris-logo-container ${className}`}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="libris-logo"
        width={sizeValue}
        height={sizeValue}
      >
        {/* Define gradients for depth */}
        <defs>
          <linearGradient id="bluGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#2a4fa0', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#254194', stopOpacity: 1 }} />
          </linearGradient>

          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ffda47', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ffc107', stopOpacity: 1 }} />
          </linearGradient>

          <filter id="softShadow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rounded square background */}
        <rect
          x="20"
          y="20"
          width="160"
          height="160"
          rx="24"
          ry="24"
          fill="url(#bluGradient)"
          filter="url(#softShadow)"
        />

        {/* Inner border for depth */}
        <rect
          x="20"
          y="20"
          width="160"
          height="160"
          rx="24"
          ry="24"
          fill="none"
          stroke="#1a2d6e"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Geometric 'L' shape */}
        <g>
          {/* Vertical spine of L (also the bookmark) */}
          <rect x="62" y="50" width="14" height="100" rx="4" ry="4" fill="url(#goldGradient)" />

          {/* Horizontal base of L */}
          <rect x="62" y="136" width="76" height="14" rx="4" ry="4" fill="url(#goldGradient)" />

          {/* Bookmark accent - decorative notch on top of vertical */}
          <polygon points="62,50 62,42 69,42 76,50" fill="url(#goldGradient)" />
          <polygon points="138,50 138,42 145,42 152,50" fill="url(#goldGradient)" opacity="0.6" />
        </g>

        {/* Subtle accent lines for progress bar effect */}
        <line x1="62" y1="70" x2="76" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="62" y1="90" x2="76" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="62" y1="110" x2="76" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </svg>

      {showText && <span className="libris-text">LIBRIS</span>}
    </div>
  )
}
