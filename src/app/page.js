
import axios from "axios";
import Link from "next/link";
import SearchBar from "./components/searchBar";

export default async function Home(){
  const API_KEY= process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
  const movies = response.data.results;

  return(
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center p-2">Popular Movies</h1>
      <SearchBar />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie)=>(
          <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
            <div className="border rounded-lg ">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full"/>
              <p className="p-2 text-center">{movie.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}