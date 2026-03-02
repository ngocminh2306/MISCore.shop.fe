# SignalR Notification Hub Integration Guide

This guide explains how to use the SignalR Notification Hub service in your Angular application.

## Service Overview

The `NotificationHubService` provides a complete solution for connecting to a .NET Core SignalR NotificationHub, handling real-time notifications, and managing the connection lifecycle.

## Basic Usage

### 1. Import the Service

```typescript
import { NotificationHubService } from './services/notification-hub.service';
```

### 2. Inject the Service

```typescript
constructor(private notificationHubService: NotificationHubService) {}
```

### 3. Connect to the Hub

```typescript
ngOnInit() {
  this.notificationHubService.startConnection('https://your-api-url/notificationhub', 'userId')
    .then(() => {
      console.log('Connected to notification hub');
    })
    .catch(error => {
      console.error('Failed to connect to notification hub:', error);
    });
}
```

### 4. Subscribe to Notifications

```typescript
ngOnInit() {
  this.notificationHubService.notifications$.subscribe(notifications => {
    console.log('Received notifications:', notifications);
    this.notifications = notifications;
  });
}
```

## Service Methods

### `startConnection(hubUrl: string, userId?: string): Promise<void>`
Establishes a connection to the SignalR hub. The `userId` parameter is optional and can be used to register the user with the hub.

### `stopConnection(): void`
Stops the current connection to the SignalR hub.

### `invoke<T>(methodName: string, ...args: any[]): Promise<T>`
Invokes a method on the hub and returns a promise with the result.

### `isConnected(): boolean`
Returns whether the connection is currently established.

### `getNotifications(): Notification[]`
Returns the current list of notifications.

### `clearNotifications(): void`
Clears all notifications.

### `markAsRead(notificationId: string): void`
Marks a specific notification as read.

## Notification Interface

The `Notification` interface has the following structure:

```typescript
interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId?: string;
  timestamp: Date | string;
  isRead: boolean;
  data?: any;
}
```

## Using the Notification Component

The `NotificationComponent` provides a ready-to-use UI for displaying notifications:

```html
<app-notification></app-notification>
```

## Configuration

The service uses `AppConfigService` to manage configuration. You can customize the hub URL by modifying the `AppConfigService`.

## Error Handling

The service includes proper error handling for:
- Connection failures
- Server-side rendering compatibility
- Invalid connection states

## Server-Side Rendering (SSR) Compatibility

The service properly handles server-side rendering by checking the platform before attempting to establish connections.

## Example Implementation

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationHubService } from '../services/notification-hub.service';
import { Notification } from '../models';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <h2>Notifications</h2>
      <div *ngFor="let notification of notifications">
        <h3>{{ notification.title }}</h3>
        <p>{{ notification.message }}</p>
        <small>{{ notification.timestamp | date:'short' }}</small>
      </div>
    </div>
  `
})
export class ExampleComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription = new Subscription();

  constructor(private notificationHubService: NotificationHubService) {}

  ngOnInit() {
    // Subscribe to notifications
    this.subscription.add(
      this.notificationHubService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
      })
    );

    // Connect to the hub
    this.notificationHubService.startConnection('https://your-api-url/notificationhub')
      .then(() => console.log('Connected'))
      .catch(error => console.error('Connection failed:', error));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.notificationHubService.stopConnection();
  }
}
```