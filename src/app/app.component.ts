import { Component, signal } from '@angular/core';
import { Library } from './models/library';
import { LibraryListComponent } from './components/library-list/library-list.component';
import { LibraryDetailsComponent } from './components/library-details/library-details.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    LibraryDetailsComponent, 
    LibraryListComponent,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  selectedLibrary = signal<Library | null>(null);
}
