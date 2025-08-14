# Articles

A decentralized article publishing platform built on the Nostr protocol, similar to Medium but with full ownership and control over your content. Create, edit, and publish long-form articles using NIP-23 (Long-form Content) with full Markdown support.

Made by **[Nostr.Buzz](https://nostr.buzz)** - your hub for everything Nostr.

## About Articles

Articles is a modern, decentralized article publishing platform that leverages the power of the Nostr protocol to give users complete ownership and control over their content. Unlike traditional centralized publishing platforms, Articles stores your articles on the decentralized Nostr network, ensuring that you maintain full control over your data without relying on centralized servers.

Articles provides a clean, intuitive interface for creating and sharing long-form content on the Nostr network, empowering writers with true ownership of their work.

## Features

### 📝 Article Management

- **Create Articles**: Start from scratch or use pre-built templates
- **Edit Articles**: Rich Markdown editor with live preview
- **Publish/Draft**: Save as drafts or publish to the Nostr network
- **Article Library**: View and manage all your articles in one place

### 🎨 Rich Markdown Support

- **Full Markdown**: Headers, lists, links, images, code blocks, tables
- **GitHub Flavored Markdown**: Strikethrough, task lists, and more
- **Syntax Highlighting**: Code blocks with syntax highlighting
- **Live Preview**: Switch between edit and preview modes
- **Typography**: Beautiful typography with Tailwind Typography

### 📋 Article Templates

- **Blank Article**: Start with a clean slate
- **Blog Post**: Pre-formatted blog post structure
- **News Article**: Structured news article format
- **Opinion Piece**: Editorial and opinion article format
- **Technical Article**: API docs and technical guides
- **Research Article**: Academic article structure
- **Tutorial/How-to Guide**: Step-by-step instructional content

### 🔐 Nostr Integration

- **NIP-23 Compliance**: Uses standard long-form content events
- **Decentralized**: Your content is stored on the Nostr network
- **Ownership**: You control your private keys and content
- **Addressable Events**: Articles have stable, shareable addresses
- **Draft Support**: NIP-23 draft events (kind 30024)

### 🎯 User Experience

- **Modern UI**: Clean, responsive design with shadcn/ui components
- **Dark Mode**: Full dark mode support
- **Mobile Friendly**: Works great on all devices
- **Fast Performance**: Built with Vite and optimized for speed
- **Search & Filter**: Find articles quickly with search and filters

## Technology Stack

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful, accessible UI components
- **Nostrify**: Nostr protocol framework
- **React Markdown**: Markdown rendering with plugins
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching

## Getting Started

### Prerequisites

- Node.js 18+
- A Nostr client extension (like Alby, nos2x, or similar)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nostr-articles

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. **Connect Your Nostr Account**: Click "Log in" and connect your Nostr extension
2. **Create an Article**: Click "New Article" and choose a template or start blank
3. **Write Content**: Use the Markdown editor to write your content
4. **Preview**: Switch to preview mode to see how your article will look
5. **Save/Publish**: Save as draft or publish to the Nostr network
6. **Share**: Share your published articles with others

## Article Structure

Articles follow the NIP-23 specification:

- **Kind 30023**: Published articles
- **Kind 30024**: Draft articles
- **Tags**: Title, summary, image, tags, published_at
- **Content**: Markdown-formatted text
- **Addressable**: Uses 'd' tag for stable addressing

## Features in Detail

### Markdown Editor

- Live syntax highlighting
- Auto-save drafts
- Keyboard shortcuts
- Full-screen editing mode
- Character and word count

### Article Metadata

- Title and summary
- Featured images
- Tags for categorization
- Publication timestamps
- Author information

### Sharing and Discovery

- Shareable NIP-19 addresses (naddr)
- Social media sharing
- Copy link functionality
- SEO-friendly URLs

### Security and Privacy

- Client-side key management
- No server-side storage of private keys
- Encrypted drafts (optional)
- Decentralized content storage

## Development

### Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run test`: Run tests
- `npm run deploy`: Deploy to production

### Project Structure

```text
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ArticleEditor.tsx
│   ├── ArticleViewer.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── types/              # TypeScript types
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built on the Nostr protocol
- Uses NIP-23 for long-form content
- Inspired by Medium and Substack
- Thanks to the Nostr community for the decentralized vision
