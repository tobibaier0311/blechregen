import type { CollectionConfig } from 'payload'

import { canEditOwnContent, isAuthenticated, setCreatedBy } from '../access/roles'
import { createdByField } from '../fields/createdBy'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: isAuthenticated,
    delete: canEditOwnContent,
    read: () => true,
    update: canEditOwnContent,
  },
  admin: {
    group: 'Medien',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    createdByField,
  ],
  hooks: {
    beforeChange: [setCreatedBy],
  },
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 900, height: 675, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
    mimeTypes: ['image/*'],
  },
}
