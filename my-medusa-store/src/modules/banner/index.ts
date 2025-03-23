// src/modules/banner/index.ts
import BannerModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const BANNER_MODULE = "banner"

export default Module(BANNER_MODULE, {
  service: BannerModuleService,
})