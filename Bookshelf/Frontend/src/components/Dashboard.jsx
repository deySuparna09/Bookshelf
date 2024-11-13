import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Dashboard = ({ userId }) => {
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [friendsUpdates, setFriendsUpdates] = useState([]);

  useEffect(() => {
    if (userId) {
      // Fetching the currently reading books data
      fetch(`/api/user/${userId}/currently-reading`)
        .then(response => response.json())
        .then(data => {
          setCurrentlyReading(Array.isArray(data) ? data : []);
        })
        .catch(error => {
          console.error('Error fetching currently reading books:', error);
          setCurrentlyReading([]);
        });

      // Fetching the friends' updates
      fetch(`/api/user/${userId}/friends-updates`)
        .then(response => response.json())
        .then(data => {
          setFriendsUpdates(Array.isArray(data) ? data : []);
        })
        .catch(error => {
          console.error('Error fetching friends updates:', error);
          setFriendsUpdates([]);
        });
    }
  }, [userId]);

  return (
    <>
    <div className ="dashboard">
      <h1>Dashboard</h1>

      {/* Currently Reading Section */}
      <section>
        <h2>Currently Reading</h2>
        {currentlyReading.length > 0 ? (
          <ul>
            {currentlyReading.map(book => (
              <li key={book.id}>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No books currently being read.</p>
        )}
      </section>

      {/* Friends' Updates Section */}
      <section>
        <h2>Friends Updates</h2>
        {friendsUpdates.length > 0 ? (
          <ul>
            {friendsUpdates.map(update => (
              <li key={update.id}>
                <p>{update.friendName} is reading {update.bookTitle}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent updates from friends.</p>
        )}
      </section>
    </div>
    </>
  );
};

Dashboard.propTypes = {
  userId: PropTypes.string,
};

export default Dashboard;


