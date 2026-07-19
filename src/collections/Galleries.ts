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

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: {
    singular: 'Galerie',
    plural: 'Galerien',
  },
  admin: {
    group: 'Medien',
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventDate', '_status'],
  },
  access: {
    create: isAuthenticated,
    delete: canManageContent,
    read: canReadPublished,
    update: canEditOwnContent,
  },
  defaultSort: '-eventDate',
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
    },
    {
      name: 'eventDate',
      type: 'date',
      label: 'Datum der Veranstaltung',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Kurzbeschreibung',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Titelbild',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Bilder',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Bild',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Bildunterschrift',
        },
      ],
    },
    createdByField,
  ],
  hooks: {
    beforeChange: [setCreatedBy, preventAuthorPublishing],
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
}
