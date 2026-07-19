import type { CollectionConfig } from 'payload'

import {
  canEditOwnContent,
  canManageContent,
  canReadPublished,
  isAuthenticated,
  preventAuthorPublishing,
  setCreatedBy,
} from '../access/roles'
import { createdByField } from '../fields/createdBy'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Termin',
    plural: 'Termine',
  },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'venueName', '_status'],
  },
  access: {
    create: isAuthenticated,
    delete: canManageContent,
    read: canReadPublished,
    update: canEditOwnContent,
  },
  defaultSort: 'startDate',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titel',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL-Name',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Zum Beispiel: brassfestival-amberg-2026',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: 'Beginn',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd.MM.yyyy, HH:mm',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Ende',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd.MM.yyyy, HH:mm',
            },
          },
        },
      ],
    },
    {
      name: 'venueName',
      type: 'text',
      label: 'Veranstaltungsort',
      required: true,
    },
    {
      name: 'address',
      type: 'group',
      label: 'Adresse',
      fields: [
        { name: 'street', type: 'text', label: 'Straße und Hausnummer' },
        { name: 'postalCode', type: 'text', label: 'Postleitzahl' },
        { name: 'city', type: 'text', label: 'Ort' },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Beschreibung',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Bild',
    },
    {
      name: 'externalLink',
      type: 'text',
      label: 'Link des Veranstalters',
      validate: (value: null | string | undefined) => {
        if (!value) return true
        try {
          new URL(value)
          return true
        } catch {
          return 'Bitte eine vollständige URL inklusive https:// eingeben.'
        }
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Auf der Startseite hervorheben',
      defaultValue: false,
    },
    createdByField,
  ],
  hooks: {
    beforeChange: [setCreatedBy, preventAuthorPublishing],
  },
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
}
