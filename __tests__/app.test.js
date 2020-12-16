const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe via POST', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [{
          'amount': '20 ounces',
          'measurement': 'eyeball it',
          'name': 'nutmeg'
        }]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('gets all recipes via GET', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', 
        directions: [],        
        ingredients: [{
          'amount': '20 ounces',
          'measurement': 'eyeball it',
          'name': 'nutmeg'
        }] },
      { name: 'cake', 
        directions: [],
        ingredients: [{
          'amount': '20 ounces',
          'measurement': 'eyeball it',
          'name': 'nutmeg'
        }] },
      { name: 'pie', 
        directions: [],
        ingredients: [{
          'amount': '20 ounces',
          'measurement': 'eyeball it',
          'name': 'nutmeg'
        }] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('gets a recipe by id via GET', async() => {
    const recipe = await Recipe.insert({ 
      name: 'cookies', 
      directions: [],        
      ingredients: [{
        'amount': '20 ounces',
        'measurement': 'eyeball it',
        'name': 'nutmeg'
      }] });

    return request(app)
      .get(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual(recipe);
      });
  });

  it('updates a recipe by id via PUT', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [{
        'amount': '20 ounces',
        'measurement': 'eyeball it',
        'name': 'nutmeg'
      }]
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [{
          'amount': '20 ounces',
          'measurement': 'eyeball it',
          'name': 'nutmeg'
        }]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('deletes a recipe via DELETE', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [{
        'amount': '20 ounces',
        'measurement': 'eyeball it',
        'name': 'nutmeg'
      }]
    });

    return request(app)
      .delete(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });
});
