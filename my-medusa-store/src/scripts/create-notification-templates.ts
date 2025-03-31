import type { AwilixContainer } from "awilix"
import type { EntityManager } from "@mikro-orm/core"

export default async function createSampleNotificationTemplates(container: AwilixContainer): Promise<void> {
  try {
    const notificationTemplateService = container.resolve("notification-template")
    const manager = container.resolve<EntityManager>("manager")
    
    if (!notificationTemplateService) {
      console.error("notification-template service not found. Make sure the plugin is properly installed.")
      return
    }

    console.log("Creating sample notification templates...")
    
    const templates = [
      {
        event_name: "payment.captured",
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Payment Captured</h1>
            <p>Hello {{customer.first_name}},</p>
            <p>We're happy to confirm that your payment of <strong>{{payment.amount}}</strong> has been successfully captured for order #{{order.display_id}}.</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
              <h3>Order Details:</h3>
              <p>Order ID: #{{order.display_id}}</p>
              <p>Payment Amount: {{payment.amount}}</p>
              <p>Payment Method: {{payment.provider_id}}</p>
              <p>Transaction Date: {{payment.created_at}}</p>
            </div>
            <p>Thank you for your purchase!</p>
            <p>Best regards,<br>The {{store.name}} Team</p>
          </div>
        `,
        subject: "Payment Confirmation - Order #{{order.display_id}}",
        to: "{{customer.email}}",
      },
      {
        event_name: "order.placed",
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Order Confirmation</h1>
            <p>Hello {{customer.first_name}},</p>
            <p>Thank you for your order! We've received your order and it's being processed.</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
              <h3>Order Summary:</h3>
              <p>Order ID: #{{order.display_id}}</p>
              <p>Order Date: {{order.created_at}}</p>
              <p>Order Total: {{order.total}}</p>
              <p>Shipping Method: {{order.shipping_methods.0.name}}</p>
            </div>
            <h3>Items Ordered:</h3>
            <ul style="padding-left: 20px;">
              {{#each order.items}}
                <li>{{this.title}} - Quantity: {{this.quantity}} - Price: {{this.unit_price}}</li>
              {{/each}}
            </ul>
            <p>We will notify you once your order has been shipped.</p>
            <p>Best regards,<br>The {{store.name}} Team</p>
          </div>
        `,
        subject: "Order Confirmation - #{{order.display_id}}",
        to: "{{customer.email}}",
      },
      {
        event_name: "order.shipment_created",
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Your Order Has Shipped!</h1>
            <p>Hello {{customer.first_name}},</p>
            <p>Great news! Your order #{{order.display_id}} has been shipped and is on its way to you.</p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
              <h3>Shipping Details:</h3>
              <p>Order ID: #{{order.display_id}}</p>
              <p>Tracking Number: {{fulfillment.tracking_numbers}}</p>
              <p>Carrier: {{fulfillment.shipping_carrier}}</p>
              <p>Estimated Delivery: {{fulfillment.data.estimated_delivery}}</p>
            </div>
            <h3>Items Shipped:</h3>
            <ul style="padding-left: 20px;">
              {{#each fulfillment.items}}
                <li>{{this.title}} - Quantity: {{this.quantity}}</li>
              {{/each}}
            </ul>
            <p>Thank you for your order!</p>
            <p>Best regards,<br>The {{store.name}} Team</p>
          </div>
        `,
        subject: "Your Order #{{order.display_id}} Has Shipped!",
        to: "{{customer.email}}",
      }
    ]
    
    for (const templateData of templates) {
      try {
        // Check if template already exists
        const exists = await notificationTemplateService.retrieveByEventName(templateData.event_name).catch(() => null)
        
        if (exists) {
          console.log(`⚠️ Template for ${templateData.event_name} already exists, skipping...`)
          continue
        }
        
        // Create template using transaction with correct MikroORM method
        await manager.transactional(async (transactionManager) => {
          await notificationTemplateService
            .withTransaction(transactionManager)
            .create(templateData)
        })
        
        console.log(`✅ Created ${templateData.event_name} template`)
      } catch (error) {
        console.error(`❌ Error creating ${templateData.event_name} template:`, error)
      }
    }
    
    console.log("✅ Notification template seeding completed!")
  } catch (error) {
    console.error("Error creating notification templates:", error)
  }
}