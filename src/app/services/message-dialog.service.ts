import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MessageDialogConfig {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  showCloseButton?: boolean;
  duration?: number; // Auto-close after duration in milliseconds, set to 0 for no auto-close
}

@Injectable({
  providedIn: 'root'
})
export class MessageDialogService {
  private dialogState = new BehaviorSubject<{ config: MessageDialogConfig | null, isVisible: boolean }>({ 
    config: null, 
    isVisible: false 
  });
  
  public dialogState$ = this.dialogState.asObservable();

  constructor() { }

  show(config: MessageDialogConfig): void {
    this.dialogState.next({ config, isVisible: true });
    
    // Auto-close if duration is specified
    if (config.duration && config.duration > 0) {
      setTimeout(() => {
        this.close();
      }, config.duration);
    }
  }

  close(): void {
    this.dialogState.next({ config: null, isVisible: false });
  }

  success(message: string, title: string = 'Success', duration?: number): void {
    this.show({ 
      title, 
      message, 
      type: 'success', 
      showCloseButton: true,
      duration: duration || 5000 // Default 5 seconds for success messages
    });
  }

  error(message: string, title: string = 'Error', duration?: number): void {
    this.show({ 
      title, 
      message, 
      type: 'error', 
      showCloseButton: true,
      duration: duration || 10000 // Default 10 seconds for error messages
    });
  }

  warning(message: string, title: string = 'Warning', duration?: number): void {
    this.show({ 
      title, 
      message, 
      type: 'warning', 
      showCloseButton: true,
      duration: duration || 8000 // Default 8 seconds for warning messages
    });
  }

  info(message: string, title: string = 'Information', duration?: number): void {
    this.show({ 
      title, 
      message, 
      type: 'info', 
      showCloseButton: true,
      duration: duration || 5000 // Default 5 seconds for info messages
    });
  }
}