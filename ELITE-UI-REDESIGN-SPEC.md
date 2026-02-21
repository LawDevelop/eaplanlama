# Elite UI Redesign Specification
## Hukuk Yönetim Sistemi - Kapsamlı Tasarım Rehberi

**Versiyon:** 2.0  
**Tarih:** 2026  
**Tasarım Felsefesi:** Modern, Elite, Premium, Profesyonel

---

## 📐 Design System

### 🎨 Color Palette

#### Light Mode
```css
/* Primary Colors - Sophisticated Blue */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;    /* Main */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;
--primary-950: #172554;

/* Secondary Colors - Elegant Purple */
--secondary-50: #faf5ff;
--secondary-100: #f3e8ff;
--secondary-200: #e9d5ff;
--secondary-300: #d8b4fe;
--secondary-400: #c084fc;
--secondary-500: #a855f7;
--secondary-600: #9333ea;
--secondary-700: #7e22ce;
--secondary-800: #6b21a8;
--secondary-900: #581c87;

/* Accent Colors - Vibrant Gradient */
--accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--accent-gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--accent-gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Status Colors */
--success: #10b981;
--success-light: #d1fae5;
--warning: #f59e0b;
--warning-light: #fef3c7;
--error: #ef4444;
--error-light: #fee2e2;
--info: #3b82f6;
--info-light: #dbeafe;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
--gray-950: #030712;

/* Surface Colors */
--background: #ffffff;
--surface: #ffffff;
--surface-elevated: #f9fafb;
--surface-overlay: rgba(255, 255, 255, 0.95);
--border: #e5e7eb;
--divider: #f3f4f6;
```

#### Dark Mode
```css
/* Primary Colors - Brighter for dark mode */
--primary-50: #1e3a8a;
--primary-500: #60a5fa;
--primary-600: #3b82f6;
--primary-700: #2563eb;

/* Surface Colors */
--background: #0a0f1e;
--surface: #111827;
--surface-elevated: #1f2937;
--surface-overlay: rgba(17, 24, 39, 0.95);
--border: #374151;
--divider: #1f2937;

/* Text Colors */
--text-primary: #f9fafb;
--text-secondary: #d1d5db;
--text-tertiary: #9ca3af;
```

### 🔤 Typography Scale

```css
/* Font Families */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
--font-display: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;

/* Letter Spacing */
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
```

### 📏 Spacing System

```css
/* Spacing Scale (8px base) */
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

### 🔲 Border Radius System

```css
/* Border Radius */
--radius-sm: 0.5rem;     /* 8px */
--radius-md: 0.75rem;    /* 12px */
--radius-lg: 1rem;       /* 16px */
--radius-xl: 1.25rem;    /* 20px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-3xl: 2rem;      /* 32px */
--radius-full: 9999px;

/* Card Specific */
--card-radius: 1.5rem;   /* 24px */
--button-radius: 1rem;   /* 16px */
--input-radius: 0.75rem; /* 12px */
```

### 🌗 Shadows & Elevation

```css
/* Shadows */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Colored Shadows */
--shadow-primary: 0 10px 40px -10px rgba(59, 130, 246, 0.3);
--shadow-success: 0 10px 40px -10px rgba(16, 185, 129, 0.3);
--shadow-warning: 0 10px 40px -10px rgba(245, 158, 11, 0.3);
--shadow-error: 0 10px 40px -10px rgba(239, 68, 68, 0.3);

/* Inner Shadows */
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
```

### ✨ Glassmorphism

```css
/* Glass Effects */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.glass-card-dark {
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.glass-button {
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
}
```

### 🎭 Animations & Transitions

```css
/* Timing Functions */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);

/* Durations */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;

/* Keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

## 🧩 Component Library

### 1. Cards

#### Elite Card (Primary)
```tsx
<div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
  {/* Content */}
</div>
```

#### Glass Card
```tsx
<div className="glass-card rounded-3xl p-6 backdrop-blur-xl">
  {/* Content */}
</div>
```

#### Gradient Card
```tsx
<div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-2xl">
  {/* Content */}
</div>
```

#### Stat Card
```tsx
<div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all group">
  <div className="flex items-center justify-between mb-3">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <TrendingUp className="w-4 h-4 text-gray-400" />
  </div>
  <div className="text-2xl font-bold mb-1">{value}</div>
  <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
</div>
```

### 2. Buttons

#### Primary Button
```tsx
<button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
  Button Text
</button>
```

#### Secondary Button
```tsx
<button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
  Button Text
</button>
```

#### Ghost Button
```tsx
<button className="px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200">
  Button Text
</button>
```

#### Icon Button
```tsx
<button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
  <Icon className="w-5 h-5" />
</button>
```

### 3. Inputs

#### Text Input
```tsx
<div className="relative">
  <input 
    type="text"
    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    placeholder="Placeholder"
  />
</div>
```

#### Input with Icon
```tsx
<div className="relative">
  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  <input 
    type="text"
    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    placeholder="Search..."
  />
</div>
```

### 4. Navigation

#### Desktop Sidebar
```tsx
<aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 dark:bg-black border-r border-gray-800 flex flex-col">
  {/* Logo */}
  <div className="h-16 flex items-center px-6 border-b border-gray-800">
    <Logo />
  </div>
  
  {/* Nav Items */}
  <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3">
    <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all group">
      <Icon className="w-5 h-5" />
      <span className="font-medium">Item</span>
    </a>
  </nav>
