import authorImage from "../../assets/author.jpg";
import movieOne from "../../assets/movie/movie1.jpg";
import movieTwo from "../../assets/movie/movie2.jpg";

const sharedContent = [
  "Cinema has always been more than moving pictures. It is a shared language built from light, sound and the emotions we carry into a dark room.",
  "Every generation discovers a different kind of hero, but the films that endure are grounded in honest characters and meaningful choices.",
  "From carefully designed action sequences to the quietest dramatic moments, great storytelling depends on rhythm. A filmmaker knows when to reveal, when to hold back and when to let an image speak for itself.",
  "That is why revisiting a memorable film can feel completely new. We notice another expression, a hidden detail in the frame or a line that means more to us now than it did before.",
];

export const blogPosts = [
  { slug: "why-adventure-movies-still-capture-our-imagination", title: "Why Adventure Movies Still Capture Our Imagination", category: "Featured", date: "12 July 2026", readTime: "6 min read", image: movieOne, authorImage, author: "Ariana Cole", excerpt: "From impossible journeys to unforgettable heroes, discover why adventure cinema continues to pull us into the unknown.", heading: "The thrill of stepping into the unknown", content: sharedContent },
  { slug: "the-new-era-of-action-cinema", title: "The New Era of Action Cinema Has Arrived", category: "Industry", date: "10 July 2026", readTime: "5 min read", image: movieTwo, authorImage, author: "Daniel Ray", excerpt: "Modern action films are changing the rules with richer characters, practical spectacle and bold visual storytelling.", heading: "Action with something more to say", content: sharedContent },
  { slug: "ten-films-for-your-weekend-watchlist", title: "10 Films for Your Weekend Watchlist", category: "Watch Guide", date: "8 July 2026", readTime: "7 min read", image: movieOne, authorImage, author: "Maya Stone", excerpt: "A hand-picked mix of thrills, drama and adventure for the perfect movie marathon at home.", heading: "A watchlist for every mood", content: sharedContent },
  { slug: "how-music-makes-a-movie-unforgettable", title: "How Music Makes a Movie Unforgettable", category: "Behind the Scenes", date: "5 July 2026", readTime: "4 min read", image: movieTwo, authorImage, author: "Noah Reed", excerpt: "The melodies, themes and silences that turn a powerful scene into a memory that lasts forever.", heading: "When sound becomes part of the story", content: sharedContent },
  { slug: "cinemas-most-iconic-hero-entrances", title: "Cinema’s Most Iconic Hero Entrances", category: "Spotlight", date: "2 July 2026", readTime: "6 min read", image: movieOne, authorImage, author: "Ariana Cole", excerpt: "Breaking down the framing, sound and anticipation behind the entrances audiences never forget.", heading: "First impressions on the biggest screen", content: sharedContent },
  { slug: "what-makes-a-great-movie-villain", title: "What Makes a Great Movie Villain?", category: "Editorial", date: "28 June 2026", readTime: "5 min read", image: movieTwo, authorImage, author: "Daniel Ray", excerpt: "The strongest antagonists challenge more than the hero—they challenge everything the story believes in.", heading: "A mirror held up to the hero", content: sharedContent },
  { slug: "the-art-of-the-perfect-movie-poster", title: "The Art of the Perfect Movie Poster", category: "Design", date: "24 June 2026", readTime: "4 min read", image: movieOne, authorImage, author: "Maya Stone", excerpt: "How one striking image can create a world, introduce a hero and sell an entire cinematic experience.", heading: "A whole story in a single frame", content: sharedContent },
];
