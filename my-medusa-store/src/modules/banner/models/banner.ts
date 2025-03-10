// This is a simplified version of the Banner model that doesn't rely on MikroORM
// It's used for in-memory storage during development
export interface Banner {
  id: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  name: string
  image_url: string
  description?: string
  is_active: boolean
  link_url?: string
  valid_from?: Date
  valid_until?: Date
}