import { Component } from '@angular/core';
import { RecipeService } from './recipe.service';
import { OnInit } from '@angular/core';
import { Recipe } from './recipe';

@Component({
  selector: 'app',
  providers: [RecipeService],
  templateUrl: 'app/app.component.html'
  // template: '<h1>My First Angular 2 App</h1>'
})
export class AppComponent implements OnInit {
  recipes: Recipe[];
  selectedRecipe: Recipe;
  page: number;
  recipesPerPage: number;
  totalPages: number;
  orderByTime: boolean;

  constructor(private recipeService: RecipeService) { 
  // 	console.log("hello");
    this.page = 1;
    this.recipesPerPage = 50;
    this.orderByTime = false;
    this.recipeService.getNumberOfRecipes().then(count => {
      this.totalPages = Math.ceil(count / this.recipesPerPage)
    });
  }

  ngOnInit(): void {
    this.update();
  }

  update(): void {
    this.recipeService.getRecipes(this.page, this.recipesPerPage).then(recipes => {
      this.recipes = recipes
    });

    this.recipeService.getNumberOfRecipes().then(count => {
      this.totalPages = Math.ceil(count / this.recipesPerPage)
    });
  }

  onSelect(recipe: Recipe): void {
    this.selectedRecipe = recipe;
  }

  next(): void {
    this.page = this.page + 1;
    this.recipeService.getRecipes(this.page, this.recipesPerPage).then(recipes => {
      this.recipes = recipes
    });
  }

  previous(): void {
    this.page = this.page > 1 ? this.page - 1 : 1;

    this.recipeService.getRecipes(this.page, this.recipesPerPage).then(recipes => {
      this.recipes = recipes
    });
  }

  filter(source): void {
    if (source == undefined)
      source = "";
    this.recipeService.filter(source);
    this.update();
  }

  getFilter(): string {
    return this.recipeService.getFilter();
  }

  switchOrder(): void {
    this.orderByTime = !this.orderByTime;
    this.recipeService.orderByTime(this.orderByTime);
    this.update();
  }

}
