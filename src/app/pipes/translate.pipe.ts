import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false  // Make the pipe impure to ensure it re-evaluates on each change detection
})
export class TranslatePipe implements PipeTransform {
  private languageService = inject(LanguageService);

  transform(key: string, ...args: any[]): string {
    // Accessing the language will ensure this pipe is re-evaluated when language changes
    const currentLanguage = this.languageService.getCurrentLanguage();
    return this.languageService.getTranslation(key);
  }
}