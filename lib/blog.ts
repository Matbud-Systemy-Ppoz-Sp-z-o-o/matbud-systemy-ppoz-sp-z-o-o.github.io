import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "content/blog")

export type Post = {
  slug: string
  title: string
  date: string
  excerpt: string
  coverImage?: string
  content: string
}

// Helper function to ensure the content directory exists
function ensureDirectoryExists() {
  try {
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
    }
  } catch (error) {
    console.error("Error creating blog directory:", error)
  }
}

export async function getAllPosts(locale: string): Promise<Post[]> {
  try {
    ensureDirectoryExists()

    // Get the locale-specific directory
    const localeDirectory = path.join(postsDirectory, locale)

    // Check if the locale directory exists, if not return empty array
    if (!fs.existsSync(localeDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(localeDirectory)
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
      .map((fileName) => {
        try {
          // Remove ".md" or ".mdx" from file name to get slug
          const slug = fileName.replace(/\.mdx?$/, "")

          // Read markdown file as string
          const fullPath = path.join(localeDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, "utf8")

          // Use gray-matter to parse the post metadata section
          const matterResult = matter(fileContents)

          // Combine the data with the slug
          return {
            slug,
            title: matterResult.data.title || "",
            date: matterResult.data.date || "",
            excerpt: matterResult.data.excerpt || "",
            coverImage: matterResult.data.coverImage || "",
            content: matterResult.content,
          }
        } catch (error) {
          console.error(`Error reading post file ${fileName}:`, error)
          return null
        }
      })
      .filter((post): post is Post => post !== null)

    // Sort posts by date
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1
      } else {
        return -1
      }
    })
  } catch (error) {
    console.error(`Error in getAllPosts for locale ${locale}:`, error)
    return []
  }
}

export async function getPostBySlug(slug: string, locale: string): Promise<Post | null> {
  ensureDirectoryExists()

  // Get the locale-specific directory
  const localeDirectory = path.join(postsDirectory, locale)

  // Check if the locale directory exists, if not return null
  if (!fs.existsSync(localeDirectory)) {
    return null
  }

  try {
    // Check for both .md and .mdx extensions
    let fullPath = path.join(localeDirectory, `${slug}.md`)
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(localeDirectory, `${slug}.mdx`)
      if (!fs.existsSync(fullPath)) {
        return null
      }
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const matterResult = matter(fileContents)

    return {
      slug,
      title: matterResult.data.title || "",
      date: matterResult.data.date || "",
      excerpt: matterResult.data.excerpt || "",
      coverImage: matterResult.data.coverImage || "",
      content: matterResult.content,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}