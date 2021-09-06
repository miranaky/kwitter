import React, { useState } from "react";
import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { dbService, storageService } from "fbase";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    <div className="nweet">
      {editting ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit your Kweet."
              onChange={onChange}
              value={newTweet}
              required
              autoFocus
              className="formInput"
            />
            <input type="submit" value="Update Kweet" className="formBtn" />
          </form>
          <button onClick={toggleEditting} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <h4>{kweetObj.text}</h4>
          {kweetObj.attachmentUrl && <img src={kweetObj.attachmentUrl} />}
          {isOwn && (
            <div className="nweet__actions">
              <span onClick={onClickDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditting}>
                {" "}
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Kweet;
