import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "@firebase/firestore";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import Kweet from "components/Kweet";
import EditProfile from "components/EditProfile";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [kweets, setKweets] = useState([]);

  const onSignOut = async () => {
    await signOut(authService);
    history.push("/");
  };

  const getMyKweet = async () => {
    const myCollection = collection(dbService, "kweet");
    const myQuery = query(
      myCollection,
      orderBy("createdAt", "desc"),
      where("creatorId", "==", userObj.uid)
    );
    onSnapshot(myQuery, (snapshot) => {
      const kweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKweets(kweetArray);
    });
  };

  useEffect(() => {
    getMyKweet();
  }, []);

  return (
    <div className="container">
      <EditProfile userObj={userObj} refreshUser={refreshUser} />
      <span className="formBtn cancelBtn logOut" onClick={onSignOut}>
        Sign Out
      </span>
      <div style={{ marginTop: 30 }}>
        <h3
          style={{
            margin: 20,
            fontSize: 20,
            justifyContent: "center",
          }}
        >
          My Kweets!
        </h3>
        {kweets &&
          kweets.map((kweet) => (
            <Kweet
              key={kweet.id}
              kweetObj={kweet}
              isOwn={kweet.creatorId === userObj.uid}
            />
          ))}
      </div>
    </div>
  );
};

export default Profile;
