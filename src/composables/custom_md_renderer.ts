import { marked, type Renderer } from 'marked'

let initialized = false

const renderer: Partial<Renderer> = {
    // Flatten all headings to the same style
    // h1s and h2s are too big h5 and h6 are too small, We want to keep headers consistent
    // There should be no need for a post to have header hierarchy
    heading({ text }) {
        return `<span class="md-heading">${text}</span>`
    },

    // Links open in new tags
    link({ href, text }) {
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
    }
}

// Unescape certain characters
const unescape = (text: string): string => {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#34;/g, '"')
        .replace(/&#39;/g, "'")
}

export function useCustomMdRenderer() {
    if (!initialized) {
        marked.use({ renderer, gfm: true, breaks: true })
        initialized = true
    }

    const parseMarkdown = (text: string): string => {
        return marked.parse(unescape(text)) as string
    }

    return { parseMarkdown }
}