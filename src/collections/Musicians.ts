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

export const Musicians: CollectionConfig = {
  slug: 'musicians',
  labels: {
    singular: 'Musiker',
    plural: 'Musiker',
  },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'name',
    defaultColumns: ['name', 'instrument', 'order', '_status'],
  },
  access: {
    create: isAuthenticated,
    delete: canManageContent,
    read: canReadPublished,
    update: canEditOwnContent,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'instrument',
      type: 'text',
      label: 'Instrument',
      required: true,
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      label: 'Porträtfoto',
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Kurzbeschreibung',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Reihenfolge',
      required: true,
      defaultValue: 10,
      min: 0,
      admin: {
        description: 'Kleinere Zahlen werden weiter vorne angezeigt.',
      },
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
