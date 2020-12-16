const fs = require('fs');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const Log = require('../lib/models/Log');
const Recipe = require('../lib/models/recipe');

describe('log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  let recipe;

  beforeEach(async() => {
    recipe = await Recipe.insert({ name: 'name', directions: [] });
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a log via POST', async() => {
    return request(app)
      .post('/api/v1/logs')
      .send({
        dateOfEvent: '12/15/2020',
        notes: '',
        rating: 5,
        recipeId: recipe.id
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          dateOfEvent: '12/15/2020',
          notes: '',
          rating: 5,
          recipeId: recipe.id          
        });
      });
  });

  it('gets all logs for a recipe via GET', async() => {
    const logs = await Promise.all([
      { dateOfEvent: '12/10/20', notes: '', rating: 5, recipeId: recipe.id },
      { dateOfEvent: '12/11/20', notes: 'Got better', rating: 7, recipeId: recipe.id },
      { dateOfEvent: '12/15/20', notes: 'GOT EVEN BETTER', rating: 10, recipeId: recipe.id }
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it('gets a log by id via GET', async() => {
    const log = await Log.insert({ dateOfEvent: '12/10/20', notes: '', rating: 5, recipeId: recipe.id });

    return request(app)
      .get(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual(log);
      });
  });

  it('updates a log by id via PUT', async() => {
    const log = await Log.insert({ dateOfEvent: '12/10/20', notes: '', rating: 5, recipeId: recipe.id });

    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({ dateOfEvent: '12/15/20', notes: 'Gooooooood', rating: 8, recipeId: recipe.id })
      .then(res => {
        expect(res.body).toEqual({ 
          id: expect.any(String),
          dateOfEvent: '12/15/20', 
          notes: 'Gooooooood', 
          rating: 8, 
          recipeId: recipe.id });
      });
  });
});
