import axios from "axios";

export default async function searchMovie(movieName: string, page = 1) {
  const options = {
    params: { query: movieName, page },
    headers: {
      "x-rapidapi-key": "13943e42c8mshec19c172342d447p1e5a69jsn262c5e0f6f14",
      "x-rapidapi-host": "advanced-movie-search.p.rapidapi.com",
    },
  };

  // Returning JSON-safe data
  return (
    await axios.get(
      "https://advanced-movie-search.p.rapidapi.com/search/movie",
      options
    )
  ).data;
}
