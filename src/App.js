import React, { useEffect, useState } from 'react';
import './App.css';
import SearchIcon from './search.svg';
import MovieCard from './MovieCard';

const API_URL = 'http://www.omdbapi.com?apikey=708b7911';

// Array of popular search terms to fetch a broad range of movies
const popularSearchTerms = [
  'man', 'woman', 'hero', 'love', 'life', 
  'adventure', 'comedy', 'action', 'thriller', 
  'drama', 'fantasy', 'crime', 'animation', 
  'sci-fi', 'mystery'
];

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMovies = async (title) => {
    try {
      const response = await fetch(`${API_URL}&s=${title}`);
      const data = await response.json();
      if (data.Search) {
        return data.Search;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
  };

  const fetchInitialMovies = async () => {
    const allMovies = [];
    for (const term of popularSearchTerms) {
      const movies = await fetchMovies(term);
      allMovies.push(...movies);
      // Break early if we already have 15 or more movies
      if (allMovies.length >= 15) {
        break;
      }
    }
    // Deduplicate movies based on imdbID
    const uniqueMovies = Array.from(new Set(allMovies.map(movie => movie.imdbID)))
      .map(id => allMovies.find(movie => movie.imdbID === id));
    setMovies(uniqueMovies.slice(0, 15)); // Ensure we only keep the first 15 unique movies
  };

  const searchMovies = async (title) => {
    const movies = await fetchMovies(title);
    setMovies(movies);
  };

  useEffect(() => {
    fetchInitialMovies();
  }, []);

  return (
    <div className='app'>
      <h1>MovieLand</h1>

      <div className='search'>
        <input
          placeholder='Search for movies'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          src={SearchIcon}
          alt='search'
          onClick={() => searchMovies(searchTerm)}
        />
      </div>
      {movies?.length > 0 ? (
        <div className='container'>
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className='empty'>
          <h2>No movies found</h2>
        </div>
      )}
    </div>
  );
};

export default App;
