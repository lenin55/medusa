import { model } from "@medusajs/framework/utils"

const Banner = model.define("banner", {
  id: model.id().primaryKey(),
  name: model.text(),
  image_url: model.text(),
  description: model.text().nullable(),
  is_active: model.boolean().default(false),
  link_url: model.text().nullable(),
  valid_from: model.text().nullable(), // Store as ISO string
  valid_until: model.text().nullable(), // Store as ISO string
})

export default Banner
export { Banner }