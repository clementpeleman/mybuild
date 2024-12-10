import type { Block } from 'payload'

export const EmbedBlock: Block = {
  slug: 'embedBlock',
  interfaceName: 'EmbedBlock',
  fields: [
    {
      name: 'embedUrl',
      type: 'text',
      required: true,
    },
  ],
}
