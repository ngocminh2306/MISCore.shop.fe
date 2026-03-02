import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageDialogService } from '../../services/message-dialog.service';
import { AccountService } from '../../../public-api/api/account.service';
import { UpdateUserDto } from '../../../public-api/model/updateUserDto';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private messageDialogService = inject(MessageDialogService);
  private router = inject(Router);

  profileForm: FormGroup;
  isSubmitting = false;
  loading = false;
  error: string | null = null;
  currentProfilePicture: string | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      dateOfBirth: [''],
      gender: [''],
      bio: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.error = null;

    this.accountService.apiAccountMeGet().subscribe({
      next: (userInfo: any) => {
        this.profileForm.patchValue({
          firstName: userInfo.firstName || '',
          lastName: userInfo.lastName || '',
          email: userInfo.email || '',
          phoneNumber: userInfo.phoneNumber || '',
          dateOfBirth: userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toISOString().split('T')[0] : '',
          gender: userInfo.gender || '',
          bio: userInfo.bio || ''
        });

        this.currentProfilePicture = userInfo.profilePictureUrl || null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.error = 'Failed to load user profile. Please try again.';
        this.loading = false;
        this.messageDialogService.error('Failed to load user profile', 'Error');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.messageDialogService.error('File size exceeds 2MB limit', 'File Too Large');
        return;
      }

      if (!file.type.match('image.*')) {
        this.messageDialogService.error('Please select an image file', 'Invalid File Type');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.currentProfilePicture = reader.result as string;
      };
    }
  }

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/200x200/f97316/ffffff?text=' + 
      this.getInitials(this.profileForm.get('firstName')?.value, this.profileForm.get('lastName')?.value);
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName?.charAt(0) || '';
    const lastInitial = lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSubmitting = true;

      const formValues = this.profileForm.value;
      const updateUserDto: UpdateUserDto = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        phoneNumber: formValues.phoneNumber,
        dateOfBirth: formValues.dateOfBirth,
        gender: formValues.gender,
        profilePictureUrl: this.currentProfilePicture || undefined
      };

      // this.accountService.apiAccountUpdatePut(updateUserDto).subscribe({
      //   next: (response) => {
      //     this.isSubmitting = false;
      //     this.messageDialogService.success('Profile updated successfully!', 'Success');
      //     this.router.navigate(['/user-info']);
      //   },
      //   error: (error) => {
      //     this.isSubmitting = false;
      //     console.error('Error updating profile:', error);
      //     this.messageDialogService.error('Failed to update profile. Please try again.', 'Error');
      //   }
      // });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/user-info']);
  }
}