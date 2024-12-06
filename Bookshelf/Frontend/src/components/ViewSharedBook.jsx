import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ViewSharedBook = () => {
    const { shareId } = useParams();
  const [sharedBook, setSharedBook] = useState(null);

  useEffect(() => {
    const fetchSharedBook = async () => {
      try {
        const res = await axiosInstance.get(`/api/share/${shareId}`);
        setSharedBook(res.data);
      } catch (error) {
        console.error("Error fetching shared book:", error);
      }
    };

    fetchSharedBook();
  }, [shareId]);

  if (!sharedBook) return <p>Loading...</p>;

  return (
    <div>
      <h1>{sharedBook.bookId.title}</h1>
      <p>Shared by: {sharedBook.userId.username}</p>
      <p>Rating: {sharedBook.rating}</p>
      <p>Review: {sharedBook.review}</p>
      <p>Progress: {sharedBook.progress}%</p>
    </div>
  );
};
export default ViewSharedBook;
