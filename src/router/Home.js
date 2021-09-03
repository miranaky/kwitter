import React, { useEffect, useRef, useState } from "react";
import { dbService, storageService } from "fbase";
import { addDoc, collection, onSnapshot, query } from "@firebase/firestore";
import { uploadString, ref, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Kweet from "components/Kweet";

const Home = ({ userObj }) => {
  const [kweet, setKweet] = useState("");
  const [kweets, setKweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  const inputFile = useRef();
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setKweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    //upload photo at storage bucket and create photoURL
    let attachmentUrl = "";
    if (attachment !== "") {
      const storageRef = ref(
        storageService,
        `kweet/${userObj.uid}/${uuidv4()}`
      );
      await uploadString(storageRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(storageRef);
      console.log(attachmentUrl);
    }
    //create kweet
    const kweetObj = {
      text: kweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    //upload kweet at firebase
    await addDoc(collection(dbService, "kweet"), kweetObj);

    //reset empty
    setKweet("");
    setAttachment("");
    inputFile.current.value = null;
  };

  const onChangeAttachment = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      const {
        target: { result },
      } = finishedEvent;
      setAttachment(result);
    };
  };

  const onClickClear = () => {
    setAttachment("");
    inputFile.current.value = null;
  };

  useEffect(() => {
    onSnapshot(query(collection(dbService, "kweet")), (snapshot) => {
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
        <input
          type="file"
          accept="image/*"
          onChange={onChangeAttachment}
          ref={inputFile}
        />
        <input type="submit" value="kweet" />
        {attachment && (
          <div>
            <img src={attachment} height="50px" width="50px" />
            <button onClick={onClickClear}>clear</button>
          </div>
        )}
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
