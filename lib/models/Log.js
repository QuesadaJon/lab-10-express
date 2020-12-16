//Add a `Log` model which tracks when you used a recipe. A `Log` has:
// `recipeId`, `dateOfEvent`, `notes`, and `rating`. Create all CRUD routes

const pool = require('../utils/pool');

// for your `Log` model
module.exports = class Log {
  id;
  dateOfEvent;
  notes;
  rating;
  recipeId;

  constructor(row) {
    this.id = String(row.id);
    this.dateOfEvent = row.date_of_event;
    this.notes = row.notes;
    this.rating = row.rating;
    this.recipeId = String(row.recipe_id);
  }

  static async insert({ dateOfEvent, notes, rating, recipeId }) {
    const { rows } = await pool.query(
      'INSERT into logs (date_of_event, notes, rating, recipe_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [dateOfEvent, notes, rating, recipeId]
    );

    return new Log(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM logs'
    );

    return rows.map(row => new Log(row));
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM logs WHERE id=$1',
      [id]
    );
    if(!rows[0]) return null;
    else return new Log(rows[0]);
  }
};
