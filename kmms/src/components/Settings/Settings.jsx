import React, { useState } from "react";
import { uploadProfileImage } from "../../api/upload";

export default function Settings({ user }) {
  const [profile, setProfile] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [preview, setPreview] = useState(user.profileImage || "");

  // === Handlers ===
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    alert("Profile updated (connect backend later)");
  };

  const handlePasswordUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }
    alert("Password updated (backend later)");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload to backend
    const upload = await uploadProfileImage(file);
    setPreview(upload.imageUrl);

    alert("Profile picture updated!");
  };

  // ============================
  //         RETURN UI
  // ============================
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      <p className="text-gray-600 mb-4">
        Manage your account settings and preferences
      </p>

      {/* TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT CARD — PROFILE PICTURE */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <h3 className="font-semibold text-gray-800 mb-4">Profile Picture</h3>

          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover"
                alt="profile"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-purple-500 to-pink-500">
                {user.name[0].toUpperCase()}
              </div>
            )}
          </div>

          <label className="mt-4 px-4 py-2 border rounded-lg cursor-pointer bg-white hover:bg-gray-100">
            Upload New Photo
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>

          <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB</p>
        </div>

        {/* RIGHT CARD — PROFILE DETAILS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-gray-800 mb-4">Profile Information</h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full p-3 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full p-3 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className="w-full p-3 border rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Role</label>
              <input
                type="text"
                value={profile.role}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() =>
                  setProfile({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                  })
                }
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD CARD */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600">Current Password</label>
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">New Password</label>
            <input
              type="password"
              name="new"
              value={passwords.new}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
            />
          </div>
        </div>

        <button
          onClick={handlePasswordUpdate}
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
