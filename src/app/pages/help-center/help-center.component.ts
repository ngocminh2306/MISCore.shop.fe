import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Help Center</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Account Help</h2>
          <ul class="space-y-2">
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Create Account</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Login Issues</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Change Password</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Update Profile</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Delete Account</a></li>
          </ul>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Order Help</h2>
          <ul class="space-y-2">
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Track Your Order</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Modify Order</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Cancel Order</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Order Status</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Order History</a></li>
          </ul>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Payment Help</h2>
          <ul class="space-y-2">
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Payment Methods</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Billing Issues</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Refunds</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Charges Disputes</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Security</a></li>
          </ul>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Shipping Help</h2>
          <ul class="space-y-2">
            <li><a [routerLink]="['/shipping-info']" class="text-indigo-600 hover:text-indigo-800 hover:underline">Shipping Options</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Delivery Times</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Tracking</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">International Shipping</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Shipping Fees</a></li>
          </ul>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Returns & Exchanges</h2>
          <ul class="space-y-2">
            <li><a [routerLink]="['/returns']" class="text-indigo-600 hover:text-indigo-800 hover:underline">Return Policy</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">How to Return</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Exchange Process</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Refund Process</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Return Labels</a></li>
          </ul>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Products & Services</h2>
          <ul class="space-y-2">
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Product Information</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Product Manuals</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Warranty Information</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Size & Fit Guides</a></li>
            <li><a href="#" class="text-indigo-600 hover:text-indigo-800 hover:underline">Product Recalls</a></li>
          </ul>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
        
        <div class="space-y-4">
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-2">How do I track my order?</h3>
            <p class="text-gray-600">
              You can track your order by logging into your account and visiting the "My Orders" section. 
              You'll also receive tracking information via email when your order ships.
            </p>
          </div>
          
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-2">How long does shipping take?</h3>
            <p class="text-gray-600">
              Standard shipping typically takes 3-5 business days, express shipping takes 1-2 business days, 
              and overnight shipping delivers the next business day. International shipping times vary.
            </p>
          </div>
          
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-2">Can I return personalized items?</h3>
            <p class="text-gray-600">
              Personalized or custom-made items cannot be returned unless they are defective. 
              Please contact our customer service team if you have concerns about a personalized item.
            </p>
          </div>
          
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-2">What payment methods do you accept?</h3>
            <p class="text-gray-600">
              We accept all major credit cards (Visa, Mastercard, American Express, Discover), 
              PayPal, Apple Pay, Google Pay, and store gift cards.
            </p>
          </div>
          
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-800 mb-2">How do I change my account information?</h3>
            <p class="text-gray-600">
              Log in to your account and go to "Account Settings" where you can update your personal 
              information, shipping addresses, and payment methods.
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h2 class="text-xl font-semibold text-blue-800 mb-3">Still Need Help?</h2>
        <p class="text-blue-700 mb-4">
          If you can't find the answer to your question, our customer service team is here to help.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-1">Email Support</h3>
            <p class="text-sm text-gray-600">support&#64;shopname.com</p>
            <p class="text-xs text-gray-500">We respond within 24 hours</p>
          </div>
          <div class="bg-white p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-1">Phone Support</h3>
            <p class="text-sm text-gray-600">+1 (555) 123-4567</p>
            <p class="text-xs text-gray-500">Mon-Fri: 9AM-6PM EST</p>
          </div>
          <div class="bg-white p-4 rounded-lg">
            <h3 class="font-medium text-gray-800 mb-1">Live Chat</h3>
            <p class="text-sm text-gray-600">Available now</p>
            <button class="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">Start chat</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f9fafb;
      min-height: calc(100vh - 200px);
    }
  `]
})
export class HelpCenterComponent { }