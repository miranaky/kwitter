import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "@firebase/firestore";
import { signOut, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import { useHistory } from "react-router-dom";
import Kweet from "components/Kweet";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [kweets, setKweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

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
    // const res = await getDocs(myQuery);
  };

  const onChangeName = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  useEffect(() => {
    getMyKweet();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
          onChange={onChangeName}
        />
        <input type="submit" value="Edit UserName" />
      </form>
      <button onClick={onSignOut}>Sign Out</button>
      <div>
        <h3>My Kweet!</h3>
        {kweets &&
          kweets.map((kweet) => (
            <Kweet
              key={kweet.id}
              kweetObj={kweet}
              isOwn={kweet.creatorId === userObj.uid}
            />
          ))}
      </div>
    </>
  );
};

export default Profile;
