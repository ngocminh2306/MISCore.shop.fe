import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'misc-footer',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <footer class="bg-gray-800 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">ShopHub</h3>
            <p class="text-gray-400">Your one-stop shop for all your needs. Quality products at competitive prices.</p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a [routerLink]="'/'" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a [routerLink]="'/products'" class="text-gray-400 hover:text-white transition-colors">Products</a></li>
              <li><a [routerLink]="'/about'" class="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a [routerLink]="'/contact'" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Customer Service</h3>
            <ul class="space-y-2">
              <li><a [routerLink]="'/help-center'" class="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a [routerLink]="'/returns'" class="text-gray-400 hover:text-white transition-colors">Returns</a></li>
              <li><a [routerLink]="'/shipping-info'" class="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a [routerLink]="'/privacy-policy'" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a [routerLink]="'/register-seller'" class="text-gray-400 hover:text-white transition-colors">{{ 'Register as Seller' | translate }}</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
            <address class="text-gray-400 not-italic">
              <p>123 Commerce Street</p>
              <p>Shopville, SV 12345</p>
              <p class="mt-2">Phone: (123) 456-7890</p>
              <p>Email: info&#64;shophub.com</p>
            </address>
          </div>
        </div>

        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {{ year }} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}