"use client"

import { useState } from "react"
import type { JSX } from "react/jsx-runtime"

interface YouTubeEmbedProps {
  id: string
  title: string
  start?: number
}

export function YouTubeEmbed({
  id,
  title,
  start,
}: YouTubeEmbedProps): JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false)

  const src = start
    ? `https://www.youtube-nocookie.com/embed/${id}?start=${String(start)}&autoplay=1`
    : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        marginTop: "12px",
      }}
    >
      {isLoaded ? (
        <iframe
          allowFullScreen={true}
          src={src}
          title={title}
          sandbox="allow-scripts allow-presentation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            border: "none",
          }}
        />
      ) : (
        <button
          title={`Play: ${title}`}
          aria-label={`Play: ${title}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            padding: 0,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: `#000 url(https://img.youtube.com/vi/${id}/maxresdefault.jpg) center/cover no-repeat`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
          onClick={() => {
            setIsLoaded(true)
          }}
        >
          <svg
            viewBox="0 0 68 48"
            width="68"
            height="48"
            style={{
              display: "block",
              transition: "transform 0.15s ease",
              pointerEvents: "none",
            }}
          >
            <path
              d="M66.5 7.7C65.8 5 63.7 3 61 2.3 55.7 0 34 0 34 0S12.3 0 7 2.3C4.3 3 2.2 5 1.5 7.7 0 13 0 24 0 24s0 11 1.5 16.3C2.2 43 4.3 45 7 45.7 12.3 48 34 48 34 48s21.7 0 27-2.3c2.7-.7 4.8-2.7 5.5-5.4C68 35 68 24 68 24s0-11-1.5-16.3z"
              fill="#ff0000"
            />
            <path d="M27 34V14l18 10z" fill="#fff" />
          </svg>
        </button>
      )}
    </div>
  )
}
