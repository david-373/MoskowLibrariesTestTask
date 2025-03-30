import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'marker',
  standalone: true,
})
export class MarkerPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string, markingText: string): SafeHtml {
    if (!markingText) return value;
    const escaped = markingText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    const result = value.replace(regex, (match) => `<mark>${match}</mark>`);
    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}
