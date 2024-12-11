'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {

  return (
    <div
      className="relative -mt-[4rem] flex items-start md:items-end justify-start text-white"
      data-theme="dark"
    >
      <div className=" backdrop-blur-md px-2 pt-2 sm:pt-0 pb-4 sm:pb-2 md:px-6 md:mb-0 z-10 relative flex items-center justify-center">
        <div className="flex flex-col md:flex-row text-left">
          {richText && (
            <RichText className="" content={richText} enableGutter={false} enableProse={true} />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="hidden md:flex justify-start mt-4 md:ml-8 pt-1 items-start gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <Media
            fill
            imgClassName="-z-10 object-cover"
            priority={false}
            loading="lazy"
            resource={media}
          />
        )}
      </div>
    </div>
  )
}
