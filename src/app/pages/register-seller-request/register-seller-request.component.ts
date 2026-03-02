import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageService } from '../../services/language.service';
import { SellerRegistrationService } from '../../services/seller-registration.service';
import { MessageDialogService } from '../../services/message-dialog.service';

@Component({
  selector: 'app-register-seller-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div class="w-full max-w-2xl">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- Gradient Header -->
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
            <h1 class="text-3xl font-bold text-white">{{ 'Register as Seller' | translate }}</h1>
            <p class="text-indigo-200 mt-2">{{ 'Start selling on our platform' | translate }}</p>
          </div>

          <!-- Form Content -->
          <div class="p-8">
            <form [formGroup]="sellerRequestForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Shop Name -->
              <div>
                <label for="shopName" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Shop Name' | translate }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="shopName"
                    type="text"
                    formControlName="shopName"
                    class="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="{{ 'Enter your shop name' | translate }}"
                  >
                </div>
                <div *ngIf="sellerRequestForm.get('shopName')?.invalid && sellerRequestForm.get('shopName')?.touched" class="mt-1 text-sm text-red-600">
                  <span *ngIf="sellerRequestForm.get('shopName')?.errors?.['required']">{{ 'Shop name is required' | translate }}</span>
                  <span *ngIf="sellerRequestForm.get('shopName')?.errors?.['minlength']">{{ 'Shop name must be at least 3 characters' | translate }}</span>
                </div>
              </div>

              <!-- Shop Description -->
              <div>
                <label for="shopDescription" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Shop Description' | translate }}</label>
                <textarea
                  id="shopDescription"
                  formControlName="shopDescription"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="{{ 'Describe your business and what you sell' | translate }}"
                ></textarea>
              </div>

              <!-- Business Information Section -->
              <div class="border-t border-gray-200 pt-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">{{ 'Business Information' | translate }}</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Business License Number -->
                  <div>
                    <label for="businessLicenseNumber" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Business License Number' | translate }}</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="businessLicenseNumber"
                        type="text"
                        formControlName="businessLicenseNumber"
                        class="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="{{ 'Enter license number' | translate }}"
                      >
                    </div>
                  </div>

                  <!-- Tax ID -->
                  <div>
                    <label for="taxId" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Tax ID' | translate }}</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="taxId"
                        type="text"
                        formControlName="taxId"
                        class="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="{{ 'Enter tax ID' | translate }}"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Information Section -->
              <div class="border-t border-gray-200 pt-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">{{ 'Contact Information' | translate }}</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Contact Email -->
                  <div>
                    <label for="contactEmail" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Contact Email' | translate }}</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        id="contactEmail"
                        type="email"
                        formControlName="contactEmail"
                        class="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="{{ 'Enter contact email' | translate }}"
                      >
                    </div>
                    <div *ngIf="sellerRequestForm.get('contactEmail')?.invalid && sellerRequestForm.get('contactEmail')?.touched" class="mt-1 text-sm text-red-600">
                      <span *ngIf="sellerRequestForm.get('contactEmail')?.errors?.['email']">{{ 'Please enter a valid email' | translate }}</span>
                    </div>
                  </div>

                  <!-- Contact Phone -->
                  <div>
                    <label for="contactPhone" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Contact Phone' | translate }}</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <input
                        id="contactPhone"
                        type="tel"
                        formControlName="contactPhone"
                        class="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="{{ 'Enter phone number' | translate }}"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Address Information Section -->
              <div class="border-t border-gray-200 pt-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">{{ 'Address Information' | translate }}</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Address -->
                  <div class="md:col-span-2">
                    <label for="address" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Address' | translate }}</label>
                    <input
                      id="address"
                      type="text"
                      formControlName="address"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="{{ 'Enter street address' | translate }}"
                    >
                  </div>

                  <!-- City -->
                  <div>
                    <label for="city" class="block text-sm font-medium text-gray-700 mb-1">{{ 'City' | translate }}</label>
                    <input
                      id="city"
                      type="text"
                      formControlName="city"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="{{ 'Enter city' | translate }}"
                    >
                  </div>

                  <!-- State/Province -->
                  <div>
                    <label for="state" class="block text-sm font-medium text-gray-700 mb-1">{{ 'State/Province' | translate }}</label>
                    <input
                      id="state"
                      type="text"
                      formControlName="state"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="{{ 'Enter state or province' | translate }}"
                    >
                  </div>

                  <!-- Postal Code -->
                  <div>
                    <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Postal Code' | translate }}</label>
                    <input
                      id="postalCode"
                      type="text"
                      formControlName="postalCode"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="{{ 'Enter postal code' | translate }}"
                    >
                  </div>

                  <!-- Country -->
                  <div>
                    <label for="country" class="block text-sm font-medium text-gray-700 mb-1">{{ 'Country' | translate }}</label>
                    <input
                      id="country"
                      type="text"
                      formControlName="country"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="{{ 'Enter country' | translate }}"
                    >
                  </div>
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    formControlName="acceptTerms"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  >
                </div>
                <div class="ml-3 text-sm">
                  <label for="terms" class="text-gray-700">
                    {{ 'I agree to the' | translate }} <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">{{ 'Terms and Conditions' | translate }}</a> {{ 'and' | translate }} <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">{{ 'Privacy Policy' | translate }}</a>
                  </label>
                  <div *ngIf="sellerRequestForm.get('acceptTerms')?.invalid && sellerRequestForm.get('acceptTerms')?.touched" class="mt-1 text-red-600">
                    {{ 'You must agree to the terms and conditions' | translate }}
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="pt-2">
                <button
                  type="submit"
                  [disabled]="sellerRequestForm.invalid || isSubmitting"
                  class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
                >
                  <span *ngIf="isSubmitting" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ 'Submitting request...' | translate }}
                  </span>
                  <span *ngIf="!isSubmitting">{{ 'Submit Seller Request' | translate }}</span>
                </button>
              </div>
            </form>

            <!-- Back to home link -->
            <div class="mt-8 text-center">
              <p class="text-sm text-gray-600">
                {{ 'Return to' | translate }}
                <a routerLink="/" class="font-medium text-indigo-600 hover:text-indigo-500">
                  {{ 'Home' | translate }}
                </a>
              </p>
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
export class RegisterSellerRequestComponent implements OnInit {
  sellerRequestForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    private sellerRegistrationService: SellerRegistrationService,
    private messageDialogService: MessageDialogService,
    private router: Router,
  ) {
    this.sellerRequestForm = this.fb.group({
      shopName: ['', [Validators.required, Validators.minLength(3)]],
      shopDescription: [''],
      businessLicenseNumber: [''],
      taxId: [''],
      contactEmail: ['', [Validators.email]],
      contactPhone: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    // In a real app, you might want to redirect if user is not logged in
  }

  onSubmit(): void {
    if (this.sellerRequestForm.valid) {
      this.isSubmitting = true;

      const formData = this.sellerRequestForm.value;

      // Call the seller registration API
      this.sellerRegistrationService.submitSellerRequest(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;

          // Show success message
          this.messageDialogService.success(
            this.languageService.getTranslation('Your seller registration request has been submitted successfully. We will review and contact you soon.'),
            this.languageService.getTranslation('Registration Request Submitted')
          );

          // Redirect to home or a confirmation page
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isSubmitting = false;

          // Show error message
          this.messageDialogService.error(
            error.message || this.languageService.getTranslation('An error occurred during submission. Please try again.'),
            this.languageService.getTranslation('Registration Request Failed')
          );
        }
      });
    } else {
      // Mark fields as touched to show validation errors
      this.sellerRequestForm.markAllAsTouched();
    }
  }
}