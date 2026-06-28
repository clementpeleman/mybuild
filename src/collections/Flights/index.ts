import type { CollectionConfig } from 'payload'

import { flightReadAccess, staffOnly } from '../../access/staffOrAssigned'

/**
 * Vluchten — één gestandaardiseerde dronevlucht boven een werf, op een datum.
 * Bevat de embed-URL's van de viewers (orthomosaic / 3D-model / puntenwolk)
 * en optionele metingen (bv. grondvolumes).
 */
export const Flights: CollectionConfig = {
  slug: 'flights',
  labels: {
    singular: 'Vlucht',
    plural: 'Vluchten',
  },
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: flightReadAccess,
    update: staffOnly,
  },
  admin: {
    defaultColumns: ['project', 'date', 'title', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Werfopvolging',
  },
  fields: [
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Werf',
      required: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'Vluchtdatum',
          required: true,
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titel (bv. "Vlucht 3 — ruwbouw")',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Korte toelichting',
    },
    {
      type: 'collapsible',
      label: 'Viewers (embed-URLs)',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'orthoUrl',
          type: 'text',
          label: 'Orthomosaic / kaart (embed-URL)',
        },
        {
          name: 'modelUrl',
          type: 'text',
          label: '3D-model (Sketchfab e.d. embed-URL)',
        },
        {
          name: 'pointcloudUrl',
          type: 'text',
          label: 'Puntenwolk (Potree embed-URL)',
        },
      ],
    },
    {
      name: 'measurements',
      type: 'array',
      label: 'Metingen',
      labels: { singular: 'Meting', plural: 'Metingen' },
      admin: {
        description: 'Bv. grondverzet, stockvolume, oppervlakte.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Omschrijving', admin: { width: '50%' } },
            { name: 'value', type: 'number', label: 'Waarde', admin: { width: '25%' } },
            { name: 'unit', type: 'text', label: 'Eenheid', admin: { width: '25%' } },
          ],
        },
        { name: 'note', type: 'text', label: 'Opmerking' },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Foto’s',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
  timestamps: true,
}
