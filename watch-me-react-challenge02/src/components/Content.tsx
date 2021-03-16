import { MovieCard } from "./MovieCard";

import "../styles/content.scss";
import { MovieProps } from "../App";

interface ContentProps {
  selectedGenreTitle: string;
  movies: MovieProps[];
}

export function Content({ selectedGenreTitle, movies }: ContentProps) {
  return (
    <div className="container">
      <header>
        <span className="category">Categoria:<span> {selectedGenreTitle}</span></span>
      </header>

      <main>
        <div className="movies-list">
          {movies.map((movie, index) => (
            <MovieCard key={index} title={movie.Title} poster={movie.Poster} runtime={movie.Runtime} rating={movie.Ratings[0].Value} />
          ))}
        </div>
      </main>
    </div>
  );
}