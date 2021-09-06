import React, { useState } from "react";

const EditProfile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

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

  return (
    <form onSubmit={onSubmit} className="profileForm">
      <input
        onChange={onChangeName}
        type="text"
        autoFocus
        placeholder="Display Name"
        value={newDisplayName}
        className="formInput"
      />
      <input
        type="submit"
        value="Edit UserName"
        className="formBtn"
        style={{
          marginTop: 10,
        }}
      />
    </form>
  );
};

export default EditProfile;
