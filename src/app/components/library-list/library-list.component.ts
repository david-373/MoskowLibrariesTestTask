import {
  Component,
  signal,
  inject,
  OnDestroy,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MarkerPipe } from '../../pipes/marker.pipe';
import { LibraryService, User, UsersResponse } from '../../services/library.service';
import { Subject, takeUntil } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-library-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MarkerPipe,
    MatProgressSpinnerModule,
  ],
  providers: [LibraryService],
  templateUrl: './library-list.component.html',
  styleUrl: './library-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryListComponent implements OnDestroy {
  onLibrarySelect = output<User | null>();

  displayedColumns = signal(['number', 'name', 'address']);
  isLoadingResults = signal(false);
  usersList = signal<User[]>([]);
  limit = signal(10);
  query = signal('');
  total = signal(0);

  private destroy$ = new Subject<void>();
  private page = signal(1);
  private queryChanged = signal(false);

  private libraryService = inject(LibraryService);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRowClicked(e: User): void {
    this.onLibrarySelect.emit(e);
  }

  onPageChanged(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.limit.set(event.pageSize);
    this.#loadLibraries();
    this.onLibrarySelect.emit(null);
  }

  onQueryChange(event: Event): void {
    this.queryChanged.set(true);
    this.query.set((<HTMLInputElement>event.target).value ?? '');
  }

  searchUsers(){
    if(this.queryChanged()){
      this.page.set(1);
      this.queryChanged.set(false);
    }
    this.#loadLibraries();
  }

  #loadLibraries(): void {
    this.isLoadingResults.set(true);;
    this.libraryService
      .getLibraries(this.page(), this.limit(), this.query())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData: UsersResponse) => {
          this.total.set(userData.total);
          this.usersList.set(userData.users);
          this.isLoadingResults.set(false);
        },
        error: (error) => {
          alert(`Error - ${error}`);
          this.isLoadingResults.set(false);
        },
      });
  }
}
