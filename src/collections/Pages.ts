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

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Seite',
    plural: 'Seiten',
  },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
  },
  access: {
    create: isAuthenticated,
    delete: canManageContent,
    read: canReadPublished,
    update: canEditOwnContent,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Seitentitel',
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
        description: 'Zum Beispiel: ueber-uns oder kontakt',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Einleitung',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Kopfbild',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Inhalt',
      required: true,
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Suchmaschinen',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO-Titel',
          maxLength: 60,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta-Beschreibung',
          maxLength: 160,
        },
      ],
    },
    createdByField,
  ],
  hooks: {
    beforeChange: [setCreatedBy, preventAuthorPublishing],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 25,
  },
}
