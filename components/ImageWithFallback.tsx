'use client'

import {useState} from 'react'

type ImageWithFallbackProps = {
  src?: string
  fallbackSrc?: string
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
}

export default function ImageWithFallback({
  src,
  fallbackSrc = '/logo.svg',
  alt,
  className,
  loading = 'lazy',
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc)

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc)
      }}
    />
  )
}
