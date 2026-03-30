const imageCatalog: Record<string, string> = {
  'modern library books shelves': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=70',
  'library search books': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1100&q=70',
  'person borrowing books library': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1100&q=70',
  'library management organize books': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1100&q=70',
  'library reading books people': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=70',
  'digital library catalog books': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1100&q=70',
  'research repository theses university': 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1100&q=70',
  'library borrowing desk books': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1100&q=70',
}

const fallbackImage = 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=70'

interface LibraryImageProps {
  alt: string
  className?: string
  style?: React.CSSProperties
  searchQuery?: string
}

/**
 * Fetches real library/book images from Unsplash
 * Provides clean, modern, and classic library imagery
 */
export default function LibraryImage({
  alt,
  className = '',
  style = {},
  searchQuery = 'modern library books',
}: LibraryImageProps) {
  const imageSrc = imageCatalog[searchQuery] || fallbackImage

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`img-fluid ${className}`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      style={{
        objectFit: 'cover',
        borderRadius: '1rem',
        ...style,
      }}
      onError={(event) => {
        event.currentTarget.src = fallbackImage
      }}
    />
  )
}
