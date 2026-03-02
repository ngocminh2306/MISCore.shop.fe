import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shipping-info',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Shipping Information</h1>
      
      <div class="prose prose-gray max-w-none">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Shipping Options</h2>
          
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead class="bg-gray-50">
                <tr>
                  <th class="py-3 px-4 text-left font-semibold text-gray-700 border-b">Shipping Method</th>
                  <th class="py-3 px-4 text-left font-semibold text-gray-700 border-b">Delivery Time</th>
                  <th class="py-3 px-4 text-left font-semibold text-gray-700 border-b">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4 font-medium">Standard Shipping</td>
                  <td class="py-3 px-4">3-5 business days</td>
                  <td class="py-3 px-4">$5.99</td>
                </tr>
                <tr class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4 font-medium">Express Shipping</td>
                  <td class="py-3 px-4">1-2 business days</td>
                  <td class="py-3 px-4">$12.99</td>
                </tr>
                <tr class="border-b hover:bg-gray-50">
                  <td class="py-3 px-4 font-medium">Overnight Shipping</td>
                  <td class="py-3 px-4">Next business day</td>
                  <td class="py-3 px-4">$24.99</td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="py-3 px-4 font-medium">Free Standard Shipping</td>
                  <td class="py-3 px-4">3-5 business days</td>
                  <td class="py-3 px-4">Orders over $75</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Shipping Restrictions</h2>
          <p class="mb-4">
            We ship to all 50 states in the United States and to most international destinations. 
            However, some products may have shipping restrictions due to size, weight, or regulations.
          </p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Hazardous materials cannot be shipped via standard carriers</li>
            <li>Large items may require special delivery arrangements</li>
            <li>International orders may be subject to customs fees</li>
            <li>Remote locations may have extended delivery times</li>
          </ul>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Processing Time</h2>
          <p class="mb-4">
            Orders are typically processed within 1-2 business days. Orders placed after 2 PM EST 
            may be processed the following business day. During peak periods (holidays, sales), 
            processing may take up to 3 business days.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Tracking Your Order</h2>
          <p class="mb-4">
            Once your order ships, you will receive a shipping confirmation email with a tracking number. 
            You can track your order status by logging into your account or using the tracking link 
            in your confirmation email.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Delivery</h2>
          <p class="mb-4">
            Standard and express orders are delivered by our shipping partners. 
            Signature may be required for orders over $200 or at the shipper's discretion. 
            If you are not available to receive delivery, the carrier will leave a notice 
            with instructions for rescheduling or pickup.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">International Shipping</h2>
          <p class="mb-4">
            For international orders, customs duties and taxes may apply and are the responsibility 
            of the recipient. These fees vary by destination country and are not included in the 
            shipping cost at checkout. Delivery times for international orders vary by destination 
            and may take 7-20 business days or longer.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Damaged or Lost Packages</h2>
          <p class="mb-4">
            If your package is damaged or appears to be lost, please contact us within 30 days 
            of the estimated delivery date. We will work with the carrier to investigate and 
            resolve the issue, including sending replacement items if necessary.
          </p>
        </section>
        
        <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-blue-800 mb-2">Need Help?</h3>
          <p class="text-blue-700">
            If you have questions about shipping, contact our customer service team at
            <a href="mailto:support&#64;shopname.com" class="text-blue-600 hover:underline">support&#64;shopname.com</a>
            or call <a href="tel:+15551234567" class="text-blue-600 hover:underline">+1 (555) 123-4567</a>.
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
    
    table {
      border-collapse: collapse;
    }
    
    th, td {
      border: 1px solid #e5e7eb;
    }
  `]
})
export class ShippingInfoComponent { }