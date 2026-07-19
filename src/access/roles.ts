import type { Access, CollectionBeforeChangeHook, FieldAccess } from 'payload'
import { Forbidden } from 'payload'

export type UserRole = 'admin' | 'editor' | 'author'

type RoleUser = {
  id: number | string
  role?: UserRole | null
}

const getUser = (req: Parameters<Access>[0]['req']) => req.user as RoleUser | null

export const isAdmin: Access = ({ req }) => getUser(req)?.role === 'admin'

export const isAdminField: FieldAccess = ({ req }) =>
  (req.user as RoleUser | null)?.role === 'admin'

export const isAuthenticated: Access = ({ req }) => Boolean(getUser(req))

export const canManageContent: Access = ({ req }) => {
  const role = getUser(req)?.role
  return role === 'admin' || role === 'editor'
}

export const canEditOwnContent: Access = ({ req }) => {
  const user = getUser(req)

  if (!user) return false
  if (user.role === 'admin' || user.role === 'editor') return true

  return {
    createdBy: {
      equals: user.id,
    },
  }
}

export const canReadPublished: Access = ({ req }) => {
  if (getUser(req)) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}

export const setCreatedBy: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' && req.user && !data.createdBy) {
    data.createdBy = req.user.id
  }

  return data
}

export const preventAuthorPublishing: CollectionBeforeChangeHook = ({ data, req }) => {
  const user = getUser(req)

  if (user?.role === 'author' && data._status === 'published') {
    throw new Forbidden(req.t)
  }

  return data
}
