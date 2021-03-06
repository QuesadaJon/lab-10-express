DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS logs;

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  directions TEXT[],
  ingredients jsonb[] NOT NULL
);

CREATE TABLE logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date_of_event TEXT NOT NULL,
  notes VARCHAR(50),
  rating INT CHECK (rating > 0 AND rating < 11),
  recipe_id BIGINT NOT NULL REFERENCES recipes(id)
)