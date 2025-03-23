

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  console.log("GET /admin/test called")
  
  // Return a test response
  res.json({ 
    success: true,
    message: "Admin test route is working!",
    timestamp: new Date().toISOString()
  })
}