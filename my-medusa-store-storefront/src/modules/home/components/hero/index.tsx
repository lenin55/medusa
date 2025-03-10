import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import { getActiveBanners } from "@lib/data/banners"
import type { Banner } from "@lib/data/banners"
import Link from "next/link"

const Hero = async () => {
  // Fetch active banners with explicit typing
  let banners: Banner[] = []
  try {
    const fetchedBanners = await getActiveBanners()
    banners = fetchedBanners || []
  } catch (error) {
    console.error("Error displaying banners:", error)
  }

  const activeBanner = banners[0]

  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      {activeBanner ? (
        <div className="relative h-full w-full">
          {/* Use a div with background-image instead of Next.js Image */}
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${activeBanner.image_url})` }}
          />
          
          {activeBanner.link_url && (
            <Link 
              href={activeBanner.link_url}
              className="absolute inset-0 z-10"
              aria-label={activeBanner.name || "Banner link"}
            />
          )}
          
          {activeBanner.description && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
              <p>{activeBanner.description}</p>
            </div>
          )}
        </div>
      ) : (
        // Default hero content when no banner is available
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
          <span>
            <Heading level="h1" className="text-3xl leading-10 text-ui-fg-base font-normal">
              Ecommerce Starter Template
            </Heading>
            <Heading level="h2" className="text-3xl leading-10 text-ui-fg-subtle font-normal">
              Powered by Medusa and Next.js
            </Heading>
          </span>
          <a href="https://github.com/medusajs/nextjs-starter-medusa" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">
              View on GitHub
              <Github />
            </Button>
          </a>
        </div>
      )}
    </div>
  )
}

export default Hero