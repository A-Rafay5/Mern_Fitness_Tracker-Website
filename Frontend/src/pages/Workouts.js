import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/workout/workouts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWorkouts(data);
        } else {
          const errorResponse = await response.json();
          setError(errorResponse.message || "Failed to fetch workouts.");
        }
      } catch (err) {
        console.error("Error fetching workouts:", err);
        setError("An error occurred while fetching workouts.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Exporting all workouts
  const handleExportWorkoutLogsToPDF = (workouts) => {
    if (!workouts || workouts.length === 0) {
      alert("No workout logs available to export.");
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Workout Logs", 105, 20, { align: "center" });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Divider
    doc.setDrawColor(150, 150, 150);
    doc.line(20, 35, 190, 35);

    let yOffset = 45;

    workouts.forEach((workout, index) => {
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }

      // Log Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(`Log #${index + 1}`, 20, yOffset);

      // Workout Details
      yOffset += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Workout Type: ${workout.type || "N/A"}`, 25, yOffset);
      doc.text(
        `Date: ${new Date(workout.createdAt).toLocaleDateString()}`,
        25,
        yOffset + 10
      );

      yOffset += 20;

      // Exercises Table
      if (workout.exercises && workout.exercises.length > 0) {
        const exercisesTable = workout.exercises.map((exercise, itemIndex) => [
          itemIndex + 1,
          exercise.name || "N/A",
          `${exercise.sets || "N/A"} sets`,
          `${exercise.reps || "N/A"} reps`,
          `${exercise.weight || "N/A"} kg`,
        ]);

        doc.autoTable({
          startY: yOffset,
          head: [["#", "Exercise", "Sets", "Reps", "Weight"]],
          body: exercisesTable,
          theme: "grid",
          styles: { font: "helvetica", fontSize: 10 },
          headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
        });

        yOffset = doc.lastAutoTable.finalY + 10;
      } else {
        doc.setFont("helvetica", "italic");
        doc.text("No exercises recorded.", 25, yOffset);
        yOffset += 20;
      }

      yOffset += 10;
    });

    // Save the PDF
    doc.save("Workout.pdf");
  };
  const handleExportIndividualWorkoutToPDF = (workout) => {
    if (!workout) {
      alert("No workout log available to export.");
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(`${workout.name} Workout Log`, 105, 20, { align: "center" });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Divider
    doc.setDrawColor(150, 150, 150);
    doc.line(20, 35, 190, 35);

    let yOffset = 45;

    // Workout Details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Workout Name: ${workout.name || "N/A"}`, 25, yOffset); // Fix: workout.name instead of workout.type
    doc.text(
      `Date: ${new Date(workout.createdAt).toLocaleDateString()}`,
      25,
      yOffset + 10
    );

    yOffset += 20;

    // Exercises Table
    if (workout.exercises && workout.exercises.length > 0) {
      const exercisesTable = workout.exercises.map((exercise, itemIndex) => [
        itemIndex + 1,
        exercise.name || "N/A",
        `${exercise.sets || "N/A"} sets`,
        `${exercise.reps || "N/A"} reps`,
        `${exercise.weight || "N/A"} kg`,
      ]);

      doc.autoTable({
        startY: yOffset,
        head: [["#", "Exercise", "Sets", "Reps", "Weight"]],
        body: exercisesTable,
        theme: "grid",
        styles: { font: "helvetica", fontSize: 10 },
        headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
      });

      yOffset = doc.lastAutoTable.finalY + 10;
    } else {
      doc.setFont("helvetica", "italic");
      doc.text("No exercises recorded.", 25, yOffset);
      yOffset += 20;
    }

    // Save the PDF
    doc.save(`${workout.name}_Workout.pdf`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not authenticated.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/workout/workouts/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setWorkouts(workouts.filter((workout) => workout._id !== id));
        alert("Workout deleted successfully!");
      } else {
        const errorResponse = await response.json();
        alert(errorResponse.message || "Failed to delete workout.");
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("An error occurred while deleting the workout.");
    }
  };

  const openDialog = (workout) => {
    setSelectedWorkout(workout);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setSelectedWorkout(null);
    setShowDialog(false);
  };

  const filteredWorkouts = workouts.filter((workout) => {
    return (
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h2 className="text-2xl font-extrabold text-center mb-10 md:mb-0">Workouts Logs</h2>
  
        {/* Navigation Button */}
        <div className="mb-6 flex justify-end space-x-4">
          <button
            onClick={() => (window.location.href = "/dashboard/workout/create")}
            className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 w-full md:w-auto"
          >
            + Create Workout
          </button>
          <button
            onClick={() => handleExportWorkoutLogsToPDF(workouts)}
            className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ml-2 w-full md:w-auto"
          >
            Export All
          </button>
        </div>
      </div>
  
      {/* Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by workout name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 w-full md:w-1/2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>
  
      {/* Table for displaying workouts */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-6 py-4 text-left font-semibold text-sm">Workout Name</th>
              <th className="px-6 py-4 text-left font-semibold text-sm">Category</th>
              <th className="px-6 py-4 text-left font-semibold text-sm">Exercises</th>
              <th className="px-6 py-4 text-center font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <tr key={workout._id} className="hover:bg-gray-50 transition duration-200 border-b text-left">
                  <td className="px-6 py-4 font-bold text-indigo-600 text-base">{workout.name}</td>
                  <td className="px-6 py-4 font-bold text-gray-700 text-base">{workout.category}</td>
                  <td className="px-7 py-4 font-bold text-gray-800 text-base">
                    <div>
                      {workout.exercises.slice(0, 2).map((exercise, index) => (
                        <div key={index} className="text-base">
                          <strong>{exercise.name}</strong>: {exercise.sets} sets, {exercise.reps} reps
                          {exercise.weight && ` (Weight: ${exercise.weight}kg)`}
                        </div>
                      ))}
                      {workout.exercises.length > 2 && (
                        <div className="text-sm text-gray-500">+ {workout.exercises.length - 2} more...</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => openDialog(workout)}
                        className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 w-full"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(workout._id)}
                        className="bg-red-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300 w-full"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleExportIndividualWorkoutToPDF(workout)}
                        className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 w-full"
                      >
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No workouts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {/* Dialog for View Workout Details */}
      {showDialog && selectedWorkout && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full md:max-w-lg">
            <h3 className="text-2xl font-semibold mb-4 text-center">Workout Information</h3>
            <div className="space-y-4">
              <div>
                <strong className="text-lg">Name:</strong>
                <span className="text-gray-700">{selectedWorkout.name || "N/A"}</span>
              </div>
              <div>
                <strong className="text-lg">Category:</strong>
                <span className="text-gray-700">{selectedWorkout.category || "N/A"}</span>
              </div>
              <div>
                <strong className="text-lg">Exercises:</strong>
                <ul className="list-disc pl-6">
                  {selectedWorkout.exercises?.map((exercise, idx) => (
                    <li key={idx} className="text-gray-700">
                      <strong>{exercise.name}</strong>: {exercise.sets} sets, {exercise.reps} reps
                      {exercise.weight && ` (Weight: ${exercise.weight}kg)`}
                      {exercise.notes && <p className="italic text-gray-500">Notes: {exercise.notes}</p>}
                    </li>
                  )) || <li className="text-gray-500">No exercises recorded</li>}
                </ul>
              </div>
              <div>
                <strong className="text-lg">Tags:</strong>
                <span className="text-gray-700">{selectedWorkout.tags?.join(", ") || "N/A"}</span>
              </div>
              <div>
                <strong className="text-lg">Created At:</strong>
                <span className="text-gray-700">
                  {new Date(selectedWorkout.createdAt).toLocaleString() || "N/A"}
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={closeDialog}
                className="bg-red-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Workouts;
