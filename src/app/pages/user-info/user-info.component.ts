import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { AccountService } from '../../../public-api/api/account.service';
import { UserInfoDto } from '../../../public-api/model/userInfoDto';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [RouterLink, FormsModule, TranslatePipe],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  private accountService = inject(AccountService);

  userForm = {
    id: '',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    profilePictureUrl: '',
    dateOfBirth: null as Date | null,
    gender: '',
    isActive: false,
    lastLoginAt: null as Date | null,
    createdAt: null as Date | null,
    updatedAt: null as Date | null,
    roles: [] as string[]
  };

  loading = false;
  error: string | null = null;

  get formattedDateOfBirth(): string {
    return this.userForm.dateOfBirth ? new Date(this.userForm.dateOfBirth).toLocaleDateString() : '';
  }

  get formattedCreatedAt(): string {
    return this.userForm.createdAt ? new Date(this.userForm.createdAt).toLocaleString() : '';
  }

  get formattedLastLogin(): string {
    return this.userForm.lastLoginAt ? new Date(this.userForm.lastLoginAt).toLocaleString() : 'Never';
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.loading = true;
    this.error = null;

    this.accountService.apiAccountMeGet().subscribe({
      next: (userInfo: UserInfoDto) => {
        this.userForm = {
          id: userInfo.id || '',
          firstName: userInfo.firstName || '',
          lastName: userInfo.lastName || '',
          userName: userInfo.userName || '',
          email: userInfo.email || '',
          phoneNumber: '',
          profilePictureUrl: userInfo.profilePictureUrl || '',
          dateOfBirth: userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth) : null,
          gender: userInfo.gender || '',
          isActive: userInfo.isActive || false,
          lastLoginAt: userInfo.lastLoginAt ? new Date(userInfo.lastLoginAt) : null,
          createdAt: userInfo.createdAt ? new Date(userInfo.createdAt) : null,
          updatedAt: null,
          roles: userInfo.roles || []
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user info:', error);
        this.error = 'Failed to load user information. Please try again.';
        this.loading = false;
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName?.charAt(0) || '';
    const lastInitial = lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/200x200/f97316/ffffff?text=' + this.getInitials(this.userForm.firstName, this.userForm.lastName);
  }

  onChangePicture(): void {
    console.log('Change picture functionality would go here');
    // This would typically open a file picker or navigate to an edit profile page
  }
}