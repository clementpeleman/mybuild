import type { CollectionConfig } from 'payload'

import { projectReadAccess, staffOnly } from '../../access/staffOrAssigned'
import { slugField } from '@/fields/slug'

/**
 * Werven — elke bouwwerf die op regelmatige basis met de drone wordt opgevolgd.
 * Eén werf = één privé portaalpagina, gedeeld met bouwheer/werfleider.
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Werf',
    plural: 'Werven',
  },
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: projectReadAccess,
    update: staffOnly,
  },
  admin: {
    defaultColumns: ['name', 'client', 'status', 'updatedAt'],
    useAsTitle: 'name',
    group: 'Werfopvolging',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Werfnaam',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'client',
          type: 'text',
          label: 'Bouwheer / klant',
          admin: { width: '50%' },
        },
        {
          name: 'status',
          type: 'select',
          label: 'Status',
          defaultValue: 'active',
          admin: { width: '50%' },
          options: [
            { label: 'In voorbereiding', value: 'prep' },
            { label: 'Actief', value: 'active' },
            { label: 'Afgewerkt', value: 'done' },
          ],
        },
      ],
    },
    {
      name: 'address',
      type: 'text',
      label: 'Adres',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'lat',
          type: 'number',
          label: 'Latitude',
          admin: { width: '50%', step: 0.000001 },
        },
        {
          name: 'lng',
          type: 'number',
          label: 'Longitude',
          admin: { width: '50%', step: 0.000001 },
        },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Startdatum',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Coverbeeld',
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Omschrijving',
    },
    {
      name: 'allowedUsers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Toegang (bouwheer / werfleider)',
      admin: {
        position: 'sidebar',
        description: 'Ingelogde gebruikers die deze werf mogen bekijken.',
      },
    },
    ...slugField('name'),
  ],
  timestamps: true,
}
