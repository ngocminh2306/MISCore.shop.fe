import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageDialogService, MessageDialogConfig } from '../../services/message-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'misc-message-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:px-6 sm:py-8 sm:items-start sm:justify-end z-50"
      *ngIf="currentConfig && isVisible">
      
      <div 
        class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300"
        [ngClass]="{
          'border-l-4 border-green-500': currentConfig.type === 'success',
          'border-l-4 border-red-500': currentConfig.type === 'error',
          'border-l-4 border-yellow-500': currentConfig.type === 'warning',
          'border-l-4 border-blue-500': currentConfig.type === 'info'
        }">
        
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <!-- Success icon -->
              <svg 
                *ngIf="currentConfig.type === 'success'" 
                class="h-6 w-6 text-green-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              
              <!-- Error icon -->
              <svg 
                *ngIf="currentConfig.type === 'error'" 
                class="h-6 w-6 text-red-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              
              <!-- Warning icon -->
              <svg 
                *ngIf="currentConfig.type === 'warning'" 
                class="h-6 w-6 text-yellow-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              
              <!-- Info icon -->
              <svg 
                *ngIf="currentConfig.type === 'info'" 
                class="h-6 w-6 text-blue-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">{{ currentConfig.title }}</p>
              <p class="mt-1 text-sm text-gray-500">{{ currentConfig.message }}</p>
            </div>
            
            <div class="ml-4 flex-shrink-0 flex">
              <button 
                *ngIf="currentConfig.showCloseButton" 
                type="button" 
                class="-mt-1 -mr-1 bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                (click)="close()">
                <span class="sr-only">Close</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class MessageDialogComponent implements OnInit {
  currentConfig: MessageDialogConfig | null = null;
  isVisible = false;
  private subscription: Subscription | null = null;

  constructor(private messageDialogService: MessageDialogService) {}

  ngOnInit(): void {
    this.subscription = this.messageDialogService.dialogState$.subscribe(state => {
      this.currentConfig = state.config;
      this.isVisible = state.isVisible;
    });
  }

  close(): void {
    this.messageDialogService.close();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}