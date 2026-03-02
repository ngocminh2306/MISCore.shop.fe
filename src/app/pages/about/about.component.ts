import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
      
      <div class="prose prose-gray max-w-none">
        <section class="mb-8 text-center">
          <div class="bg-gray-200 border-2 border-dashed rounded-xl w-48 h-48 mx-auto mb-6"></div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Founded in 2015, ShopHub began with a simple mission: to provide customers with
            high-quality products at affordable prices, delivered with exceptional service.
            What started as a small online store has grown into a trusted destination for
            millions of customers worldwide.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p class="mb-4">
            Our mission is to make quality products accessible to everyone while providing 
            an outstanding shopping experience. We believe that everyone deserves to enjoy 
            premium products without breaking the bank, and we're committed to bringing 
            you the best value possible.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-medium text-gray-800 mb-2">Quality Guarantee</h3>
              <p class="text-gray-600">
                We carefully select and test every product to ensure it meets our high standards. 
                Our Quality Guarantee ensures you'll be satisfied with your purchase.
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-medium text-gray-800 mb-2">Fast Shipping</h3>
              <p class="text-gray-600">
                Our efficient fulfillment centers ensure your orders are processed and shipped 
                quickly. Choose from multiple shipping options to fit your needs.
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-medium text-gray-800 mb-2">Exceptional Support</h3>
              <p class="text-gray-600">
                Our customer service team is always ready to help with any questions or concerns. 
                We're committed to resolving issues quickly and professionally.
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
              <h3 class="text-xl font-medium text-gray-800 mb-2">Easy Returns</h3>
              <p class="text-gray-600">
                Not satisfied with your purchase? Our hassle-free return policy makes it easy 
                to get a refund or exchange within 30 days of delivery.
              </p>
            </div>
          </div>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
          <ul class="space-y-4">
            <li class="flex items-start">
              <div class="bg-indigo-100 text-indigo-800 rounded-full p-2 mr-4 flex-shrink-0">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-800">Integrity</h3>
                <p class="text-gray-600">
                  We believe in honest business practices and transparent communication with our customers.
                </p>
              </div>
            </li>
            <li class="flex items-start">
              <div class="bg-indigo-100 text-indigo-800 rounded-full p-2 mr-4 flex-shrink-0">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-800">Innovation</h3>
                <p class="text-gray-600">
                  We continuously seek new ways to improve our products and services to better serve our customers.
                </p>
              </div>
            </li>
            <li class="flex items-start">
              <div class="bg-indigo-100 text-indigo-800 rounded-full p-2 mr-4 flex-shrink-0">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-800">Customer Focus</h3>
                <p class="text-gray-600">
                  Our customers are at the center of everything we do. We listen to your feedback and adapt accordingly.
                </p>
              </div>
            </li>
          </ul>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
          <p class="mb-4">
            Our diverse team of professionals is dedicated to providing you with the best shopping experience. 
            From our product specialists who carefully curate our selection, to our customer service representatives 
            who are ready to assist you, every member of our team shares our commitment to excellence.
          </p>
          <p class="mb-4">
            We're proud to employ over 500 people across our headquarters, fulfillment centers, 
            and retail locations, all working together to bring you quality products and service.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Sustainability</h2>
          <p class="mb-4">
            We recognize our responsibility to the environment and future generations. 
            Our sustainability initiatives include:
          </p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Using eco-friendly packaging materials whenever possible</li>
            <li>Partnering with suppliers who follow sustainable practices</li>
            <li>Implementing energy-efficient operations in our facilities</li>
            <li>Supporting environmental initiatives and organizations</li>
            <li>Offering recycling programs for certain product categories</li>
          </ul>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Commitment</h2>
          <p class="mb-4">
            At ShopHub, we're committed to building lasting relationships with our customers, 
            suppliers, and communities. We continuously strive to earn your trust by delivering 
            on our promises and providing exceptional value.
          </p>
          <p class="mb-4">
            Thank you for choosing us as your shopping destination. We look forward to serving 
            you for years to come.
          </p>
        </section>
        
        <div class="bg-indigo-50 border border-indigo-200 p-6 rounded-lg text-center">
          <h3 class="text-lg font-semibold text-indigo-800 mb-2">Join Our Community</h3>
          <p class="text-indigo-700 mb-4">
            Stay updated with our latest products, special offers, and company news.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-3">
            <a 
              [routerLink]="['/contact']" 
              class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Contact Us
            </a>
            <a 
              [routerLink]="['/help-center']" 
              class="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-300 hover:bg-indigo-50 transition duration-300"
            >
              Visit Help Center
            </a>
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
export class AboutComponent { }