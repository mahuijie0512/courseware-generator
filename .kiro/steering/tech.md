# Technology Stack

## Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom CSS
- **Animation**: Framer Motion
- **Data Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Caching**: Redis
- **File Upload**: Multer
- **Image Processing**: Sharp
- **Web Scraping**: Cheerio + Puppeteer
- **Security**: Helmet, CORS

## AI Services
- **Content Generation**: OpenAI GPT-4
- **Image Generation**: DALL-E 3
- **Chinese Optimization**: 百度文心一言 (Baidu Wenxin)

## Media Processing
- **Video Processing**: FFmpeg
- **Image Processing**: Sharp
- **Web Scraping**: Network crawlers for resource search

## Development Tools
- **Package Manager**: npm
- **TypeScript Compiler**: tsc
- **Development Server**: tsx watch (backend), Vite (frontend)
- **Process Management**: concurrently

## Common Commands

### Development
```bash
# Start full development environment
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only  
npm run dev:frontend
```

### Building
```bash
# Build entire project
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

### Backend Specific
```bash
cd backend
npm run dev     # Development with hot reload
npm run build   # TypeScript compilation
npm run start   # Production server
```

### Frontend Specific
```bash
cd frontend
npm run dev     # Vite development server
npm run build   # Production build
npm run preview # Preview production build
```

## Environment Setup
- Backend uses `.env` files for configuration
- Frontend uses Vite's environment variable system
- Shared types are defined in `/shared/types.ts`