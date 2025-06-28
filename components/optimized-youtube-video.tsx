"use client"

import { useState, useRef, useEffect } from "react"
import { Play, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface OptimizedYouTubeVideoProps {
  videoId: string
  title: string
  description: string
}

export function OptimizedYouTubeVideo({ videoId, title, description }: OptimizedYouTubeVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoadVideo = () => {
    setIsLoaded(true)
  }

  // Try different thumbnail qualities
  const getThumbnailUrl = () => {
    if (thumbnailError) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    }
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  const handleThumbnailError = () => {
    setThumbnailError(true)
  }

  return (
    <Card
      ref={containerRef}
      className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group bg-white/80 backdrop-blur-sm overflow-hidden"
    >
      <CardContent className="p-0">
        {/* Square Video Container */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          {!isLoaded ? (
            /* Optimized thumbnail with lazy loading */
            <div className="relative w-full h-full">
              {isInView && (
                <>
                  <Image
                    src={getThumbnailUrl() || "/placeholder.svg"}
                    alt={`${title} - YouTube video thumbnail`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={handleThumbnailError}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={75}
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      onClick={handleLoadVideo}
                      size="lg"
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 hover:bg-red-700 shadow-2xl hover:scale-110 transition-all duration-300 group/play border-4 border-white/20"
                      aria-label={`Spela ${title} video`}
                    >
                      <Play className="h-6 w-6 md:h-8 md:w-8 text-white ml-1 group-hover/play:scale-110 transition-transform duration-300" />
                    </Button>
                  </div>

                  {/* Video duration badge (optional) */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                    HD
                  </div>

                  {/* YouTube logo */}
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    YouTube
                  </div>
                </>
              )}

              {/* Loading placeholder */}
              {!isInView && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <Play className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* YouTube iframe – only loads when user clicks play */
            <div className="relative w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
                title={title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-4 md:p-6">
          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank", "noopener,noreferrer")}
              className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors duration-300"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Se på YouTube
            </Button>

            {!isLoaded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadVideo}
                className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-300"
              >
                <Play className="h-3 w-3 mr-1" />
                Spela här
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
