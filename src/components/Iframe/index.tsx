'use client'

import React from 'react'
import { cssVariables } from '@/cssVariables'

const { breakpoints } = cssVariables

interface IframeProps {
  embedUrl: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

const Iframe: React.FC<IframeProps> = ({
  embedUrl, 
  fill = false,
  width,
  height,
  className
}) => {
  // Calculate sizes similar to ImageMedia component
  const sizes = `(max-width: 600px) 100vw,` + // 100vw for screens up to 600px
    Object.entries(breakpoints)
    .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
    .join(', ')

  return (
    <div className='overscroll-contain overflow-hidden -mt-10'>
        <iframe
        src={embedUrl}
        width={fill ? '100%' : width}
        height={'600'}
        className={className}
        //   sizes={sizes}
        allowFullScreen
        />
    </div>
  )
}

export default Iframe;