import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import SocialCard from "../components/SocialCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State hooks should not be inside conditions
  const [books, setBooks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("reading");
  const [loading, setLoading] = useState(false);
  const [updatingBookId, setUpdatingBookId] = useState(null);
  const [friendsUpdates, setFriendsUpdates] = useState([]);
  const [friends, setFriends] = useState([]);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch books based on status
  const fetchBooksByStatus = async (status) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/book/status/${status}`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books by status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch friends' updates
  const fetchFriendsUpdates = async () => {
    if (!user?._id) return;
    try {
      const response = await axiosInstance.get(`/api/reviews/friends-updates/${user._id}`);
      console.log("Friends Updates:", response.data);
      setFriendsUpdates(response.data);
    } catch (error) {
      console.error("Error fetching friends' updates:", error);
    }
  };

  // Fetch friends
  const fetchFriends = async () => {
    if (!user?._id) return;
    try {
      const response = await axiosInstance.get(`/api/friend/${user._id}`);
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // Check if the user is a friend
  const isFriend = (userId) => {
    return friends.some((friend) => friend.friendId === userId);
  };

  // Add a new friend
  const handleAddFriend = async (friendId) => {
    try {
      await axiosInstance.post(`/api/friend/add`, { userId: user._id, friendId });
      alert('Friend request sent!');
      fetchFriends(); // Refresh the friend list after adding
    } catch (error) {
      console.error("Error adding friend:", error);
      alert('Failed to send friend request.');
    }
  };

  // Unfriend a user
  const handleUnfriend = async (friendId) => {
    try {
      await axiosInstance.delete(`/api/friend/remove/${friendId}`);
      fetchFriends(); // Refresh the friend list after unfriending
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };



  // Fetch data when statusFilter changes or on component mount
  useEffect(() => {
    if (user) {
      fetchBooksByStatus(statusFilter);
      fetchFriendsUpdates();
      fetchFriends();
    }
  }, [statusFilter, user]);
  // Update book progress or status
  const updateBook = async (bookId, updateData) => {
    try {
      const response = await axiosInstance.put(`/api/book/${bookId}`, updateData);
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.bookId === bookId ? { ...book, ...response.data } : book
        )
      );
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setUpdatingBookId(null);
    }
  };

  // Handle progress update
  const handleProgressUpdate = (bookId, currentProgress) => {
    const newProgress = currentProgress + 20;

    setUpdatingBookId(bookId);
    if (newProgress >= 100) {
      updateBook(bookId, { progress: 100, status: "finished" });
    } else {
      updateBook(bookId, { progress: newProgress });
    }
  };

  // Handle status update
  const handleStatusUpdate = async (bookId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/api/book/${bookId}`, { status: newStatus });
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.bookId === bookId ? { ...book, ...response.data } : book
        )
      );

      if (newStatus === "reading" && statusFilter !== "reading") {
        setStatusFilter("reading");
      }
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };

  if (!user) {
    return <p>Redirecting to login...</p>; // Optional fallback while navigating
  }

  return (
    <div className="dashboard p-6">
      <h1 className="text-2xl font-bold mb-4">My Dashboard</h1>
      
      <h2 className="text-xl font-bold mt-8">Friends Updates</h2>
      {friendsUpdates.length > 0 ? (
        friendsUpdates.map((update) => (
          <SocialCard
            key={update._id}
            update={update}
            isFriend={isFriend(update.userId._id)}
            onAddFriend={handleAddFriend}
          />
        ))
      ) : (
        <p>No updates from friends yet.</p>
      )}

      <h2 className="text-xl font-bold mt-8">My Friends</h2>
      {friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <li key={friend.friendId}>
              <span>{friend.friendName}</span>
              <button
                className="ml-4 text-red-500 underline"
                onClick={() => handleUnfriend(friend.friendId)}
              >
                Unfriend
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You havenot added any friends yet.</p>
      )}
      <h2 className="text-xl font-bold mt-8">My Books</h2>
      {/* Status Filter */}
      <div className="mb-4 mt-3">
        <button
          className={`px-4 py-2 mr-2 ${
            statusFilter === "reading" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatusFilter("reading")}
        >
          Currently Reading
        </button>
        <button
          className={`px-4 py-2 mr-2 ${
            statusFilter === "finished" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatusFilter("finished")}
        >
          Finished
        </button>
        <button
          className={`px-4 py-2 ${
            statusFilter === "not_started" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatusFilter("not_started")}
        >
          Not Started
        </button>
      </div>
      {/* Book List */}
      {loading ? (
        <p>Loading...</p>
      ) : books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book.bookId} className="mb-4 border-b pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{book.title}</h2>
                  <p className="text-sm text-gray-500">By: {book.authors.join(", ")}</p>
                  <div className="w-full bg-gray-200 rounded mt-2">
                    <div
                      className={`bg-green-500 text-xs font-medium text-white text-center p-1 leading-none rounded transition-all duration-300`}
                      style={{ width: `${book.progress}%` }}
                    >
                      {book.progress}%
                    </div>
                  </div>
                  <p>Status: {book.status}</p>
                </div>
                <div className="flex gap-2">
                  {book.status === "not_started" && (
                    <button
                      onClick={() => handleStatusUpdate(book.bookId, "reading")}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Start Reading
                    </button>
                  )}
                  {book.status === "reading" && (
                    <button
                      onClick={() => handleProgressUpdate(book.bookId, book.progress)}
                      className={`px-3 py-1 ${
                        updatingBookId === book.bookId
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 text-white"
                      } rounded`}
                      disabled={updatingBookId === book.bookId}
                    >
                      {updatingBookId === book.bookId ? "Updating..." : "Update Progress"}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books found for this status.</p>
      )}
    </div>
  );
};

export default Dashboard;


