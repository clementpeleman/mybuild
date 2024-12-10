import React from 'react';
import Iframe from '@/components/Iframe';
import { cn } from 'src/utilities/cn';

interface EmbedBlockProps {
  embedUrl: string;
  className?: string;
  enableGutter?: boolean;
}

export const EmbedBlock: React.FC<EmbedBlockProps> = ({
  embedUrl,
  className,
  enableGutter = true,
}) => {
  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {/* Gebruik de externe IframeComponent */}
      <Iframe fill={true} embedUrl={embedUrl} />
    </div>
  );
};
