import { Injectable } from '@angular/core';
import { Recipe } from './recipe';
// import { Headers, Http } from '@angular/http';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RecipeService {
	// private headers = new Headers({'Content-Type': 'application/json'});
	private recipesUrl = 'recipes';
	private source_filter = '';

	constructor(private http: Http) { }

	getNumberOfRecipes() : Promise<number> {
		return this.http.get(this.recipesUrl + '/count/' + this.source_filter)
               .toPromise()
               .then(response => {return response.json()})
               .catch(this.handleError);
	}

	getRecipes(page, recipesPerPage) : Promise<Recipe[]> {
		return this.http.get(this.recipesUrl + '/' + recipesPerPage + '/' + page + '/' + this.source_filter )
               .toPromise()
               .then(response => response.json() as Recipe[])
               .catch(this.handleError);
  	}

  	orderByTime(enabled) : void {
  		if (enabled)
  		{
			this.recipesUrl = 'recipes-totalTimeOrder';  			
  		}
  		else
  		{
			this.recipesUrl = 'recipes';  			
  		}
  	}

  	filter(source) : void {
  		this.source_filter = source;
  	}

  	getFilter(): string {
  		return this.source_filter;
  	}

  	private handleError(error: any): Promise<any> {
	    console.error('An error occurred', error); // for demo purposes only
	    return Promise.reject(error.message || error);
	  }
}