import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'product/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'order/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/products/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/orders/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'article/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'user-info',
    renderMode: RenderMode.Server
  },
  {
    path: 'edit-profile',
    renderMode: RenderMode.Server
  },
  {
    path: 'reset-password',
    renderMode: RenderMode.Server
  },
  {
    path: 'order-history',
    renderMode: RenderMode.Server
  },
  // Prerender static pages
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'contact',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'shipping-info',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'privacy-policy',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'help-center',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'returns',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Server
  },
  {
    path: 'register',
    renderMode: RenderMode.Server
  },
  {
    path: 'register-seller',
    renderMode: RenderMode.Server
  },
  {
    path: 'products',
    renderMode: RenderMode.Server
  },
  {
    path: 'cart',
    renderMode: RenderMode.Server
  },
  {
    path: 'checkout',
    renderMode: RenderMode.Server
  },
  // Catch all other routes that should use Server rendering
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
