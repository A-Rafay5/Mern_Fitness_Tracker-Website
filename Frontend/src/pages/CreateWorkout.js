import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateWorkout = () => {
  const [workoutData, setWorkoutData] = useState({
    name: "",
    category: "",
    exercises: [{ name: "", sets: "", reps: "", weight: "", notes: "" }],
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the input is part of the exercises array
    if (name.includes("exercises")) {
      const [field, index] = name.split("-");
      const updatedExercises = [...workoutData.exercises];
      updatedExercises[index][field] = value;

      setWorkoutData({
        ...workoutData,
        exercises: updatedExercises,
      });
    } else {
      // Handle regular input changes
      setWorkoutData({
        ...workoutData,
        [name]: value,
      });
    }
  };

  const handleExerciseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExercises = [...workoutData.exercises];
    updatedExercises[index][name] = value;
    setWorkoutData({ ...workoutData, exercises: updatedExercises });
  };

  const addExercise = () => {
    setWorkoutData({
      ...workoutData,
      exercises: [
        ...workoutData.exercises,
        { name: "", sets: "", reps: "", weight: "", notes: "" },
      ],
    });
  };

  const removeExercise = (index) => {
    const updatedExercises = workoutData.exercises.filter(
      (_, i) => i !== index
    );
    setWorkoutData({ ...workoutData, exercises: updatedExercises });
  };

  const handleTagAddition = () => {
    if (tagInput.trim() && !workoutData.tags.includes(tagInput)) {
      setWorkoutData({
        ...workoutData,
        tags: [...workoutData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setWorkoutData({
      ...workoutData,
      tags: workoutData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/workout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in header
        },
        body: JSON.stringify(workoutData), // Ensure this matches the backend structure
      });

      if (response.ok) {
        const createdWorkout = await response.json();
        console.log("Created Workout:", createdWorkout); // Debugging
        alert("Workout routine created successfully!");

        // Clear the form after submission
        setWorkoutData({
          name: "",
          category: "",
          exercises: [{ name: "", sets: 0, reps: 0, weight: 0, notes: "" }],
          tags: [],
        });

        // Redirect to the /workouts page after successful workout creation
        navigate("/dashboard/workouts");

        // Optionally, refresh the page
        // window.location.reload();
      } else {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        alert(errorResponse.error || "Failed to create workout routine.");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("An error occurred while creating the workout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Create Workout Routine
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Workout Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Workout Name
          </label>
          <input
            type="text"
            name="name"
            value={workoutData.name}
            onChange={handleInputChange}
            placeholder="E.g., Leg Day Routine"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            name="category"
            value={workoutData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Strength">Strength</option>
            <option value="Cardio">Cardio</option>
            <option value="Flexibility">Flexibility</option>
            <option value="Endurance">Endurance</option>
          </select>
        </div>

        {/* Exercises */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Exercises
          </label>
          {workoutData.exercises.map((exercise, index) => (
            <div
              key={index}
              className="space-y-2 bg-gray-50 p-4 rounded-lg mb-4"
            >
              <input
                type="text"
                name="name"
                value={exercise.name}
                onChange={(e) => handleExerciseChange(index, e)}
                placeholder="Exercise Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  name="sets"
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(index, e)}
                  placeholder="Sets"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="number"
                  name="reps"
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(index, e)}
                  placeholder="Reps"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="number"
                  name="weight"
                  value={exercise.weight}
                  onChange={(e) => handleExerciseChange(index, e)}
                  placeholder="Weight (kg)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <textarea
                name="notes"
                value={exercise.notes}
                onChange={(e) => handleExerciseChange(index, e)}
                placeholder="Notes (Optional)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeExercise(index)}
                  className="w-full mt-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 focus:outline-none"
                >
                  Remove Exercise
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addExercise}
            className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none"
          >
            Add Exercise
          </button>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Tags</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleTagAddition}
              disabled={!tagInput.trim()}
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {workoutData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Workout"}
        </button>
      </form>
    </div>
  );
};

export default CreateWorkout;
