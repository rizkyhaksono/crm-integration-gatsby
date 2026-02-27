import { Box, Text } from "theme-ui"
import * as React from "react"
import { Link } from "gatsby"
import type { HeadFC, PageProps } from "gatsby"

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Box as="main" sx={{ color: "text", p: 9, fontFamily: "body" }}>
      <Text as="h1" sx={{ mt: 0, mb: 9, maxWidth: 320, fontWeight: "bold", fontSize: 8 }}>
        Page not found
      </Text>
      <Text as="p" sx={{ mb: 8, fontSize: 3 }}>
        Sorry, we could not find what you were looking for.
        <br />
        {process.env.NODE_ENV === "development" ? (
          <>
            <br />
            Try creating a page in{" "}
            <Box as="code" sx={{ color: "#8A6534", p: "2px 6px", bg: "#FFF4DB", fontSize: "1.1em", borderRadius: "sm" }}>
              src/pages/
            </Box>
            .<br />
          </>
        ) : null}
        <br />
        <Link to="/" sx={{ color: "primary" }}>
          Go home
        </Link>
        .
      </Text>
    </Box>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
