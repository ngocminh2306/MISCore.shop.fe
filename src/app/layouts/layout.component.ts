import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ChatbotComponent } from '../components/chatbot/chatbot.component';
import { BackToTopComponent } from '../components/back-to-top/back-to-top.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ChatbotComponent, BackToTopComponent, NgIf],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-header></app-header>

      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>

      <!-- Back to Top Button -->
      <app-back-to-top></app-back-to-top>

      <!-- Chat Bot Floating Button -->
      <div class="fixed bottom-14 right-6 z-50">
        <div class="relative">
          <!-- Chat Toggle Button -->
          <button
            (click)="toggleChat()"
            class="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>

          <!-- Chat Window (hidden by default) -->
          <div
            *ngIf="showChat"
            class="absolute bottom-20 right-0 w-80 h-[450px] bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform z-10"
            style="box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
            <misc-chatbot (chatClosed)="closeChat()"></misc-chatbot>
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
export class LayoutComponent implements OnInit {
  showChat = false;

  ngOnInit(): void {
    console.log('LayoutComponent initialized');
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  closeChat(): void {
    this.showChat = false;
  }
}