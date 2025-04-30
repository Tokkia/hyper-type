import React from 'react';
import UserProfileComponent from '../components/UserProfile';

const UserProfile = () => {
  return (
    <UserProfileComponent userId="test-user" username="guest_user" />
  );
};

export default UserProfile;