import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { ReactQueryProvider } from "@lib/providers/react-query-provider"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <ReactQueryProvider>
          <main className="relative">{props.children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
