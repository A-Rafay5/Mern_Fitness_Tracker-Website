import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profilePicture: null,
    bio: "",
    gender: "",
    city: "",
    birthDate: "",
  });

  const [newProfileData, setNewProfileData] = useState({
    username: "",
    bio: "",
    profilePicture: null,
    gender: "",
    city: "",
    birthDate: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:5000/api/profile/get", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Fetched Data: ", response.data);
          setUserData(response.data);
          setNewProfileData({
            username: response.data.username,
            bio: response.data.bio || "",
            profilePicture: null,
            gender: response.data.gender || "",
            city: response.data.city || "",
            birthDate: response.data.birthDate || "",
          });
        })
        .catch((err) => {
          console.error("Error fetching profile: ", err);
          setError("Failed to fetch profile data.");
        });
    }
  }, [navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setNewProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile picture change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewProfileData((prevData) => ({
      ...prevData,
      profilePicture: file,
    }));
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("username", newProfileData.username);
    formData.append("bio", newProfileData.bio || "");

    if (newProfileData.profilePicture) {
      formData.append("profilePicture", newProfileData.profilePicture);
    }
    if (newProfileData.gender) formData.append("gender", newProfileData.gender);
    if (newProfileData.city) formData.append("city", newProfileData.city);
    if (newProfileData.birthDate)
      formData.append("birthDate", newProfileData.birthDate);

    // Debug FormData
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/profile/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Profile updated successfully.");
      setUserData({
        ...response.data,
        profilePicture: response.data.profilePicture,
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error response:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex item-center justify-center flex-col p-8 bg-gray-50 shadow-lg rounded-lg">
      {/* Header */}
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Profile
      </h2>

      {/* Profile Section */}
      <div className="flex flex-col items-center gap-6">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={
              userData.profilePicture
                ? `${userData.profilePicture}`
                : "backend/uploads/default-avatar.png"
            }
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-indigo-500 shadow-md"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Change Profile Picture"
          >
            ✎
          </button>
        </div>

        {/* User Details */}
        <div className=" mt-6 border-t border-gray-100 w-full">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">Username:</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                {userData.username}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">Email:</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                {userData.email}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">Bio:</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                {userData.bio || "No bio available"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">Gender:</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                {userData.gender || "Not specified"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">City:</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                {userData.city || "Not specified"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-gray-900">Birth Date:</dt>
              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                {userData.birthDate || "Not specified"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Edit Profile
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md relative mx-4 overflow-y-auto max-h-screen">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-medium"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newProfileData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter your username"
                />
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-gray-700 font-medium"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={newProfileData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Write a short bio"
                  rows="3"
                />
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-gray-700 font-medium"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={newProfileData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-gray-700 font-medium"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={newProfileData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Birth Date */}
              <div>
                <label
                  htmlFor="birthDate"
                  className="block text-gray-700 font-medium"
                >
                  Birth Date
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={newProfileData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="profilePicture"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              {/* Error & Message */}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {message && (
                <div className="text-green-500 text-sm">{message}</div>
              )}

              {/* Submit */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
