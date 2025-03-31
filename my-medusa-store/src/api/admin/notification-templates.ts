import type { Response } from "express"
import type { EntityManager } from "@mikro-orm/core"
import type { MedusaContainer } from "@medusajs/medusa"

interface CustomRequest {
  scope: MedusaContainer
  body: Record<string, any>
}

export const GET = async (
  req: CustomRequest,
  res: Response
) => {
  const notificationTemplateService = req.scope.resolve("notification-template")
  
  try {
    const templates = await notificationTemplateService.list({})
    return res.json({ templates })
  } catch (error) {
    return res.status(500).json({ message: "Error fetching notification templates", error: error.message })
  }
}

export const POST = async (
  req: CustomRequest,
  res: Response
) => {
  const notificationTemplateService = req.scope.resolve("notification-template")
  const manager = req.scope.resolve<EntityManager>("manager")
  
  try {
    const templateData = req.body
    
    const template = await manager.transactional(async (transactionManager) => {
      return await notificationTemplateService.withTransaction(transactionManager).create(templateData)
    })
    
    return res.json({ template })
  } catch (error) {
    return res.status(500).json({ message: "Error creating notification template", error: error.message })
  }
}
