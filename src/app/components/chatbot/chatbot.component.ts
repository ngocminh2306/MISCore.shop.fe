import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopAssistantService } from '../../../public-api/api/shopAssistant.service';
import { ShopAssistantQueryDto } from '../../../public-api/model/shopAssistantQueryDto';
import { catchError, of } from 'rxjs';

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'misc-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-full w-full">
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 flex items-center">
        <div class="relative">
          <div class="bg-indigo-500 rounded-full w-8 h-8 flex items-center justify-center md:w-10 md:h-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
        </div>
        <div class="ml-2 md:ml-3 flex-1">
          <h3 class="font-bold text-sm">Trợ lý ảo</h3>
          <p class="text-indigo-200 text-xs">Online now</p>
        </div>
        <button
          (click)="closeChat()"
          class="text-white hover:text-gray-200 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Chat Messages Container -->
      <div
        #chatContainer
        class="flex-1 overflow-y-auto p-2 space-y-3 bg-gray-50 max-h-[250px] md:max-h-[350px]">

        @for (message of messages; track message.id) {
          <div
            [class]="message.sender === 'user'
              ? 'flex justify-end'
              : 'flex justify-start'">

            <!-- Bot Message Bubble -->
            @if (message.sender === 'bot') {
              <div class="flex items-start space-x-1 md:space-x-2 max-w-[90%] sm:max-w-[80%]">
                <div class="bg-indigo-100 rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 md:h-4 w-3 md:w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div
                  class="px-2 py-1.5 md:px-3 md:py-2 rounded-2xl rounded-bl-none bg-white text-gray-800 shadow-sm border border-gray-200 text-xs md:text-sm">
                  @if (message.text.includes('Thinking...')) {
                    <div class="flex items-center">
                      <p>Thinking</p>
                      <span class="ml-1 animate-pulse">●</span><span class="ml-1 animate-pulse delay-75">●</span><span class="ml-1 animate-pulse delay-150">●</span>
                    </div>
                  } @else {
                    <p>{{ message.text }}</p>
                  }
                  <div class="text-xs text-gray-500 mt-1 text-right">
                    {{ message.timestamp | date:'shortTime' }}
                  </div>
                </div>
              </div>
            }

            <!-- User Message Bubble -->
            @if (message.sender === 'user') {
              <div class="flex items-end space-x-1 md:space-x-2 max-w-[90%] sm:max-w-[80%]">
                <div
                  class="px-2 py-1.5 md:px-3 md:py-2 rounded-2xl rounded-br-none bg-indigo-500 text-white shadow-sm text-xs md:text-sm">
                  <p>{{ message.text }}</p>
                  <div class="text-xs text-indigo-200 mt-1 text-right">
                    {{ message.timestamp | date:'shortTime' }}
                  </div>
                </div>
                <div class="bg-indigo-500 rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 md:h-4 w-3 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Input Area -->
      <div class="border-t border-gray-200 p-2 bg-white">
        <form (ngSubmit)="sendMessage()" class="flex items-center space-x-1">
          <input
            type="text"
            [(ngModel)]="newMessage"
            name="message"
            placeholder="Type a message..."
            [disabled]="isLoading"
            class="flex-1 text-xs md:text-sm border border-gray-300 rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-transparent"
            (keydown.enter)="sendMessage()"
          >
          <button
            type="submit"
            [disabled]="!newMessage.trim() || isLoading"
            class="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (isLoading) {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class ChatbotComponent implements OnInit, AfterViewInit {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  messages: Message[] = [
    { id: 1, text: "Xin chào! Tôi có thể giúp gì bạn?", sender: 'bot', timestamp: new Date(Date.now() - 300000) }
  ];
  
  newMessage = '';
  nextId = 4;
  isLoading = false;

  @Output() chatClosed = new EventEmitter<void>();

  constructor(private shopAssistantService: ShopAssistantService) { }

  ngOnInit(): void {
    // Initialize chatbot with welcome message if needed
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '' || this.isLoading) return;

    // Add user message
    this.messages.push({
      id: this.nextId++,
      text: this.newMessage,
      sender: 'user',
      timestamp: new Date()
    });

    // Auto-scroll to bottom
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);

    // Call the ShopAssistant API to get a response
    this.getBotResponse(this.newMessage);

    // Clear input
    this.newMessage = '';
  }

  getBotResponse(userMessage: string): void {
    if (this.isLoading) return; // Prevent multiple simultaneous requests

    this.isLoading = true;

    // Add a temporary loading message
    const loadingMessageId = this.nextId++;
    this.messages.push({
      id: loadingMessageId,
      text: 'Thinking...',
      sender: 'bot',
      timestamp: new Date()
    });

    setTimeout(() => {
      this.scrollToBottom();
    }, 0);

    // Prepare the query DTO
    const queryDto: ShopAssistantQueryDto = {
      userQuery: userMessage
    };

    // Call the ShopAssistant API
    this.shopAssistantService.apiShopAssistantAskPost(queryDto).pipe(
      catchError(error => {
        console.error('Error calling ShopAssistant API:', error);

        // Remove the loading message
        this.messages = this.messages.filter(msg => msg.id !== loadingMessageId);

        // Determine appropriate error message based on error type
        let errorMessage = 'Sorry, I encountered an issue processing your request. Please try again.';

        if (error.status === 401) {
          errorMessage = 'Authentication required. Please log in to continue using the assistant.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied. You may not have permission to use this feature.';
        } else if (error.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. The assistant service may be temporarily unavailable. Please try again later.';
        } else if (error.status === 0) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message) {
          errorMessage = `Error: ${error.message}`;
        }

        // Add an error message
        this.messages.push({
          id: this.nextId++,
          text: errorMessage,
          sender: 'bot',
          timestamp: new Date()
        });

        setTimeout(() => {
          this.scrollToBottom();
        }, 0);

        this.isLoading = false;

        return of(null);
      })
    ).subscribe(response => {
      // Remove the loading message
      this.messages = this.messages.filter(msg => msg.id !== loadingMessageId);

      if (response && response.success && response.data) {
        // Add the bot response
        this.messages.push({
          id: this.nextId++,
          text: response.data,
          sender: 'bot',
          timestamp: new Date()
        });
      } else if (response && !response.success) {
        // Handle unsuccessful response with more specific messages
        let errorMessage = response.message || 'Sorry, I could not process your request at this time.';

        // Customize error message based on the type of error returned by backend
        if (response.statusCode === 400) {
          errorMessage = response.message || 'Invalid request. Please try rephrasing your question.';
        } else if (response.statusCode === 429) {
          errorMessage = response.message || 'Rate limit exceeded. Please wait before sending another message.';
        } else if (response.statusCode === 500) {
          errorMessage = response.message || 'Internal server error. Please try again later.';
        }

        this.messages.push({
          id: this.nextId++,
          text: errorMessage,
          sender: 'bot',
          timestamp: new Date()
        });
      } else {
        // Handle unexpected response
        this.messages.push({
          id: this.nextId++,
          text: 'Sorry, I could not understand your request. Please try rephrasing.',
          sender: 'bot',
          timestamp: new Date()
        });
      }

      // Auto-scroll to bottom
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);

      this.isLoading = false;
    });
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
  
  closeChat(): void {
    this.chatClosed.emit();
  }
}