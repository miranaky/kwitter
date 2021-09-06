import React, { useRef, useState } from "react";
import { dbService, storageService } from "fbase";
import { addDoc, collection } from "@firebase/firestore";
import { uploadString, ref, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const KweetFactory = ({ userObj }) => {
  const [kweet, setKweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const inputFile = useRef();

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setKweet(value);
  };
  const onSubmit = async (event) => {
    if (kweet === "") {
      return;
    }
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

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          name="kweet"
          type="text"
          value={kweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
          required
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onChangeAttachment}
        ref={inputFile}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
            alt=""
          />
          <div className="factoryForm__clear" onClick={onClickClear}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};
export default KweetFactory;
