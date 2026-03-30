import assistantAvatar from '../assets/aiden-avatar.jpg'

type AvatarSize = 'sm' | 'md' | 'lg'
type AvatarVariant = 'admin_blue'

interface AvatarProps {
  size?: AvatarSize
  variant?: AvatarVariant
  className?: string
}

const sizeMap: Record<AvatarSize, string> = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-11 w-11',
}

const ringMap: Record<AvatarVariant, string> = {
  admin_blue: 'ring-1 ring-white/30',
}

export default function Avatar({ size = 'md', variant = 'admin_blue', className = '' }: AvatarProps) {
  return (
    <img
      src={assistantAvatar}
      alt="Aiden avatar"
      className={`${sizeMap[size]} rounded-full object-cover ${ringMap[variant]} ${className}`.trim()}
      loading="lazy"
      decoding="async"
    />
  )
}
