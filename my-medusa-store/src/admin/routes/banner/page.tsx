import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { Container, Heading } from "@medusajs/ui"
import BannerWidget from "../../widgets/banner-widget"


const BannerPage = () => {
  return (
    <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
            <Heading level="h2">This is my custom route</Heading>
        </div>
        <BannerWidget />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Banner Page",
  icon: ChatBubbleLeftRight,
})

export default BannerPage