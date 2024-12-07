import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div 
      className="home-container p-8 h-[93.1vh] bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://media.istockphoto.com/id/944631208/photo/education-concept-with-book-in-library.jpg?s=612x612&w=0&k=20&c=uJF-uOU5MRR-iwXqJEPAdXeaH-VJ-nqt6TdKUpEdEkk=')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}
      <div className="relative z-10">
        <h1 className="text-5xl font-bold text-center sm:text-4xl md:text-5xl text-white">
          Welcome to Bookshelf – Your Book Haven
        </h1>
        <p className="text-lg mt-4 text-center sm:text-base text-white">
          Curate your personal bookshelf, share reviews, and connect with fellow book lovers.
          Get inspired, connect with readers, and dive deeper into the world of books.

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
