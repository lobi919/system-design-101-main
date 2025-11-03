import React from 'react'

export default function LazyImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = React.useState(false)
  const { src, alt, ...rest } = props
  return (
    <div className="lazy-wrap" aria-busy={!loaded} aria-live="polite">
      {!loaded && <div className="lazy-skeleton" />}
      <img
        {...rest}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? 'block' : 'none', maxWidth: '100%', height: 'auto' }}
      />
    </div>
  )
}