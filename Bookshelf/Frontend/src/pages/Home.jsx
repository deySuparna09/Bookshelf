import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div 
      className="home-container p-8 h-[93.1vh] bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: "url('https://media.istockphoto.com/id/944631208/photo/education-concept-with-book-in-library.jpg?s=612x612&w=0&k=20&c=uJF-uOU5MRR-iwXqJEPAdXeaH-VJ-nqt6TdKUpEdEkk=')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}
      <div className="relative z-10 text-center px-4 sm:px-8">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-white">
          Welcome to Bookshelf – Your Book Haven
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mt-8 text-white max-w-3xl mx-auto">
          A platform designed for book enthusiasts to organize and explore their reading journey. Create your personalized bookshelf, track the books you are reading, and discover new titles to add to your collection. Whether you are an avid reader or just getting started, Bookshelf helps you keep your favorite reads in one place and dive deeper into the world of books!
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login" className="btn-primary px-6 py-3 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer">
            Login
          </Link>
          <Link to="/register" className="btn-secondary px-6 py-3 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
