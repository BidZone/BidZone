import React from 'react';
import './ProfileOverview.css';

const ProfileOverview = ({ user }) => {
  return (
    <div className="profile-overview">
      <header className="profile-header">
        <img
          src={user.profilePicture || 'https://via.placeholder.com/150'}
          alt={`${user.name}'s profile`}
          className="profile-picture"
        />
        <h1>{user.name}</h1>
        <p className="user-email">{user.email}</p>
      </header>

      <section className="profile-details">
        <h2>About</h2>
        <p>{user.bio || 'This user has not added a bio yet.'}</p>

        <h2>Contact Information</h2>
        <ul>
          <li><strong>Phone:</strong> {user.phone || 'Not provided'}</li>
          <li><strong>Address:</strong> {user.address || 'Not provided'}</li>
        </ul>

        <h2>Activity</h2>
        <ul>
          <li><strong>Items Listed:</strong> {user.itemsListed || 0}</li>
          <li><strong>Bids Placed:</strong> {user.bidsPlaced || 0}</li>
          <li><strong>Account Created:</strong> {new Date(user.accountCreated).toLocaleDateString()}</li>
        </ul>
      </section>

      <footer className="profile-footer">
        <button className="edit-profile-btn">Edit Profile</button>
        <button className="logout-btn">Logout</button>
      </footer>
    </div>
  );
};

export default ProfileOverview;
