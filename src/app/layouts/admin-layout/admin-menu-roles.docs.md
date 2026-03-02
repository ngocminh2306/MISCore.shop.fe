# Role-Based Admin Menu

This document explains how the role-based access control works in the admin layout menu.

## Overview

The admin layout component now supports role-based access control for menu items. Each menu item can specify which roles are allowed to view and access it.

## Implementation

### Menu Structure

Each menu item can now include an `allowedRoles` property:

```typescript
{
  label: 'admin.dashboard',
  icon: 'pi pi-home',
  routerLink: '/admin/dashboard',
  exact: true,
  allowedRoles: ['admin', 'moderator'] // Only admins and moderators can access
}
```

### Role Checking

- If `allowedRoles` is not specified or is an empty array `[]`, the menu item is accessible to all users
- If `allowedRoles` contains specific roles, only users with ALL of those roles can access the item
- The `*ifHasRoles` directive is used to conditionally render menu items based on user roles

### Menu Item Properties

- `label`: The display text for the menu item (supports translation)
- `icon`: PrimeIcons class for the menu icon
- `routerLink`: The route to navigate to when clicked
- `exact`: Whether to match the route exactly (for single items)
- `expanded`: Whether the submenu is expanded (for parent items)
- `children`: Array of submenu items
- `allowedRoles`: Array of roles that can access this menu item

### Submenu Support

Both parent menu items and child menu items can have role restrictions:

```typescript
{
  label: 'admin.user_management',
  expanded: true,
  allowedRoles: ['admin', 'hr'], // Parent menu restriction
  children: [
    {
      label: 'admin.users',
      icon: 'pi pi-users',
      routerLink: '/admin/users',
      allowedRoles: ['admin', 'hr'] // Child menu restriction
    }
  ]
}
```

## Available Roles

Common roles used in the system:
- `admin`: Full administrative access
- `moderator`: Content moderation access
- `hr`: Human resources access
- `product-manager`: Product management access
- `content-manager`: Content management access
- `marketing`: Marketing access
- `sales-manager`: Sales management access
- `support`: Customer support access
- `operations`: Operations access
- `security`: Security access
- `author`: Content author access
- `fulfillment`: Order fulfillment access
- `business-manager`: Business management access
- `tech-manager`: Technical management access
- `events-manager`: Events management access
- `legal`: Legal access

## Usage

The role-based menu system will automatically show/hide menu items based on the current user's roles. No additional code is needed in components that use this layout.