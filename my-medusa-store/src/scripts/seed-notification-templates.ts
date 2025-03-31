import { execSync } from "child_process"
import NotificationTemplateCreator from "./create-notification-templates"
import path from "path"

async function run(): Promise<void> {
  console.log("Starting notification templates seeding...")
  
  try {
    // Start Medusa in development mode programmatically
    const medusaProcess = execSync("medusa develop", {
      stdio: "inherit",
      cwd: process.cwd()
    })
    
    // Get the container from the running Medusa instance
    const { container } = require("@medusajs/medusa/dist/loaders/container")
    
    console.log("Medusa server bootstrapped successfully")
    await NotificationTemplateCreator(container)
    console.log("Notification template seeding completed!")
    process.exit(0)
  } catch (error) {
    console.error("Failed to seed notification templates:", error)
    console.error(error.stack)
    process.exit(1)
  }
}

run()
