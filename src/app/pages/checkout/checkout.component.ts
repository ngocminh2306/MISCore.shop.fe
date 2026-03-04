import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageDialogService } from '../../services/message-dialog.service';
import { CurrencyPipe } from '@angular/common';
import { AccountService, AddressService, OrderService, VnPayService } from '../../../public-api';
import { CartService } from '../../services/cart.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

interface UserAddress {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  isDefault: boolean;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  thumbnailUrl: string;
}

interface CartSummary {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Shipping Information -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Thông tin vận chuyển</h2>
            <button
              (click)="autoFillUserInfo()"
              class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Auto-fill User Info
            </button>
          </div>

          <!-- Existing Address Selection -->
          <div class="mb-4">
            <label for="shippingAddress" class="block text-sm font-medium text-gray-700 mb-1">Select Shipping Address</label>
            <select
              id="shippingAddress"
              (change)="onShippingAddressChange($event)"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              [disabled]="showShippingAddressForm">
              <option value="">-- Select an address --</option>
              @for (addr of userAddresses; track addr.id) {
                <option [value]="addr.id" [selected]="shippingAddress?.id === addr.id">
                  {{ addr.firstName }} {{ addr.lastName }}, {{ addr.address }}, {{ addr.city }}, {{ addr.state }}
                </option>
              }
              <option value="new" [selected]="showShippingAddressForm">+ Add New Address</option>
            </select>
          </div>

