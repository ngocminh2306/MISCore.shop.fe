import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SellerService } from '../../public-api/api/seller.service';
import { CreateSellerDto } from '../../public-api/model/createSellerDto';
import { MessageDialogService } from './message-dialog.service';

export interface SellerRegistrationRequest {
  shopName: string;
  shopDescription?: string;
  businessLicenseNumber?: string;
  taxId?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerRegistrationService {

  constructor(
    private sellerService: SellerService,
    private messageDialogService: MessageDialogService
  ) { }

  /**
   * Submit a seller registration request
   */
  submitSellerRequest(requestData: SellerRegistrationRequest): Observable<any> {
    const createSellerDto: CreateSellerDto = {
      shopName: requestData.shopName,
      shopDescription: requestData.shopDescription || null,
      businessLicenseNumber: requestData.businessLicenseNumber || null,
      taxId: requestData.taxId || null,
      contactEmail: requestData.contactEmail || null,
      contactPhone: requestData.contactPhone || null,
      address: requestData.address || null,
      city: requestData.city || null,
      state: requestData.state || null,
      postalCode: requestData.postalCode || null,
      country: requestData.country || null
    };

    return this.sellerService.apiSellerProfilePost(createSellerDto).pipe(
      map((response: any) => {
        // Handle success response
        return {
          success: true,
          message: 'Seller registration request submitted successfully',
          data: response
        };
      }),
      catchError(error => {
        console.error('Seller registration error', error);
        
        let errorMessage = 'An error occurred during seller registration.';
        if (error.status === 400) {
          errorMessage = 'Invalid registration data. Please check your information.';
        } else if (error.status === 409) {
          errorMessage = 'A seller account with this information already exists.';
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your connection.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error && Array.isArray(error.error.errors)) {
          // Handle validation errors from API
          const errors = error.error.errors.join(', ');
          errorMessage = errors;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}