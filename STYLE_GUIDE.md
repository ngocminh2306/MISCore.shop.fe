# CSS Style Guide - Home & Product Pages

This document outlines the CSS styling rules and conventions used across the Home and Product pages in the MISCore Shop frontend.

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Home Page Styles](#home-page-styles)
3. [Products Page Styles](#products-page-styles)
4. [Product Detail Page Styles](#product-detail-page-styles)
5. [Component Styles](#component-styles)
6. [Responsive Breakpoints](#responsive-breakpoints)
7. [Animation & Transitions](#animation--transitions)
8. [Best Practices](#best-practices)

---

## Design Tokens

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#f97316` (Orange-500) | Primary actions, prices, links |
| `--color-primary-hover` | `#ea580c` (Orange-600) | Hover states |
| `--color-primary-dark` | `#c2410c` (Orange-700) | Active states |
| `--color-secondary` | `#dc2626` (Red-600) | Buy now button, sale badges |
| `--color-success` | `#059669` (Green-600) | In stock status |
| `--color-danger` | `#ef4444` (Red-500) | Error states, out of stock |
| `--color-warning` | `#fbbf24` (Amber-400) | Ratings |
| `--color-info` | `#3b82f6` (Blue-500) | Information elements |

### Neutral Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-gray-50` | `#f9fafb` | Backgrounds |
| `--color-gray-100` | `#f3f4f6` | Alternate backgrounds |
| `--color-gray-200` | `#e5e7eb` | Borders |
| `--color-gray-300` | `#d1d5db` | Disabled states |
| `--color-gray-500` | `#6b7280` | Secondary text |
| `--color-gray-700` | `#374151` | Primary text |
| `--color-gray-900` | `#1f2937` | Headings |

### Typography

```css
/* Font Families */
--font-family-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-family-mono: 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-full: 9999px;  /* Pill shape */
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## Home Page Styles

### File: `home.component.css`

### Section Styling

```css
/* Main container */
:host {
  display: block;
  background-color: #ffffff;
}

/* Sections with scroll offset for fixed header */
section {
  scroll-margin-top: 80px;
}

/* Max-width container */
.container {
  max-width: 1400px;
}
```

### Section Titles

```css
.section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  position: relative;
  display: inline-block;
}

/* Orange underline accent */
.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #f97316 0%, #fb923c 100%);
  border-radius: 2px;
}
```

### View All Link

```css
.view-all-link {
  color: #f97316;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s ease;
}

.view-all-link:hover {
  color: #ea580c;
}

/* Arrow animation on hover */
.view-all-link span {
  transition: transform 0.2s ease;
}

.view-all-link:hover span {
  transform: translateX(4px);
}
```

### Product Grid Layout

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

/* Responsive grid columns */
@media (min-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}
```

### Loading Spinner

```css
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #f97316;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### Category Card Hover Effects

```css
.category-card {
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Image zoom on hover */
.category-card-image img {
  transition: transform 0.3s ease;
}

.category-card:hover .category-card-image img {
  transform: scale(1.1);
}
```

### Scroll Animations

```css
.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Products Page Styles

### File: `products.component.css`

### Page Layout

```css
:host {
  display: block;
  background-color: #f9fafb;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
}

/* Page title with underline */
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #f97316 0%, #fb923c 100%);
  border-radius: 2px;
}
```

### Filter Sidebar

```css
.filter-sidebar {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
              0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  position: sticky;
  top: 100px; /* Adjust based on header height */
}

.filter-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}
```

### Checkbox Styling

```css
.filter-checkbox {
  display: flex;
  align-items: center;
  padding: 0.375rem 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.filter-checkbox:hover {
  background-color: #f9fafb;
  border-radius: 0.25rem;
}

.filter-checkbox input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  accent-color: #4f46e5; /* Indigo accent */
  cursor: pointer;
}
```

### Price Range Inputs

```css
.price-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #1f2937;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.price-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
```

### Sort Dropdown

```css
.sort-dropdown {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  background-color: #ffffff;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.sort-dropdown:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
```

### Results Count

```css
.results-count {
  font-size: 0.875rem;
  color: #4b5563;
}

.results-count b {
  color: #f97316;
  font-weight: 600;
}
```

### Error State

```css
.error-container {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.error-content {
  display: flex;
  gap: 0.75rem;
}

.error-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  color: #ef4444;
}

.error-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #991b1b;
  margin-bottom: 0.25rem;
}

.error-message {
  font-size: 0.875rem;
  color: #b91c1c;
}
```

### Active Filter Tags

```css
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #1e40af;
}

.filter-tag-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #dbeafe;
  color: #1e40af;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tag-remove:hover {
  background-color: #bfdbfe;
}
```

### Pagination

```css
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1.5rem 0;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.pagination-button.active {
  background-color: #f97316;
  border-color: #f97316;
  color: #ffffff;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## Product Detail Page Styles

### File: `product-detail.component.css`

### Product Detail Card

```css
.product-detail-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
              0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
```

### Main Image

```css
.main-image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.main-image {
  width: 100%;
  max-height: 24rem;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.05);
}
```

### Thumbnail Images

```css
.thumbnails-container {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

/* Custom scrollbar for WebKit */
.thumbnails-container::-webkit-scrollbar {
  height: 6px;
}

.thumbnails-container::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.thumbnails-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.thumbnails-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.thumbnail {
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.thumbnail:hover {
  border-color: #f97316;
  transform: scale(1.05);
}

.thumbnail.active {
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}
```

### Product Price Display

```css
.product-price {
  margin-bottom: 1.5rem;
}

.price-wrapper {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.sale-price {
  font-size: 1.75rem;
  font-weight: 700;
  color: #f97316;
}

.original-price {
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.discount-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background-color: #ef4444;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.25rem;
}
```

### Quantity Selector

```css
.quantity-controls {
  display: flex;
  align-items: center;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  width: fit-content;
}

.quantity-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #ffffff;
  border: none;
  font-size: 1.25rem;
  font-weight: 700;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.quantity-btn:disabled {
  color: #d1d5db;
  cursor: not-allowed;
}

.quantity-value {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 2.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  background-color: #ffffff;
}
```

### Action Buttons

```css
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.btn-add-to-cart,
.btn-buy-now {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-to-cart {
  background-color: #f97316;
  color: #ffffff;
}

.btn-add-to-cart:hover:not(:disabled) {
  background-color: #ea580c;
}

.btn-buy-now {
  background-color: #dc2626;
  color: #ffffff;
}

.btn-buy-now:hover:not(:disabled) {
  background-color: #b91c1c;
}

.btn-add-to-cart:disabled,
.btn-buy-now:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
```

### Product Description

```css
.product-description-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.description-content :deep(p) {
  margin-bottom: 1rem;
}

.description-content :deep(ul),
.description-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.description-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  margin: 1rem 0;
}

.description-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.description-content :deep(th),
.description-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

.description-content :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
}
```

### Breadcrumb Navigation

```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #f97316;
}

.breadcrumb-separator {
  color: #d1d5db;
}

.breadcrumb-current {
  color: #1f2937;
  font-weight: 500;
}
```

---

## Component Styles

### Product Card

```css
/* Host display */
:host {
  display: block;
  width: 100%;
}

/* Card container */
.product-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Image hover effect */
.product-card-image img {
  transition: transform 0.3s ease;
}

.product-card:hover .product-card-image img {
  transform: scale(1.05);
}

/* Line clamp for product title */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Add to cart button (hover reveal) */
.add-to-cart-button {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .add-to-cart-button {
  opacity: 1;
}
```

---

## Responsive Breakpoints

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Approach

```css
/* Base styles (mobile) */
.product-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
```

### Mobile-Specific Adjustments

```css
@media (max-width: 767px) {
  /* Fixed bottom action buttons */
  .action-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background-color: #ffffff;
    border-top: 1px solid #e5e7eb;
    z-index: 40;
  }

  /* Full-width filter sidebar */
  .filter-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    border-radius: 0;
    overflow-y: auto;
  }

  /* Smaller typography */
  .page-title {
    font-size: 1.5rem;
  }

  .product-title {
    font-size: 1.25rem;
  }

  .sale-price {
    font-size: 1.5rem;
  }
}
```

---

## Animation & Transitions

### Transition Timing

```css
/* Fast transitions (100-200ms) */
.transition-fast {
  transition: all 0.2s ease;
}

/* Normal transitions (200-300ms) */
.transition-normal {
  transition: all 0.3s ease;
}

/* Slow transitions (300-500ms) */
.transition-slow {
  transition: all 0.5s ease;
}
```

### Common Animations

```css
/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Fade in up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Spin (for loaders) */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Pulse (for loading states) */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Slide in from right */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Hover Effects

```css
/* Lift effect */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Scale effect */
.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Color transition */
.hover-color {
  transition: color 0.2s ease, background-color 0.2s ease;
}
```

---

## Best Practices

### 1. CSS Class Naming Conventions

Use BEM-like naming for complex components:

```css
/* Block */
.product-card { }

/* Element */
.product-card__image { }
.product-card__title { }

/* Modifier */
.product-card--featured { }
.product-card__title--large { }
```

### 2. Specificity Management

- Use single classes over nested selectors when possible
- Avoid `!important` unless absolutely necessary
- Use CSS custom properties for theming

```css
/* Good */
.product-title {
  color: var(--color-primary);
}

/* Avoid */
.product-detail .product-info .product-title {
  color: #f97316 !important;
}
```

### 3. Performance Optimization

```css
/* Use transform and opacity for animations (GPU accelerated) */
.good-animation {
  transform: translateX(0);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Avoid animating layout properties */
.bad-animation {
  width: 100%;
  margin-left: 0;
  transition: width 0.3s ease, margin-left 0.3s ease;
}
```

### 4. Accessibility

```css
/* Focus states for keyboard navigation */
button:focus,
a:focus,
input:focus {
  outline: 2px solid #f97316;
  outline-offset: 2px;
}

/* Remove focus outline only when using mouse */
button:focus:not(:focus-visible) {
  outline: none;
}

button:focus-visible {
  outline: 2px solid #f97316;
  outline-offset: 2px;
}

/* Reduced motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. Dark Mode Support (Future)

```css
@media (prefers-color-scheme: dark) {
  :host {
    background-color: #1f2937;
  }

  .product-card {
    background-color: #374151;
    border-color: #4b5563;
  }

  .product-title {
    color: #f9fafb;
  }
}
```

### 6. Print Styles

```css
@media print {
  .no-print,
  .action-buttons,
  .filter-sidebar {
    display: none !important;
  }

  .product-detail-card {
    box-shadow: none;
    border: 1px solid #000;
  }
}
```

---

## File Structure

```
src/app/pages/
├── home/
│   ├── home.component.ts
│   ├── home.component.html
│   ├── home.component.css      ← Home page styles
│   └── home.component.spec.ts
├── products/
│   ├── products.component.ts
│   ├── products.component.html
│   ├── products.component.css  ← Products listing styles
│   └── products.component.spec.ts
├── product-detail/
│   ├── product-detail.component.ts
│   ├── product-detail.component.html
│   ├── product-detail.component.css  ← Product detail styles
│   └── product-detail.component.spec.ts
└── STYLE_GUIDE.md              ← This document
```

---

## Quick Reference

### Common Utility Classes (Tailwind)

```css
/* Layout */
.container mx-auto px-4
.flex flex-col md:flex-row
.grid grid-cols-2 md:grid-cols-4

/* Spacing */
.p-4, .px-4, .py-4
.m-4, .mx-4, .my-4
.gap-4

/* Typography */
.text-sm, text-base, text-lg
.font-medium, font-semibold, font-bold
.text-gray-700, text-orange-500

/* Colors */
.bg-white, bg-gray-50, bg-orange-500
.text-white, text-gray-700, text-orange-500
.border-gray-200, border-orange-500

/* Effects */
.shadow, shadow-md, shadow-lg
.rounded, rounded-lg, rounded-full
.hover:bg-orange-600
.transition, transition-all
```

### CSS Custom Properties Usage

```css
/* Define in :root or component */
:host {
  --primary-color: #f97316;
  --spacing-unit: 0.25rem;
}

/* Use in component */
.product-title {
  color: var(--primary-color);
  margin-bottom: calc(var(--spacing-unit) * 4);
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-28 | Initial style guide creation |

---

## Contact & Support

For questions about styling conventions, refer to:
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- Project maintainers
