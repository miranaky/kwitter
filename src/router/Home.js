import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { addDoc, collection, onSnapshot } from "@firebase/firestore";
import Kweet from "components/Kweet";

const Home = ({ userObj }) => {
  const [kweet, setKweet] = useState("");
  const [kweets, setKweets] = useState([]);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setKweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "kweet"), {
      text: kweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setKweet("");
  };

  useEffect(() => {
    // getKweet();
    onSnapshot(collection(dbService, "kweet"), (snapshot) => {
      const kweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKweets(kweetArray);
    });
  }, []);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="kweet"
          type="text"
          value={kweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
          required
        />
        <input type="submit" value="kweet" />
      </form>
      <div>
        {kweets.map((kweet) => (
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

export default Home;
