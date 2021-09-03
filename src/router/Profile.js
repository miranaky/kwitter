import { authService } from "fbase";
import { signOut } from "firebase/auth";
import React from "react";
import { useHistory } from "react-router-dom";

const Profile = () => {
  const history = useHistory();
  const onSignOut = async () => {
    await signOut(authService);
    history.push("/");
  };
  return (
    <>
      <button onClick={onSignOut}>Sign Out</button>
    </>
  );
};

export default Profile;
