import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'api/heroes'; //URL to web api

  constructor(
    private http:HttpClient,
    private messageService: MessageService
  ) { }

  
  
  /**
   * 
   * getHeros() method below taps into the flow of observable values and sends a message, using the log()
   * method, to the message area at the bottom of the page
   * 
   * RxJS' tap() operator enables this ability by looking at the observable values, 
   * doing something with those values, and passing them along.
   * 
   * The Tap() callback does not access the values themselves
   * 
   */
  
  getHeroes(): Observable<Hero[]> {
  //  const heroes = of(HEROES);
  //  this.messageService.add('HeroService: fetched heroes');
    //return heroes;
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_=>this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes: ',[]))
    );
  }

  /* Get heroes whose name contains search term */
  searchHeroes(term: string):Observable<Hero[]>{
    if (!term.trim() || term === null) {
      // if search term is empty or null return an empty hero array
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length?
        this.log(`found heroes matching "${term}"`) :
        this.log('no heroes matching "${term}"')),
      catchError(this.handleError<Hero[]>('SearchHeroes ', []))
    );
  }
  
  // GET hero by id.  Will 404 if id is not found
  // Returns an Observable<Hero> which is an observable of Hero objects rather than an observable of Hero arrays
  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const url = `${this.heroesUrl}/${id}`;
    // const hero = HEROES.find(h => h.id === id)!;
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id = ${id}`)),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    );
    // return of(hero);
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero):Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id = ${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero:Hero) => this.log(`added hero w/ id = ${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
    catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  
  
  /**
   * 
   * Handle Http operation that failed.
   * Let the app continue.
   * 
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */

  private handleError<T>(operation = 'operation',result?:T){
    return (error:any):Observable<T>=>{
      //TODO: send the error to remote loggin infrastructure
      console.error(error); //log to console instead

      //TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      //Let the app keep running by returning an empty result
      return of(result as T);
    }
  }

  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }
}