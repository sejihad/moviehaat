import movieOne from "../assets/movie/movie1.jpg";
import movieTwo from "../assets/movie/movie2.jpg";

const titles = [
  "Welcome to the Jungle", "Baby John", "The Wild Mission", "Fireline",
  "Lost Kingdom", "Final Target", "Jungle Run", "The Protector",
  "Hidden Empire", "Last Survivor", "Beyond the Wild", "Red Horizon",
  "Shadow Hunter", "The Final Hour", "Untamed", "City of Fire",
  "Dark Territory", "Brave Hearts",
];

const descriptions = [
  "A fearless rescue team enters an untamed world where every turn hides a new challenge—and the only way home is through the heart of the jungle.",
  "A quiet life is shattered when a relentless hero is forced back into action to protect the people he loves from an enemy he thought was gone.",
  "An impossible assignment takes an elite crew beyond the edge of the map, where loyalty is tested and survival comes at a cost.",
];

export const movies = titles.map((title, index) => ({
  id: String(index + 1),
  title,
  image: index % 2 === 0 ? movieOne : movieTwo,
  backdrop: index % 2 === 0 ? movieOne : movieTwo,
  rating: (7.5 + (index % 10) / 10).toFixed(1),
  year: index % 2 === 0 ? "2024" : "2025",
  duration: index % 3 === 0 ? "2h 27m" : index % 3 === 1 ? "2h 15m" : "1h 58m",
  maturity: index % 4 === 0 ? "16+" : "13+",
  quality: "4K",
  genres: index % 2 === 0 ? ["Action", "Adventure", "Thriller"] : ["Action", "Drama", "Crime"],
  description: descriptions[index % descriptions.length],
  director: index % 2 === 0 ? "Marcus Vale" : "Elena Cross",
  cast: index % 2 === 0 ? ["Ryan Cole", "Maya Stone", "Daniel Ray"] : ["Arjun Dev", "Sara Khan", "Noah Reed"],
  language: "English",
  releaseDate: index % 2 === 0 ? "18 October 2024" : "12 January 2025",
}));

export const getMovie = (id) => movies.find((movie) => movie.id === String(id));
