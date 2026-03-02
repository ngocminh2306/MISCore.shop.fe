import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageDialogService } from '../../services/message-dialog.service';
import { AccountService } from '../../../public-api/api/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto px-4 py-8">
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Reset Password</h1>
        <p class="text-gray-600 mt-2">Enter your new password</p>
      </div>

      <div class="bg-white shadow rounded-lg overflow-hidden p-6">
        <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Current Password -->
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              formControlName="currentPassword"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <div *ngIf="resetPasswordForm.get('currentPassword')?.invalid && resetPasswordForm.get('currentPassword')?.touched" class="text-red-500 text-sm mt-1">
              Current password is required
            </div>
          </div>

          <!-- New Password -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              id="newPassword"
              formControlName="newPassword"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <div *ngIf="resetPasswordForm.get('newPassword')?.invalid && resetPasswordForm.get('newPassword')?.touched" class="text-red-500 text-sm mt-1">
              Password must be at least 6 characters long
            </div>
          </div>

          <!-- Confirm New Password -->
          <div>
            <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              formControlName="confirmNewPassword"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <div *ngIf="!isPasswordMatch() && resetPasswordForm.get('confirmNewPassword')?.touched" class="text-red-500 text-sm mt-1">
              Passwords do not match
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="resetPasswordForm.invalid || !isPasswordMatch() || isSubmitting"
            class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!isSubmitting">Reset Password</span>
            <span *ngIf="isSubmitting" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </span>
          </button>

          <!-- Back to Profile -->
          <div class="text-center">
            <a [routerLink]="['/user-info']" class="text-sm text-indigo-600 hover:text-indigo-500">Back to Profile</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f9fafb;
      min-height: calc(100vh - 100px);
      padding-top: 2rem;
    }
  `]
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private messageDialogService = inject(MessageDialogService);
  private router = inject(Router);

  resetPasswordForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.resetPasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    });
  }

  isPasswordMatch(): boolean {
    const newPassword = this.resetPasswordForm.get('newPassword')?.value;
    const confirmNewPassword = this.resetPasswordForm.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.isPasswordMatch()) {
      this.isSubmitting = true;

      const formValues = this.resetPasswordForm.value;
      const changePasswordDto = {
        currentPassword: formValues.currentPassword,
        newPassword: formValues.newPassword,
        confirmNewPassword: formValues.confirmNewPassword
      };

      // Change password API call
      // this.accountService.apiAccountChangePasswordPost(changePasswordDto).subscribe({
      //   next: (response) => {
      //     this.isSubmitting = false;
      //     this.messageDialogService.success('Password updated successfully!', 'Success');
      //     // Navigate back to user info page after successful password change
      //     this.router.navigate(['/user-info']);
      //   },
      //   error: (error) => {
      //     this.isSubmitting = false;
      //     console.error('Error changing password:', error);
      //     this.messageDialogService.error(error.error?.message || 'Failed to update password. Please try again.', 'Error');
      //   }
      // });
    } else {
      // Mark all fields as touched to show validation errors
      this.resetPasswordForm.markAllAsTouched();
    }
  }
}