import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div
      className="home-container h-screen bg-cover bg-center flex items-start justify-center relative"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/944631208/photo/education-concept-with-book-in-library.jpg?s=612x612&w=0&k=20&c=uJF-uOU5MRR-iwXqJEPAdXeaH-VJ-nqt6TdKUpEdEkk=')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-8 flex flex-col items-center mt-4">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-xl lg:text-5xl font-bold text-white leading-tight">
          Welcome to Bookshelf – Your Book Haven
        </h1>

        {/* Paragraph */}
        <p className="text-lg sm:text-xl text-white mt-6 max-w-3xl mx-auto leading-relaxed text-center">
          A platform designed for book enthusiasts to organize and explore their reading journey. Create your
          personalized bookshelf, track the books you are reading, and discover new titles to add to your collection.
          Whether you are an avid reader or just getting started, Bookshelf helps you keep your favorite reads in one
          place and dive deeper into the world of books!
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-slate-800 transition duration-300"
          >
            LOGIN
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-slate-800 transition duration-300"
          >
            REGISTER
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
