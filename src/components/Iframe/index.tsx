'use client'

import React from 'react'
import { cssVariables } from '@/cssVariables'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from '@/providers/Theme';

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
  height = 600, // Default height
  className
}) => {
  const { theme } = useTheme();
  // Calculate sizes similar to ImageMedia component
  const sizes = `(max-width: 600px) 100vw,` + // 100vw for screens up to 600px
    Object.entries(breakpoints)
    .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
    .join(', ')

  return (
    <div className="overscroll-contain overflow-hidden -mt-10 w-full">
      <TooltipProvider delayDuration={100} skipDelayDuration={0}>
        <Tooltip>
          {/* TooltipTrigger should wrap only an element with limited size impact */}
          <TooltipTrigger asChild>
            <div className="relative w-full">
              <iframe
                src={embedUrl}
                width="100%" // Match parent width
                height={height}
                className={`block ${className}`} // Ensures block layout
                allowFullScreen
              />
            </div>
          </TooltipTrigger>
          {/* Position TooltipContent carefully */}
          <TooltipContent className={`rounded-md px-3 py-2 text-sm font-medium shadow-lg ${
              theme === 'dark' 
                ? 'bg-white text-black' // Light tooltip for dark theme
                : 'bg-black text-white' // Dark tooltip for light theme
            }`} align='end'>
            <p>Hold <span className='text-orange-500'>Shift-Key</span> while navigating</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default Iframe;
