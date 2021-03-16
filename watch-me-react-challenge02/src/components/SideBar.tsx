import { Button } from "./Button";
import '../styles/sidebar.scss';
import { GenreResponseProps } from "../App";

interface SideBarProps {
  genres: GenreResponseProps[];
  selectedGenreId: number;
  onButtonClick: (id: number) => void;
}

export function SideBar({ genres, selectedGenreId, onButtonClick }: SideBarProps) {
  return (
    <nav className="sidebar">
      <span>Watch<p>Me</p></span>

      <div className="buttons-container">
        {genres.map(genre => (
          <Button
            key={genre.id}
            id={String(genre.id)}
            title={genre.title}
            iconName={genre.name}
            onClick={() => onButtonClick(genre.id)}
            selected={selectedGenreId === genre.id}
          />
        ))}
      </div>

    </nav>
  )
}