          <!-- Shipping Address Form -->
          @if(showShippingAddressForm) {
            <form [formGroup]="checkoutForm" class="space-y-4 mb-6 border p-4 rounded-md">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    formControlName="firstName"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('firstName')?.invalid && checkoutForm.get('firstName')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      First name is required and must be at least 2 characters
                    </div>
                  }
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    formControlName="lastName"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    @if(checkoutForm.get('lastName')?.invalid && checkoutForm.get('lastName')?.touched){
                      <div class="text-red-500 text-sm mt-1">
                        Last name is required and must be at least 2 characters
                      </div>
                    }
                </div>
              </div>

              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  formControlName="address"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('address')?.invalid && checkoutForm.get('address')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      Address is required and must be at least 5 characters
                    </div>
                  }
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    formControlName="city"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    @if(checkoutForm.get('city')?.invalid && checkoutForm.get('city')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      City is required and must be at least 2 characters
                    </div>
                    }
                </div>
                <div>
                  <label for="state" class="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    id="state"
                    formControlName="state"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('state')?.invalid && checkoutForm.get('state')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      State is required and must be at least 2 characters
                    </div>
                  }
                </div>
                <div>
                  <label for="zipCode" class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    formControlName="zipCode"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('zipCode')?.invalid && checkoutForm.get('zipCode')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      ZIP code is required and must be 5 digits
                    </div>
                  }
                </div>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  formControlName="phone"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('phone')?.invalid && checkoutForm.get('phone')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      Phone number is required and must be valid
                    </div>
                  }
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('email')?.invalid && checkoutForm.get('email')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      Email is required and must be valid
                    </div>
                  }
              </div>

              <button
                type="button"
                (click)="createShippingAddress()"
                class="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700">
                Save Shipping Address
              </button>
            </form>
          }

          @if(!showShippingAddressForm) {
            <form [formGroup]="checkoutForm" class="space-y-4">
              <!-- If no address form is shown, just show the form fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    formControlName="firstName"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('firstName')?.invalid && checkoutForm.get('firstName')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      First name is required and must be at least 2 characters
                    </div>
                  }
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    formControlName="lastName"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('lastName')?.invalid && checkoutForm.get('lastName')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      Last name is required and must be at least 2 characters
                    </div>
                  }
                </div>
              </div>

              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  formControlName="address"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                @if(checkoutForm.get('address')?.invalid && checkoutForm.get('address')?.touched){
                  <div class="text-red-500 text-sm mt-1">
                    Address is required and must be at least 5 characters
                  </div>
                }
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    formControlName="city"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('city')?.invalid && checkoutForm.get('city')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      City is required and must be at least 2 characters
                    </div>
                  }
                </div>
                <div>
                  <label for="state" class="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    id="state"
                    formControlName="state"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('state')?.invalid && checkoutForm.get('state')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      State is required and must be at least 2 characters
                    </div>
                  }
                </div>
                <div>
                  <label for="zipCode" class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    formControlName="zipCode"
                    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('zipCode')?.invalid && checkoutForm.get('zipCode')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      ZIP code is required and must be 5 digits
                    </div>
                  }
                </div>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  formControlName="phone"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('phone')?.invalid && checkoutForm.get('phone')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      Phone number is required and must be valid
                    </div>
                  }
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  @if(checkoutForm.get('email')?.invalid && checkoutForm.get('email')?.touched){
                    <div class="text-red-500 text-sm mt-1">
                      Email is required and must be valid
                    </div>
                  }
              </div>
            </form>
          }

          <!-- Billing Address Section -->
          <div class="mt-6">
            <div class="flex items-center mb-4">
              <input
                type="checkbox"
                id="sameAsShipping"
                formControlName="isSameAsShipping"
                class="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                (change)="onSameAsShippingChange()">
              <label for="sameAsShipping" class="ml-2 block text-sm text-gray-900">
                Bill to same address as shipping
              </label>
            </div>

            @if(!checkoutForm.get('isSameAsShipping')?.value) {
              <!-- Billing Address Selection -->
              <div class="mb-4">
                <label for="billingAddress" class="block text-sm font-medium text-gray-700 mb-1">Select Billing Address</label>
                <select
                  id="billingAddress"
                  (change)="onBillingAddressChange($event)"
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  [disabled]="showBillingAddressForm">
                  <option value="">-- Select an address --</option>
                  @for (addr of userAddresses; track addr.id) {
                    <option [value]="addr.id" [selected]="billingAddress?.id === addr.id">
                      {{ addr.firstName }} {{ addr.lastName }}, {{ addr.address }}, {{ addr.city }}, {{ addr.state }}
                    </option>
                  }
                  <option value="new" [selected]="showBillingAddressForm">+ Add New Address</option>
                </select>
              </div>

              <!-- Billing Address Form -->
              @if(showBillingAddressForm) {
                <div class="space-y-4 border-t pt-4 p-4 rounded-md">
                  <h3 class="text-lg font-medium text-gray-900">New Billing Address</h3>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="billingFirstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        id="billingFirstName"
                        formControlName="billingFirstName"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div>
                      <label for="billingLastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        id="billingLastName"
                        formControlName="billingLastName"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                  </div>

                  <div>
                    <label for="billingAddress" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      id="billingAddress"
                      formControlName="billingAddress"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label for="billingCity" class="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        id="billingCity"
                        formControlName="billingCity"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div>
                      <label for="billingState" class="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        id="billingState"
                        formControlName="billingState"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div>
                      <label for="billingZipCode" class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        id="billingZipCode"
                        formControlName="billingZipCode"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                  </div>

                  <button
                    type="button"
                    (click)="createBillingAddress()"
                    class="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700">
                    Save Billing Address
                  </button>
                </div>
              }

              @if(!showBillingAddressForm && !checkoutForm.get('isSameAsShipping')?.value) {
                <div class="space-y-4 border-t pt-4">
                  <h3 class="text-lg font-medium text-gray-900">Billing Address</h3>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="billingFirstNameDisplay" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        id="billingFirstNameDisplay"
                        formControlName="billingFirstName"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div>
                      <label for="billingLastNameDisplay" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        id="billingLastNameDisplay"
                        formControlName="billingLastName"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                  </div>

                  <div>
                    <label for="billingAddressDisplay" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      id="billingAddressDisplay"
                      formControlName="billingAddress"
                      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label for="billingCityDisplay" class="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        id="billingCityDisplay"
                        formControlName="billingCity"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div>
                      <label for="billingStateDisplay" class="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        id="billingStateDisplay"
                        formControlName="billingState"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    <div>
                      <label for="billingZipCodeDisplay" class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        id="billingZipCodeDisplay"
                        formControlName="billingZipCode"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                  </div>
                </div>
              }
            }
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Order Summary</h2>

          <div class="space-y-4 mb-6">
            @for (item of cartItems; track item.id) {
              <div class="flex justify-between items-center pb-3 border-b">
                <div>
                  <h3 class="font-medium">{{ item.name }}</h3>
                  <p class="text-gray-600 text-sm">Qty: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium">{{ (item.price * item.quantity) | currency }}</p>
                </div>
              </div>
            }
          </div>

          <div class="space-y-2 mb-6">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>{{ cartSummary.subtotal | currency }}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span>{{ cartSummary.shipping | currency }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tax</span>
              <span>{{ cartSummary.tax | currency }}</span>
            </div>
            <div class="flex justify-between font-bold text-lg pt-3 border-t">
              <span>Total</span>
              <span>{{ cartSummary.total | currency }}</span>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Payment Method</h3>
            <div class="space-y-2">
              <label for="creditCard" class="flex items-center">
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="creditCard"
                  formControlName="paymentMethod"
                  class="mr-2"
                  checked>
                <span>Credit Card</span>
              </label>
              <label for="paypal" class="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  formControlName="paymentMethod"
                  class="mr-2">
                <span>PayPal</span>
              </label>
              <label for="bankTransfer" class="flex items-center">
                <input
                  type="radio"
                  id="bankTransfer"
                  name="paymentMethod"
                  value="bankTransfer"
                  formControlName="paymentMethod"
                  class="mr-2">
                <span>Bank Transfer</span>
              </label>
              <label for="vnpay" class="flex items-center">
                <input
                  type="radio"
                  id="vnpay"
                  name="paymentMethod"
                  value="vnpay"
                  formControlName="paymentMethod"
                  class="mr-2">
                <span>VNPay</span>
              </label>
            </div>
          </div>

          <button
            (click)="placeOrder()"
            [disabled]="checkoutForm.invalid || isProcessing"
            class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            @if (isProcessing) {
              <span class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            } @else {
              Place Order
            }
          </button>
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
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private addressService = inject(AddressService);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private messageDialogService = inject(MessageDialogService);
  private vnPayService = inject(VnPayService);
  private platformId = inject(PLATFORM_ID);

  checkoutForm: FormGroup;
  isProcessing = false;
  cartItems: CartItem[] = [];
  cartSummary: CartSummary = {
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  };

  constructor() {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5,}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      isSameAsShipping: [true], // By default, billing same as shipping
      // Billing Address (initially hidden)
      billingFirstName: [''],
      billingLastName: [''],
      billingAddress: [''],
      billingCity: [''],
      billingState: [''],
      billingZipCode: [''],
      paymentMethod: ['creditCard'] // Default to credit card
    });
  }

  userAddresses: UserAddress[] = [];
  shippingAddress: UserAddress | null = null;
  billingAddress: UserAddress | null = null;
  showShippingAddressForm = false;
  showBillingAddressForm = false;

  ngOnInit(): void {
    // Load user data if available and auto-fill
    this.loadUserData();
    // Load user addresses if available
    this.loadUserAddresses();
    // Load cart summary (you would get this from cart service in a real implementation)
    this.loadCartData();
  }

  loadUserAddresses(): void {
    // Load all user addresses
    this.addressService.apiAddressGet().subscribe({
      next: (response: any) => {
        // Process the response to match our UserAddress interface
        const addresses = response.data || [];
        this.userAddresses = Array.isArray(addresses) ? addresses.map((addr: any) => ({
          id: addr.id || 0,
          firstName: addr.firstName || '',
          lastName: addr.lastName || '',
          address: addr.addressLine1 || '',
          city: addr.city || '',
          state: addr.state || '',
          zipCode: addr.postalCode || '',
          phone: addr.phoneNumber || '',
          email: addr.email || '',
          isDefault: addr.isDefault || false
        })) : [];

        // Get default shipping and billing addresses
        this.loadShippingAddress();
        this.loadBillingAddress();
      },
      error: (error) => {
        console.error('Error loading user addresses:', error);
        // Continue without addresses
      }
    });
  }

  loadShippingAddress(): void {
    // First try to get the default shipping address
    this.addressService.apiAddressShippingGet().subscribe({
      next: (res: any) => {
        let response = res.data;
        if (response) {
          this.shippingAddress = {
            id: response.id || 0,
            firstName: response.firstName || '',
            lastName: response.lastName || '',
            address: response.addressLine1 || '',
            city: response.city || '',
            state: response.state || '',
            zipCode: response.postalCode || '',
            phone: response.phoneNumber || '',
            email: response.email || '',
            isDefault: response.isDefault || false
          };
          // Auto-fill the form with shipping address
          this.fillShippingAddressForm();
        } else {
          // If no shipping address found, check if there's a default address
          const defaultAddress = this.userAddresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            this.shippingAddress = defaultAddress;
            this.fillShippingAddressForm();
          } else if (this.userAddresses.length > 0) {
            // Use first address as shipping if available
            this.shippingAddress = this.userAddresses[0];
            this.fillShippingAddressForm();
          } else {
            // No addresses found - show form to add shipping address
            this.showShippingAddressForm = true;
          }
        }
      },
      error: (error) => {
        console.error('Error loading shipping address:', error);
        // Fallback to default address if available
        const defaultAddress = this.userAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          this.shippingAddress = defaultAddress;
          this.fillShippingAddressForm();
        } else if (this.userAddresses.length > 0) {
          this.shippingAddress = this.userAddresses[0];
          this.fillShippingAddressForm();
        } else {
          this.showShippingAddressForm = true;
        }
      }
    });
  }

  loadBillingAddress(): void {
    // First try to get the default billing address
    this.addressService.apiAddressBillingGet().subscribe({
      next: (response: any) => {
        if (response) {
          this.billingAddress = {
            id: response.id || 0,
            firstName: response.firstName || '',
            lastName: response.lastName || '',
            address: response.addressLine1 || '',
            city: response.city || '',
            state: response.state || '',
            zipCode: response.postalCode || '',
            phone: response.phoneNumber || '',
            email: response.email || '',
            isDefault: response.isDefault || false
          };
          // Auto-fill the form with billing address
          this.fillBillingAddressForm();
        } else {
          // If no billing address found, check if there's a default address
          const defaultAddress = this.userAddresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            this.billingAddress = defaultAddress;
            this.fillBillingAddressForm();
          } else if (this.userAddresses.length > 0) {
            // Use first address as billing if available
            this.billingAddress = this.userAddresses[0];
            this.fillBillingAddressForm();
          } else {
            // No addresses found - show form to add billing address
            this.showBillingAddressForm = true;
          }
        }
      },
      error: (error) => {
        console.error('Error loading billing address:', error);
        // Fallback to default address if available
        const defaultAddress = this.userAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          this.billingAddress = defaultAddress;
          this.fillBillingAddressForm();
        } else if (this.userAddresses.length > 0) {
          this.billingAddress = this.userAddresses[0];
          this.fillBillingAddressForm();
        } else {
          this.showBillingAddressForm = true;
        }
      }
    });
  }

  fillShippingAddressForm(): void {
    if (this.shippingAddress) {
      this.checkoutForm.patchValue({
        firstName: this.shippingAddress.firstName,
        lastName: this.shippingAddress.lastName,
        address: this.shippingAddress.address,
        city: this.shippingAddress.city,
        state: this.shippingAddress.state,
        zipCode: this.shippingAddress.zipCode,
        phone: this.shippingAddress.phone,
        email: this.shippingAddress.email
      });
    }
  }

  fillBillingAddressForm(): void {
    if (this.billingAddress && !this.checkoutForm.get('isSameAsShipping')?.value) {
      this.checkoutForm.patchValue({
        billingFirstName: this.billingAddress.firstName,
        billingLastName: this.billingAddress.lastName,
        billingAddress: this.billingAddress.address,
        billingCity: this.billingAddress.city,
        billingState: this.billingAddress.state,
        billingZipCode: this.billingAddress.zipCode
      });
    }
  }

  createShippingAddress(): void {
    // Create a shipping address from the form data
    const formData = this.checkoutForm.value;
    const createAddressDto = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      addressLine1: formData.address,
      city: formData.city,
      state: formData.state,
      postalCode: formData.zipCode,
      country: 'Vietnam', // Default, could be dynamic
      phoneNumber: formData.phone,
      email: formData.email,
      addressName: 'Shipping Address',
      isDefault: false // Not the default, just for current order
    };

    this.addressService.apiAddressPost(createAddressDto).subscribe({
      next: (response: any) => {
        // Address created successfully
        this.messageDialogService.success('Shipping address created successfully!', 'Success');
        this.showShippingAddressForm = false;

        // Update local shipping address reference
        this.shippingAddress = {
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          address: response.addressLine1,
          city: response.city,
          state: response.state,
          zipCode: response.postalCode,
          phone: response.phoneNumber,
          email: response.email,
          isDefault: response.isDefault
        };

        // Add to user addresses
        this.userAddresses.push(this.shippingAddress);

        // Continue with checkout process
      },
      error: (error) => {
        console.error('Error creating shipping address:', error);
        this.messageDialogService.error('Failed to create shipping address. Please try again.', 'Error');
      }
    });
  }

  createBillingAddress(): void {
    // Create a billing address from the form data
    const formData = this.checkoutForm.value;
    const createAddressDto = {
      firstName: formData.billingFirstName || formData.firstName,
      lastName: formData.billingLastName || formData.lastName,
      addressLine1: formData.billingAddress || formData.address,
      city: formData.billingCity || formData.city,
      state: formData.billingState || formData.state,
      postalCode: formData.billingZipCode || formData.zipCode,
      country: 'Vietnam', // Default, could be dynamic
      phoneNumber: formData.phone,
      email: formData.email,
      addressName: 'Billing Address',
      isDefault: false // Not the default, just for current order
    };

    this.addressService.apiAddressPost(createAddressDto).subscribe({
      next: (response: any) => {
        // Address created successfully
        this.messageDialogService.success('Billing address created successfully!', 'Success');
        this.showBillingAddressForm = false;

        // Update local billing address reference
        this.billingAddress = {
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          address: response.addressLine1,
          city: response.city,
          state: response.state,
          zipCode: response.postalCode,
          phone: response.phoneNumber,
          email: response.email,
          isDefault: response.isDefault
        };

        // Add to user addresses
        this.userAddresses.push(this.billingAddress);

        // Continue with checkout process
      },
      error: (error) => {
        console.error('Error creating billing address:', error);
        this.messageDialogService.error('Failed to create billing address. Please try again.', 'Error');
      }
    });
  }

  private loadUserData(): void {
    // Attempt to get user information from the API
    this.accountService.apiAccountMeGet().subscribe({
      next: (user: any) => {
        if (user) {
          // Auto-fill form with user data
          this.checkoutForm.patchValue({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || ''
          });
        }
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        // Continue without user data
      }
    });
  }

  private loadCartData(): void {
    // This would normally come from the cart service
    // For now, using mock data
    this.cartItems = [
      { id: 1, name: 'Wireless Bluetooth Headphones', price: 149.99, quantity: 1, thumbnailUrl: '' },
      { id: 2, name: 'Smart Fitness Watch', price: 149.99, quantity: 1, thumbnailUrl: '' }
    ];

    this.cartSummary = {
      items: this.cartItems,
      subtotal: 299.98,
      shipping: 9.99,
      tax: 24.00,
      total: 333.97
    };
  }

  autoFillUserInfo(): void {
    this.accountService.apiAccountMeGet().subscribe({
      next: (user: any) => {
        if (user) {
          this.checkoutForm.patchValue({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            address: user.address || '',
            city: user.city || '',
            state: user.state || '',
            zipCode: user.zipCode || '',
            phone: user.phone || '',
            email: user.email || ''
          });
        } else {
          this.messageDialogService.info('Please log in to auto-fill your information', 'Not Logged In');
        }
      },
      error: (error) => {
        console.error('Error auto-filling user info:', error);
        this.messageDialogService.error('Failed to load your information. Please enter manually.', 'Error');
      }
    });
  }

  onSameAsShippingChange(): void {
    const isSameAsShipping = this.checkoutForm.get('isSameAsShipping')?.value;

    if (isSameAsShipping) {
      // Sync billing address with shipping address
      const shippingValues = {
        billingFirstName: this.checkoutForm.get('firstName')?.value,
        billingLastName: this.checkoutForm.get('lastName')?.value,
        billingAddress: this.checkoutForm.get('address')?.value,
        billingCity: this.checkoutForm.get('city')?.value,
        billingState: this.checkoutForm.get('state')?.value,
        billingZipCode: this.checkoutForm.get('zipCode')?.value
      };

      this.checkoutForm.patchValue(shippingValues);
    }
  }

  onShippingAddressChange(event: any): void {
    const selectedValue = event.target.value;
    if (selectedValue === 'new') {
      this.showShippingAddressForm = true;
    } else {
      const selectedAddress = this.userAddresses.find(addr => addr.id === Number(selectedValue));
      if (selectedAddress) {
        this.shippingAddress = selectedAddress;
        this.checkoutForm.patchValue({
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          phone: selectedAddress.phone,
          email: selectedAddress.email
        });
        this.showShippingAddressForm = false;
      }
    }
  }

  onBillingAddressChange(event: any): void {
    const selectedValue = event.target.value;
    if (selectedValue === 'new') {
      this.showBillingAddressForm = true;
    } else {
      const selectedAddress = this.userAddresses.find(addr => addr.id === Number(selectedValue));
      if (selectedAddress) {
        this.billingAddress = selectedAddress;
        this.checkoutForm.patchValue({
          billingFirstName: selectedAddress.firstName,
          billingLastName: selectedAddress.lastName,
          billingAddress: selectedAddress.address,
          billingCity: selectedAddress.city,
          billingState: selectedAddress.state,
          billingZipCode: selectedAddress.zipCode
        });
        this.showBillingAddressForm = false;
      }
    }
  }

  placeOrder(): void {
    // Validate that addresses are properly set before proceeding
    if (!this.validateAddresses()) {
      return;
    }

    if (this.checkoutForm.valid) {
      this.isProcessing = true;

      // Get form values
      const formData = this.checkoutForm.value;

      // Prepare order data
      const orderData = {
        paymentMethod: formData.paymentMethod,
        items: this.cartItems,
        totalAmount: this.cartSummary.total
      };

      // Process order based on payment method
      if (formData.paymentMethod === 'vnpay') {
        this.processVNPayPayment(orderData);
      } else {
        this.processStandardPayment(orderData);
      }
    } else {
      this.messageDialogService.error('Please fill in all required fields', 'Validation Error');
    }
  }

  validateAddresses(): boolean {
    // Check if we need to create addresses first
    if (this.showShippingAddressForm) {
      this.messageDialogService.error('Please save your shipping address before placing the order.', 'Address Required');
      return false;
    }

    if (!this.checkoutForm.get('isSameAsShipping')?.value && this.showBillingAddressForm) {
      this.messageDialogService.error('Please save your billing address before placing the order.', 'Address Required');
      return false;
    }

    return true;
  }

  private processVNPayPayment(orderData: any): void {
    // In a real implementation, this would call the VNPay API to initiate payment
    // For now, we'll simulate the process
    this.vnPayService.apiVnPayCreatePaymentUrlPost(orderData).subscribe({
      next: (response: any) => {
        // Clear the cart before redirecting to payment gateway
        this.cartService.clearCart();
        // Redirect to VNPay payment page
        if (response.paymentUrl) {
          if (isPlatformBrowser(this.platformId)) {
            window.location.href = response.paymentUrl;
          }
        } else {
          this.messageDialogService.error('Failed to initialize payment. Please try again.', 'Payment Error');
          this.isProcessing = false;
        }
      },
      error: (error) => {
        console.error('VNPay payment error:', error);
        this.messageDialogService.error('Payment initialization failed. Please try another method.', 'Payment Error');
        this.isProcessing = false;
      }
    });
  }

  private processStandardPayment(orderData: any): void {
    // Process standard payment methods (Credit Card, PayPal, Bank Transfer)
    const formData = this.checkoutForm.value;

    // Create shipping address based on selection or form data
    let shippingAddress;
    if (this.shippingAddress) {
      // Use existing shipping address
      shippingAddress = {
        firstName: this.shippingAddress.firstName,
        lastName: this.shippingAddress.lastName,
        addressLine1: this.shippingAddress.address,
        city: this.shippingAddress.city,
        state: this.shippingAddress.state,
        postalCode: this.shippingAddress.zipCode,
        country: 'Vietnam', // Default, could be dynamic
        phoneNumber: this.shippingAddress.phone || formData.phone,
        email: this.shippingAddress.email || formData.email
      };
    } else {
      // Create from form data
      shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        addressLine1: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.zipCode,
        country: 'Vietnam', // Default to Vietnam, could be made configurable
        phoneNumber: formData.phone,
        email: formData.email
      };
    }

    // Create billing address based on selection or form data
    let billingAddress;
    if (formData.isSameAsShipping) {
      billingAddress = { ...shippingAddress };
    } else if (this.billingAddress) {
      // Use existing billing address
      billingAddress = {
        firstName: this.billingAddress.firstName,
        lastName: this.billingAddress.lastName,
        addressLine1: this.billingAddress.address,
        city: this.billingAddress.city,
        state: this.billingAddress.state,
        postalCode: this.billingAddress.zipCode,
        country: 'Vietnam', // Default, could be dynamic
        phoneNumber: this.shippingAddress?.phone || formData.phone, // Use shipping phone if available
        email: formData.email
      };
    } else {
      // Create from form data
      billingAddress = {
        firstName: formData.billingFirstName,
        lastName: formData.billingLastName,
        addressLine1: formData.billingAddress,
        city: formData.billingCity,
        state: formData.billingState,
        postalCode: formData.billingZipCode,
        country: 'Vietnam', // Default to Vietnam, could be made configurable
        phoneNumber: formData.phone, // Use shipping phone if different phone not specified
        email: formData.email
      };
    }

    // Prepare order item DTOs with proper structure
    const orderItems = orderData.items.map((item: any) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price, // Use unitPrice instead of price
      selectedOptions: null // Could add product options if needed
    }));

    // Create the order DTO with proper structure
    const createOrderDto = {
      newShippingAddress: shippingAddress,
      newBillingAddress: billingAddress,
      paymentMethodId: this.getPaymentMethodId(orderData.paymentMethod),
      shippingMethodId: 1, // Default shipping method, could be dynamic
      discountAmount: 0, // Could be calculated based on coupons or promotions
      shippingCost: this.cartSummary.shipping, // Use actual shipping cost from cart
      orderItems: orderItems,
      notes: 'Order placed via checkout',
      couponCode: null // Could be added if coupons are supported in checkout
    };

    this.orderService.apiOrderPost(createOrderDto).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.messageDialogService.success('Order placed successfully!', 'Success');
        // Clear the cart after successful order
        this.cartService.clearCart();
        // Navigate to order history page with success state
        this.router.navigate(['/order-history'], {
          state: {
            orderPlacedSuccess: true,
            message: 'Your order was placed successfully!'
          }
        }).then(() => {
          this.isProcessing = false;
        });
      },
      error: (error) => {
        console.error('Order placement error:', error);
        this.messageDialogService.error('Failed to place order. Please try again.', 'Order Error');
        this.isProcessing = false;
      }
    });
  }

  private getPaymentMethodId(paymentMethodName: string): number | null {
    // Map payment method names to their corresponding IDs
    switch (paymentMethodName) {
      case 'creditCard': return 1;
      case 'paypal': return 2;
      case 'bankTransfer': return 3;
      case 'vnpay': return 4;
      default: return null;
    }
  }
}