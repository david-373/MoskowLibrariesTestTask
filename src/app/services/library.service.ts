import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, tap } from 'rxjs/operators';
import { Library } from '../models/library';

@Injectable()
export class LibraryService {
  private readonly FAKE_API = 'https://dummyjson.com/';

  private http = inject(HttpClient);

  getLibraries(
    page: number,
    resultsPerPage: number,
    query?: string
  ): Observable<UsersResponse> {
    const queryParam = query ? `&q=${query}` : '';
    const url = `${this.FAKE_API}users/search?limit=${resultsPerPage}&skip=${resultsPerPage * (page - 1)}${queryParam}&select=firstName,lastName,address`;
  
    return this.http.get<OriginalUsersResponse>(url).pipe(
      map((data: OriginalUsersResponse): UsersResponse => {
        const transformedUsers = data.users.map((user: OriginalUser) => ({
          number: user.id,
          name: `${user.firstName} ${user.lastName}`,
          address: `${user.address.address}, ${user.address.city}, ${user.address.country}`,
        }));
  
        return {
          users: transformedUsers,
          total: data.total,
          skip: data.skip,
          limit: data.limit,
        };
      })
    );
  }
}

export type UsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

export type OriginalUsersResponse = {
  users: OriginalUser[];
  total: number;
  skip: number;
  limit: number;
};

type OriginalUser = {
  id: number;
  firstName: string;
  lastName: string;
  address: Address;
};

export type User = {
  number: number;
  name: string;
  address: string;
};

type Address = {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
};

type Coordinates = {
  lat: number;
  lng: number;
};
