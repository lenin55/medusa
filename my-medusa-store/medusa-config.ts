import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  plugins: [
    {
      resolve: "@tsc_tech/medusa-plugin-notification-template",
      options: {
        // plugin options if any
      }
    },
    {
      resolve: 'medusa-variant-images',
      options: {},
    }
  ],
  modules: [
    {
      resolve: "./src/modules/banner",
    }
  ]
})
