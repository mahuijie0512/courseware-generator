# Project Structure

## Root Directory Layout

```
courseware-generator/
├── frontend/          # React frontend application
├── backend/           # Express backend API
├── shared/            # Shared TypeScript types and utilities
├── scripts/           # Frontend JavaScript modules (demo/prototype)
├── styles/            # CSS stylesheets (demo/prototype)
├── index.html         # Demo HTML file
├── test-export.html   # Export functionality test
├── package.json       # Root package.json with workspace scripts
└── README.md          # Project documentation
```

## Frontend Structure (`/frontend`)
- **React 18 + TypeScript + Vite** setup
- Uses modern React patterns with hooks
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for state management

## Backend Structure (`/backend`)
- **Node.js + Express + TypeScript** API server
- RESTful API design
- MongoDB integration with Mongoose
- Redis for caching
- AI service integrations (OpenAI, Baidu)
- Media processing capabilities

## Shared Module (`/shared`)
- **types.ts**: Comprehensive TypeScript type definitions
- Shared interfaces for course content, generation requests, media resources
- Common data structures used across frontend and backend

## Demo/Prototype Files
- **scripts/**: Vanilla JavaScript modules for demo functionality
  - `app.js`: Main application logic
  - `ui.js`: UI interaction handlers
  - `navigation.js`: Navigation management
  - `state-manager.js`: State management
  - `demo-data.js`: Mock data for demonstrations
  - `courseware.js`: Courseware-specific functionality
- **styles/**: CSS stylesheets
  - `main.css`: Base styles
  - `components.css`: Component-specific styles
  - `responsive.css`: Responsive design rules
- **index.html**: Main demo interface
- **test-export.html**: Export functionality testing

## Key Conventions

### File Naming
- TypeScript files use `.ts` extension
- React components use `.tsx` extension
- CSS files use descriptive names (components, responsive, main)
- JavaScript modules use kebab-case naming

### Code Organization
- Shared types are centralized in `/shared/types.ts`
- Frontend and backend are completely separate applications
- Demo/prototype code exists alongside the main applications
- Configuration files are environment-specific (`.env` files)

### Language Support
- Primary language: Chinese (zh-CN)
- Secondary language: English (en-US)
- UI text and documentation support both languages

### Data Flow
- Frontend communicates with backend via REST API
- Shared TypeScript types ensure type safety across boundaries
- State management handled by React Query on frontend
- Backend uses MongoDB for persistence and Redis for caching