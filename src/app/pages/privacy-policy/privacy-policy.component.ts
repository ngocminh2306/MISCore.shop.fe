import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
      
      <div class="prose prose-gray max-w-none">
        <p class="text-gray-600 mb-6">Last updated: {{ currentDate }}</p>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
          <p class="mb-4">
            Your privacy is important to us. This Privacy Policy explains how [Shop Name] ("we", "us", or "our") 
            collects, uses, and protects your personal information when you use our website and services.
          </p>
          <p class="mb-4">
            By using our services, you consent to the collection and use of information in accordance with this policy.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
          <p class="mb-4">We collect the following types of information:</p>
          
          <h3 class="text-xl font-medium text-gray-800 mb-2">Personal Information</h3>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Name and contact information</li>
            <li>Email address</li>
            <li>Shipping and billing addresses</li>
            <li>Phone number</li>
            <li>Payment information</li>
          </ul>
          
          <h3 class="text-xl font-medium text-gray-800 mb-2">Usage Information</h3>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Pages visited on our website</li>
            <li>Time and date of visits</li>
            <li>Browser and device information</li>
            <li>IP address</li>
            <li>Referral source</li>
          </ul>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
          <p class="mb-4">We use your information to:</p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Provide customer service and support</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Personalize your shopping experience</li>
            <li>Send promotional emails (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Information Sharing</h2>
          <p class="mb-4">
            We do not sell, trade, or rent your personal information to third parties. 
            We may share your information with:
          </p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Service providers who assist us in business operations (payment processors, shipping companies)</li>
            <li>Third parties to investigate potential violations of our policies</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
          <p class="mb-4">
            We implement appropriate security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. 
            All transactions are processed through secure payment gateways using industry-standard encryption.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
          <p class="mb-4">You have the right to:</p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Access your personal information</li>
            <li>Request corrections to inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt-out of marketing communications</li>
            <li>File a complaint with a supervisory authority</li>
          </ul>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Cookies</h2>
          <p class="mb-4">
            We use cookies to enhance your browsing experience, analyze site usage, 
            and customize content. You can control cookie usage through your browser settings.
          </p>
        </section>
        
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p class="mb-4">
            If you have questions about this Privacy Policy or wish to exercise your rights, 
            please contact us at:
          </p>
          <p class="mb-4">
            <strong>Email:</strong> privacy&#64;shopname.com<br>
            <strong>Phone:</strong> +1 (555) 123-4567
          </p>
        </section>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">
            This Privacy Policy may be updated from time to time. We will notify you of significant changes 
            by posting the new policy on our website or by other means.
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
export class PrivacyPolicyComponent {
  currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}