</aside>
```

#### Mobile Bottom Navigation
```tsx
<nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800">
  <div className="grid grid-cols-5 h-full">
    <a href="#" className="flex flex-col items-center justify-center gap-1 text-blue-600">
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">Home</span>
    </a>
  </div>
</nav>
```

### 5. Modals

#### Modal Container
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
  
  {/* Modal */}
  <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
    {/* Header */}
    <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold">Modal Title</h2>
    </div>
    
    {/* Content */}
    <div className="p-6">
      {/* Content */}
    </div>
    
    {/* Footer */}
    <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
      <div className="flex gap-3 justify-end">
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </div>
  </div>
</div>
```

### 6. Data Display

#### Table
```tsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-50 dark:bg-gray-800/50">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Header
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <td className="px-6 py-4 text-sm">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

#### List Item
```tsx
<div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer">
  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
  </div>
  <div className="flex-1">
    <h4 className="font-medium">Title</h4>
    <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
  </div>
</div>
```

### 7. Badges & Tags

#### Status Badge
```tsx
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
  Active
</span>
```

#### Priority Badge
```tsx
<span className="inline-flex items-center px-2.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-xs font-semibold">
  HIGH
</span>
```

---

## 📱 Page Specifications

### Login Page

**Design Approach:** Full-screen gradient background with glassmorphic centered card

**Key Elements:**
- Animated gradient background with floating elements
- Glassmorphic login card with backdrop blur
- Smooth animations on input focus
- Animated logo/scale icon
- Success/Error state animations

**Tailwind Classes:**
```tsx
// Container
className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"

// Login Card
className="relative z-10 w-full max-w-md mx-auto bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8"

// Input
className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"

// Button
className="w-full py-3.5 bg-white text-blue-900 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
```

### Dashboard Page

**Layout:** Grid-based with hero section, stats cards, and content cards

**Sections:**
1. Welcome Banner (gradient card)
2. Quick Stats (4-column grid, responsive to 2 columns on mobile)
3. Today's Tasks & Hearings (2-column grid)
4. Charts & Analytics
5. Recent Activity Feed

**Key Features:**
- Animated stat cards with icons
- Gradient backgrounds for important sections
- Smooth hover effects on interactive elements
- Loading skeletons for async data

### Tasks Page

**Views:** List, Kanban, Calendar, Matrix

**Key Components:**
- View toggle buttons with active state
- Filter sidebar/dropdown
- Search bar with live filtering
- Swipeable task cards (mobile)
- Drag & drop for Kanban
- Task detail modal
- Quick add floating button

### Hearings Page

**Views:** List, Calendar, Timeline

**Key Features:**
- Status indicators with colors
- Court type badges
- Client names with avatars
- Date/time with countdown
- Location with map integration
- Notes preview

### Finance Page

**Sections:**
- Income/Expense summary cards
- Monthly chart
- Transaction list
- Invoice management
- Payment tracking

### Clients Page

**Features:**
- Grid/List view toggle
- Client cards with avatar
- Case count and status
- Contact info quick view
- Payment history
- Document links

### Settings Page

**Sections:**
- Profile settings
- Notification preferences
- Theme toggle
- Security settings
- Data export/import

---

## 🎯 Implementation Priorities

### Phase 1: Core Design System (Week 1)
- [ ] Update Tailwind config with new color palette
- [ ] Create base CSS variables
- [ ] Implement glassmorphism utilities
- [ ] Create animation keyframes
- [ ] Update typography system

### Phase 2: Component Updates (Week 2)
- [ ] Redesign all UI components (buttons, inputs, cards)
- [ ] Create new modal component
- [ ] Update navigation components
- [ ] Create badge and tag components
- [ ] Implement loading states

### Phase 3: Page Implementations (Week 3-4)
- [ ] Redesign login page
- [ ] Update dashboard page
- [ ] Redesign tasks page
- [ ] Update hearings page
- [ ] Redesign finance page
- [ ] Update clients page
- [ ] Redesign settings page

### Phase 4: Polish & Optimization (Week 5)
- [ ] Add micro-interactions
- [ ] Optimize animations
- [ ] Ensure accessibility
- [ ] Mobile responsiveness check
- [ ] Performance optimization
- [ ] Cross-browser testing

---

## 📦 New Dependencies

```bash
# Already installed:
- framer-motion (animations)
- lucide-react (icons)
- tailwindcss-animate (animations)
- class-variance-authority (component variants)

# May need to add:
- @headlessui/react (accessible UI components)
- react-hot-toast (notifications)
- recharts (charts and graphs)
```

---

## 🎨 Design Principles

1. **Consistency:** Use the same spacing, colors, and patterns throughout
2. **Hierarchy:** Clear visual hierarchy with typography and spacing
3. **Feedback:** Immediate visual feedback for all interactions
4. **Performance:** Optimize animations and transitions
5. **Accessibility:** WCAG 2.1 Level AA compliance
6. **Mobile-First:** Design for mobile, enhance for desktop
7. **Progressive Enhancement:** Core functionality works without JS
8. **Dark Mode:** Full dark mode support with automatic detection

---

## 🔍 Accessibility Guidelines

- Minimum touch target size: 44x44px
- Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Keyboard navigation for all interactive elements
- ARIA labels for screen readers
- Focus indicators clearly visible
- Motion can be reduced via prefers-reduced-motion

---

This specification document should be used as the single source of truth for the UI redesign implementation.
