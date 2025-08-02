"use client"

import { useState, useEffect } from "react"

interface CopyrightData {
  copyright: string
  app_url?: string
}

export default function Copyright() {
  const [copyrightData, setCopyrightData] = useState<CopyrightData>({
    copyright: "© 2024 Employee Review System. All rights reserved."
  })

  useEffect(() => {
    fetchCopyrightData()
  }, [])

  const fetchCopyrightData = async () => {
    try {
      const response = await fetch("/api/settings/system")
      const data = await response.json()
      
      if (data.success) {
        setCopyrightData({
          copyright: data.data.copyright || "© 2024 Employee Review System. All rights reserved.",
          app_url: data.data.app_url
        })
      }
    } catch (error) {
      console.error("Error fetching copyright data:", error)
    }
  }

  const createMarkup = (htmlString: string) => {
    return { __html: htmlString }
  }

  return (
    <div className="text-center py-4 text-sm text-muted-foreground">
      <div 
        dangerouslySetInnerHTML={createMarkup(copyrightData.copyright)}
        className="inline-block"
      />
    </div>
  )
} 