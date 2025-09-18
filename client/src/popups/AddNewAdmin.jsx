import React, { useState } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";

const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    dispatch(addNewAdmin(formData));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img src={keyIcon} alt="key-icon" className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-semibold">Add New Admin</h3>
          </div>
          <img
            src={closeIcon}
            alt="close-icon"
            className="w-6 h-6 cursor-pointer"
            onClick={() => dispatch(toggleAddNewAdminPopup())}
          />
        </header>

        {/* Form */}
        <form onSubmit={handleAddNewAdmin} className="flex flex-col gap-4">
          {/* Avatar Selection */}
          <div className="flex flex-col items-center mb-6">
            <label htmlFor="avatarInput" className="cursor-pointer">
              <img
                src={avatarPreview ? avatarPreview : placeHolder}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover"
              />
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-900 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Admin's Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-900 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin's Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-900 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin's Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => dispatch(toggleAddNewAdminPopup())}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAdmin;
