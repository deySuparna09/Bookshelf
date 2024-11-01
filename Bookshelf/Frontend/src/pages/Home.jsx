import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
    <div className="home-container p-8">
      <h1 className="text-5xl font-bold">Welcome to Bookshelf</h1>
      <p className="text-lg mt-4">Discover, curate, and share your favorite books.</p>
      <div className="mt-8">
        <Link to="/login" className="btn-primary btn-primary px-2 py-2 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer">Login</Link>
        <Link to="/register" className="btn-secondary ml-4 btn-primary px-2 py-2 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer">Register</Link>
      </div>
    </div>
    </>
  );
};

export default Home;
