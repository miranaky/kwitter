import React, { useState } from "react";
import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { dbService, storageService } from "fbase";

const Kweet = ({ kweetObj, isOwn }) => {
  const [editting, setEditting] = useState(false);
  const [newTweet, setNewTweet] = useState(kweetObj.text);

  const onClickDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this kweet?");
    if (ok) {
      await deleteDoc(doc(dbService, "kweet", kweetObj.id));
      if (kweetObj.attachmentUrl !== "") {
        await deleteObject(ref(storageService, kweetObj.attachmentUrl));
      }
    }
  };

  const toggleEditting = () => setEditting((prev) => !prev);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(dbService, "kweet", kweetObj.id), { text: newTweet });
    setEditting(false);
  };

  return (
    <div>
      {editting ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your Kweet."
              onChange={onChange}
              value={newTweet}
              required
            />
            <input type="submit" value="Update Kweet" />
          </form>
          <button onClick={toggleEditting}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{kweetObj.text}</h4>
          {kweetObj.attachmentUrl && (
            <img
              src={kweetObj.attachmentUrl}
              width="50px"
              height="50px"
              alt={kweetObj.id}
            />
          )}
          {isOwn && (
            <>
              <button onClick={onClickDelete}>Delete</button>
              <button onClick={toggleEditting}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Kweet;
