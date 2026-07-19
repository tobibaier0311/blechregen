import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: isAdmin,
    delete: isAdmin,
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (!req.user) return false

      return {
        id: {
          equals: req.user.id,
        },
      }
    },
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (!req.user) return false

      return {
        id: {
          equals: req.user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rolle',
      required: true,
      defaultValue: 'author',
      access: {
        create: isAdminField,
        update: isAdminField,
      },
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Redakteur', value: 'editor' },
        { label: 'Autor', value: 'author' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create' && !req.user) {
          data.role = 'admin'
        }

        return data
      },
    ],
  },
}
