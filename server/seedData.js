const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Movie = require('./models/Movie');
const User = require('./models/User');
const Review = require('./models/Review');

// Sample movie data
const sampleMovies = [
  {
    title: 'The Shawshank Redemption',
    genre: ['Drama'],
    releaseYear: 1994,
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    posterURL: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    averageRating: 4.8
  },
  {
    title: 'The Godfather',
    genre: ['Crime', 'Drama'],
    releaseYear: 1972,
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    synopsis: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    posterURL: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    averageRating: 4.7
  },
  {
    title: 'The Dark Knight',
    genre: ['Action', 'Crime', 'Drama'],
    releaseYear: 2008,
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    posterURL: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    averageRating: 4.6
  },
  {
    title: 'Pulp Fiction',
    genre: ['Crime', 'Drama'],
    releaseYear: 1994,
    director: 'Quentin Tarantino',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    posterURL: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    averageRating: 4.5
  },
  {
    title: 'Inception',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    releaseYear: 2010,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
    synopsis: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into a CEO mind.',
    posterURL: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    averageRating: 4.3
  },
  {
    title: 'The Matrix',
    genre: ['Action', 'Sci-Fi'],
    releaseYear: 1999,
    director: 'Lana Wachowski',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    synopsis: 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.',
    posterURL: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    averageRating: 4.2
  },
  {
    title: 'Forrest Gump',
    genre: ['Drama', 'Romance'],
    releaseYear: 1994,
    director: 'Robert Zemeckis',
    cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
    synopsis: 'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man.',
    posterURL: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    averageRating: 4.1
  },
  {
    title: 'The Avengers',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    releaseYear: 2012,
    director: 'Joss Whedon',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
    synopsis: 'Earth mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army.',
    posterURL: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
    averageRating: 4.0
  },
  {
    title: 'Interstellar',
    genre: ['Adventure', 'Drama', 'Sci-Fi'],
    releaseYear: 2014,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
    posterURL: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    averageRating: 3.9
  },
  {
    title: 'Titanic',
    genre: ['Drama', 'Romance'],
    releaseYear: 1997,
    director: 'James Cameron',
    cast: ['Leonardo DiCaprio', 'Kate Winslet', 'Billy Zane'],
    synopsis: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    posterURL: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
    averageRating: 3.8
  },
  {
    title: 'Goodfellas',
    genre: ['Biography', 'Crime', 'Drama'],
    releaseYear: 1990,
    director: 'Martin Scorsese',
    cast: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci'],
    synopsis: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.',
    posterURL: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
    averageRating: 4.4
  },
  {
    title: 'Schindler\'s List',
    genre: ['Biography', 'Drama', 'History'],
    releaseYear: 1993,
    director: 'Steven Spielberg',
    cast: ['Liam Neeson', 'Ben Kingsley', 'Ralph Fiennes'],
    synopsis: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.',
    posterURL: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    averageRating: 4.7
  },
  {
    title: 'Fight Club',
    genre: ['Drama'],
    releaseYear: 1999,
    director: 'David Fincher',
    cast: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter'],
    synopsis: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into an anarchist organization.',
    posterURL: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    averageRating: 4.3
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    genre: ['Action', 'Adventure', 'Drama'],
    releaseYear: 2003,
    director: 'Peter Jackson',
    cast: ['Elijah Wood', 'Viggo Mortensen', 'Ian McKellen'],
    synopsis: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom.',
    posterURL: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    averageRating: 4.6
  },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    genre: ['Action', 'Adventure', 'Fantasy'],
    releaseYear: 1977,
    director: 'George Lucas',
    cast: ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher'],
    synopsis: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy.',
    posterURL: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
    averageRating: 4.2
  },
  {
    title: 'Jurassic Park',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    releaseYear: 1993,
    director: 'Steven Spielberg',
    cast: ['Sam Neill', 'Laura Dern', 'Jeff Goldblum'],
    synopsis: 'A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure.',
    posterURL: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg',
    averageRating: 4.1
  },
  {
    title: 'The Lion King',
    genre: ['Animation', 'Adventure', 'Drama'],
    releaseYear: 1994,
    director: 'Roger Allers',
    cast: ['Matthew Broderick', 'Jeremy Irons', 'James Earl Jones'],
    synopsis: 'A Lion prince is cast out of his pride by his cruel uncle, who claims he killed his father so that he can become king.',
    posterURL: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
    averageRating: 4.2
  },
  {
    title: 'Avatar',
    genre: ['Action', 'Adventure', 'Fantasy'],
    releaseYear: 2009,
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    synopsis: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world.',
    posterURL: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
    averageRating: 3.9
  },
  {
    title: 'Top Gun: Maverick',
    genre: ['Action', 'Drama'],
    releaseYear: 2022,
    director: 'Joseph Kosinski',
    cast: ['Tom Cruise', 'Jennifer Connelly', 'Miles Teller'],
    synopsis: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past.',
    posterURL: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    averageRating: 4.3
  },
  {
    title: 'Spider-Man: No Way Home',
    genre: ['Action', 'Adventure', 'Fantasy'],
    releaseYear: 2021,
    director: 'Jon Watts',
    cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'],
    synopsis: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
    posterURL: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    averageRating: 4.1
  },
  {
    title: 'Black Panther',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    releaseYear: 2018,
    director: 'Ryan Coogler',
    cast: ['Chadwick Boseman', 'Michael B. Jordan', 'Lupita Nyong\'o'],
    synopsis: 'T\'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future.',
    posterURL: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
    averageRating: 4.0
  },
  {
    title: 'Dune',
    genre: ['Action', 'Adventure', 'Drama'],
    releaseYear: 2021,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac'],
    synopsis: 'Feature adaptation of Frank Herbert\'s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset.',
    posterURL: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    averageRating: 4.2
  },
  {
    title: 'Parasite',
    genre: ['Comedy', 'Drama', 'Thriller'],
    releaseYear: 2019,
    director: 'Bong Joon Ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    posterURL: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    averageRating: 4.4
  },
  {
    title: 'Joker',
    genre: ['Crime', 'Drama', 'Thriller'],
    releaseYear: 2019,
    director: 'Todd Phillips',
    cast: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz'],
    synopsis: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral.',
    posterURL: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    averageRating: 4.0
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await Movie.deleteMany({});
    await Review.deleteMany({});
    
    // Insert sample movies
    console.log('Inserting sample movies...');
    const insertedMovies = await Movie.insertMany(sampleMovies);
    console.log(`Inserted ${insertedMovies.length} movies`);
    
    console.log('Database seeded successfully!');
    console.log('Sample movies available:');
    insertedMovies.forEach(movie => {
      console.log(`- ${movie.title} (${movie.releaseYear}) - Rating: ${movie.averageRating}`);
    });
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await seedDatabase();
  mongoose.connection.close();
  console.log('Database connection closed. Seeding complete!');
};

// Check if this file is being run directly
if (require.main === module) {
  runSeeder();
}

module.exports = { sampleMovies, seedDatabase };