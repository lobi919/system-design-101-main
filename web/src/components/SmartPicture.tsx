import React from 'react'

type Props = {
  src: string
  alt: string
  sizes?: string
  className?: string
}

export default function SmartPicture({ src, alt, sizes = '(max-width: 700px) 100vw, 800px', className }: Props) {
  const webp = src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  return (
    <picture className={className}>
      {/* Try WebP first */}
      <source srcSet={webp} type="image/webp" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        sizes={sizes}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </picture>
  )
}