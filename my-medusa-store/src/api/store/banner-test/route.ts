import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  console.log("GET /store/banner-test called")
  
  // Return a test response
  res.json({ 
    success: true,
    message: "Banner test route is working!",
    timestamp: new Date().toISOString()
  })
}