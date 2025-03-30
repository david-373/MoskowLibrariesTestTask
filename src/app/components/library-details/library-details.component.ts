import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Library } from '../../models/library';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-library-details',
  imports: [MatCardModule],
  templateUrl: './library-details.component.html',
  styleUrl: './library-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryDetailsComponent {
  library = input<Library>();
}
