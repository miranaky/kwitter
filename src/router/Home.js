import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { collection, onSnapshot, query, orderBy } from "@firebase/firestore";

import Kweet from "components/Kweet";
import KweetFactory from "components/KweetFactory";

const Home = ({ userObj }) => {
  const [kweets, setKweets] = useState([]);

  useEffect(() => {
    const orderedKweetQuery = query(
      collection(dbService, "kweet"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(orderedKweetQuery, (snapshot) => {
      const kweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKweets(kweetArray);
    });
  }, []);
  return (
    <div className="container">
      <KweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
