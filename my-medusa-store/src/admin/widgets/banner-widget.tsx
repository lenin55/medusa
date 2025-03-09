import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { CreateForm } from "../components/create-form"
import { Container } from "@medusajs/ui"
import { Header } from "../components/Header"


// The widget
const BannerWidget = () => {
return (
    <Container>
        <Header
        title="Items"
        actions={[
            {
            type: "custom",
            children: <CreateForm />,
            },
        ]}
        />
    </Container>
    )
}
    

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default BannerWidget