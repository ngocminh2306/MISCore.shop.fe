import { Component, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { DocumentOcrService } from '../../../../public-api/api/documentOcr.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-admin-ocr-document',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './admin-ocr-document.component.html',
  styleUrls: ['./admin-ocr-document.component.scss']
})
export class AdminOcrDocumentComponent implements OnDestroy {
  private documentOcrService = inject(DocumentOcrService);
  private cdr = inject(ChangeDetectorRef);
  private languageService = inject(LanguageService);
  private sanitizer = inject(DomSanitizer);

  selectedFile: File | null = null;
  previewUrl: SafeUrl | null = null;
  ocrText: string = '';
  isProcessing: boolean = false;
  includeOcr: boolean = true;
  forceOcr: boolean = false;
  selectedFormat: string = 'txt';
  error: string | null = null;
  successMessage: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      this.error = null;
      this.successMessage = null;
      this.ocrText = '';

      // Create preview URL
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl as string);
      }
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));

      this.cdr.markForCheck();
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.selectedFile = file;
      this.error = null;
      this.successMessage = null;
      this.ocrText = '';

      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl as string);
      }
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));

      this.cdr.markForCheck();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  clearFile(): void {
    this.selectedFile = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl as string);
      this.previewUrl = null;
    }
    this.ocrText = '';
    this.error = null;
    this.successMessage = null;
    this.cdr.markForCheck();
  }

  processDocument(): void {
    if (!this.selectedFile) {
      this.error = this.languageService.getTranslation('Please select a file first.');
      return;
    }

    this.isProcessing = true;
    this.error = null;
    this.successMessage = null;
    this.ocrText = '';

    this.documentOcrService.apiDocumentOcrConvertAndSavePost(
      this.selectedFile,
      this.selectedFormat,
      this.includeOcr,
      this.forceOcr
    ).subscribe({
      next: (response) => {
        this.isProcessing = false;
        this.successMessage = this.languageService.getTranslation('Document processed successfully!');

        // Extract OCR text from response if available
        if (response?.ocrText) {
          this.ocrText = response.ocrText;
        } else if (response?.text) {
          this.ocrText = response.text;
        } else {
          this.ocrText = this.languageService.getTranslation('OCR text extracted successfully. Check the processed file.');
        }

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('OCR processing error:', error);
        this.isProcessing = false;
        this.error = this.languageService.getTranslation('Failed to process document. Please try again.');
        this.cdr.markForCheck();
      }
    });
  }

  copyToClipboard(): void {
    if (this.ocrText) {
      navigator.clipboard.writeText(this.ocrText).then(() => {
        this.successMessage = this.languageService.getTranslation('Text copied to clipboard!');
        this.cdr.markForCheck();
        setTimeout(() => {
          this.successMessage = null;
          this.cdr.markForCheck();
        }, 3000);
      }).catch(() => {
        this.error = this.languageService.getTranslation('Failed to copy text.');
        this.cdr.markForCheck();
      });
    }
  }

  downloadText(): void {
    if (this.ocrText) {
      const blob = new Blob([this.ocrText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.selectedFile?.name.split('.')[0] || 'ocr-result'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  ngOnDestroy(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl as string);
    }
  }
}
