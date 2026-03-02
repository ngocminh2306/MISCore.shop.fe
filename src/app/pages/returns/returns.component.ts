import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Return Policy</h1>
      
      <div class="prose prose-gray max-w-none">
        <p class="text-gray-600 mb-6">Last updated: {{ currentDate }}</p>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Return Period</h2>
          <p class="mb-4">
            We want you to be completely satisfied with your purchase. You have <strong>30 days</strong> 
            from the date of delivery to return items for a full refund. Items must be in new, 
            unused condition with all original packaging.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Eligible Items</h2>
          <p class="mb-4">Most items are eligible for return within 30 days, with the exception of:</p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Personalized or custom-made items</li>
            <li>Intimate apparel (for health and safety reasons)</li>
            <li>Perishable goods</li>
            <li>Items marked as final sale</li>
            <li>Digital downloads and gift cards</li>
          </ul>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">How to Return Items</h2>
          <h3 class="text-xl font-medium text-gray-800 mb-3">Option 1: Print Return Label</h3>
          <ol class="list-decimal pl-6 mb-6 space-y-2">
            <li>Log in to your account and access "My Orders"</li>
            <li>Select the order and items you wish to return</li>
            <li>Print the return shipping label</li>
            <li>Pack the items with all original packaging</li>
            <li>Securely attach the return label to the package</li>
            <li>Drop off the package at the designated carrier location</li>
          </ol>
          
          <h3 class="text-xl font-medium text-gray-800 mb-3">Option 2: Return at Store</h3>
          <p class="mb-4">
            You can also return items to any of our physical store locations. Bring the original 
            receipt or order confirmation along with the item.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Return Process</h2>
          <ol class="list-decimal pl-6 mb-4 space-y-2">
            <li>Once we receive your returned item, we will inspect it</li>
            <li>Upon approval, a refund will be processed to your original payment method</li>
            <li>You will receive a confirmation email when the refund is processed</li>
            <li>Refund processing typically takes 5-10 business days</li>
          </ol>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Refund Policy</h2>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Refunds are issued to the original payment method</li>
            <li>Original shipping charges are non-refundable</li>
            <li>Return shipping costs may apply depending on the return reason</li>
            <li>Gift cards will be refunded as store credit</li>
            <li>Discounted items will be refunded at the discounted price</li>
          </ul>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Exchanges</h2>
          <p class="mb-4">
            For exchanges, return your original item using our standard return process and place 
            a new order for the replacement item. If you need a different size or color, we 
            recommend placing a new order first to ensure availability, then returning your original item.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Damaged or Defective Items</h2>
          <p class="mb-4">
            If you receive a damaged, defective, or incorrect item, please contact us within 30 days. 
            We will provide a prepaid return label and either exchange the item or issue a full refund, 
            including any shipping charges paid.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Missing Items</h2>
          <p class="mb-4">
            If any items are missing from your order, please contact us within 7 days of delivery. 
            We will investigate the issue and send replacement items at no additional cost, or issue 
            a refund if the items are unavailable.
          </p>
        </section>
        
        <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-green-800 mb-2">Questions?</h3>
          <p class="text-green-700">
            If you have questions about our return policy, please contact our customer service
            team at <a href="mailto:returns&#64;shopname.com" class="text-green-600 hover:underline">returns&#64;shopname.com</a>
            or call <a href="tel:+15551234567" class="text-green-600 hover:underline">+1 (555) 123-4567</a>.
          </p>
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
export class ReturnsComponent {
  currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}