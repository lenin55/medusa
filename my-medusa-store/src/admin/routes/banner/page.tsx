import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Photo } from "@medusajs/icons"
import { Container } from "@medusajs/ui"
import BannerWidget from "../../widgets/banner-widget"

const BannerPage = () => {
  return (
    <Container className="divide-y p-0">
      <BannerWidget />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Banners",
  icon: Photo,
})

export default BannerPage