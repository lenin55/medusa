"use client";

import { useState, useEffect } from "react"
import Link from "next/link"

interface Banner {
  id: string
  image_url: string
  link_url?: string
  description?: string
}

interface CarouselProps {
  banners: Banner[]
}

const Carousel: React.FC<CarouselProps> = ({ banners }) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 5000) // Change banner every 5 seconds
    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <div className="relative h-full w-full">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentBannerIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${banner.image_url})` }}
          />
          {banner.link_url && (
            <Link
              href={banner.link_url}
              className="absolute inset-0 z-10"
              aria-label={banner.description || "Banner link"}
            />
          )}
          {banner.description && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white">
              <p>{banner.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Carousel
