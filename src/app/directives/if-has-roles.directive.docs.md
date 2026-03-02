# IfHasRoles Directive

The `*ifHasRoles` directive conditionally displays content based on whether the currently logged-in user has ALL of the specified roles.

## Usage

### Basic Usage
```html
<div *ifHasRoles="['admin']">
  <p>This content is only visible to users with 'admin' role</p>
</div>
```

### Multiple Roles (All Required)
```html
<div *ifHasRoles="['admin', 'moderator']">
  <p>This content is only visible to users who have BOTH 'admin' AND 'moderator' roles</p>
</div>
```

### Complex Role Combinations
```html
<div *ifHasRoles="['admin', 'editor', 'publisher']">
  <p>This content requires ALL three roles: admin, editor, and publisher</p>
</div>
```

### With Other Structural Directives
```html
<div *ifHasRoles="['admin']" *ngIf="someCondition">
  <p>Content visible to admins only when someCondition is true</p>
</div>
```

## How It Works

- The directive subscribes to the `currentUser$` observable from `AuthService`
- It checks if the logged-in user has ALL the roles specified in the input array
- If the user has all required roles, the content is rendered
- If the user doesn't have all required roles, the content is not displayed
- The directive automatically handles user authentication state changes

## Important Notes

- The user must have ALL specified roles (not just one of them)
- If no roles are specified or the user is not logged in, the content will not be displayed
- The directive only evaluates the roles once when the component is initialized
- For dynamic role checking, consider using the AuthService directly in your component