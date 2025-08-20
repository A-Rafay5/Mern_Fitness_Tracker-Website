import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Progress = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progressEntries, setProgressEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEntries, setFilteredEntries] = useState([]);

  // Fetch progress data
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token"); // Replace with your authentication logic
        const response = await axios.get(
          "http://localhost:5000/api/progress/get",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProgressEntries(response.data.progressEntries);
        setFilteredEntries(response.data.progressEntries);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch progress data. Please try again later.");
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  // Handle search filter
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    const filtered = progressEntries.filter((entry) => {
      const weightMatch = entry.weight.toString().includes(query);
      const dateMatch = new Date(entry.date)
        .toLocaleDateString()
        .includes(query);

      return weightMatch || dateMatch;
    });

    setFilteredEntries(filtered);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not authenticated.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/progress/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProgressEntries(
          progressEntries.filter((progress) => progress._id !== id)
        );
        alert("Progress deleted successfully!");
        window.location.reload(); // Refresh page after deletion
      } else {
        const errorResponse = await response.json();
        alert(errorResponse.message || "Failed to delete.");
      }
    } catch (error) {
      console.error("Error deleting progress:", error);
      alert("An error occurred while deleting the progress.");
    }
  };

  const handleExportProgressToPDF = (progress) => {
    if (!progress) {
      alert("No progress log available to export.");
      return;
    }

    const doc = new jsPDF();

    // Header with Progress Log and the specific log date
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Progress Log", 105, 20, { align: "center" });

    // Subtitle: Exported on the current date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Divider
    doc.setDrawColor(150, 150, 150);
    doc.line(20, 35, 190, 35);

    let yOffset = 45;

    // Adding the date of the specific progress log entry
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(
      `Log Date: ${new Date(progress.date).toLocaleDateString()}`,
      20,
      yOffset
    );

    yOffset += 10;

    // Progress Details Table
    if (progress) {
      const tableData = [
        [
          progress.weight || "N/A",
          progress.bodyMeasurements?.waist || "N/A",
          progress.bodyMeasurements?.chest || "N/A",
          progress.performanceMetrics?.runTime || "N/A",
          progress.performanceMetrics?.benchPress || "N/A",
        ],
      ];

      // Table Headers
      const tableHeaders = [
        "Weight (kg)",
        "Waist (cm)",
        "Chest (cm)",
        "Run Time (min)",
        "Bench Press (kg)",
      ];

      doc.autoTable({
        startY: yOffset,
        head: [tableHeaders],
        body: tableData,
        theme: "grid",
        styles: { font: "helvetica", fontSize: 10 },
        headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
      });

      yOffset = doc.lastAutoTable.finalY + 10;
    } else {
      doc.setFont("helvetica", "italic");
      doc.text("No progress data available.", 25, yOffset);
      yOffset += 20;
    }

    // Save the PDF
    doc.save(
      `Progress_Log_${new Date(progress.date).toLocaleDateString()}.pdf`
    );
  };

  const handleExportAllProgressToPDF = () => {
    if (progressEntries.length === 0) {
      alert("No progress logs available to export.");
      return;
    }

    const doc = new jsPDF();

    // Header with Progress Logs and Export Date
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Progress Logs", 105, 20, { align: "center" });

    // Subtitle: Exported on the current date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Divider
    doc.setDrawColor(150, 150, 150);
    doc.line(20, 35, 190, 35);

    let yOffset = 45; // Starting position for the first log

    progressEntries.forEach((progress, index) => {
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20; // Reset for the new page
      }

      // Log Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(`Log #${index + 1}`, 20, yOffset);

      // Log Details
      yOffset += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Weight: ${progress.weight || "N/A"}`, 25, yOffset);
      doc.text(
        `Waist: ${progress.bodyMeasurements?.waist || "N/A"}`,
        25,
        yOffset + 10
      );
      doc.text(
        `Chest: ${progress.bodyMeasurements?.chest || "N/A"}`,
        25,
        yOffset + 20
      );
      doc.text(
        `Run Time: ${progress.performanceMetrics?.runTime || "N/A"}`,
        25,
        yOffset + 30
      );
      doc.text(
        `Bench Press: ${progress.performanceMetrics?.benchPress || "N/A"}`,
        25,
        yOffset + 40
      );

      yOffset += 50;
    });

    // Save the PDF
    doc.save(`All_Progress_Logs_${new Date().toLocaleDateString()}.pdf`);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <span className="text-lg text-gray-700">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <span className="text-lg text-red-600">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h2 className="text-2xl font-extrabold text-center mb-10 md:mb-0">
          Progress Logs
        </h2>
        {/* Navigation Button */}
        <div className="mb-6 flex justify-end space-x-4">
          <button
            onClick={() =>
              (window.location.href = "/dashboard/progress/create")
            }
            className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            + Add Progress
          </button>
          <button
            onClick={() => handleExportAllProgressToPDF(progressEntries)} // Use your new function here
            className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Export All
          </button>
        </div>
      </div>
      {/* Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by weight or date"
          className="p-3 w-full md:w-1/2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="w-full table-auto border-collapse bg-white rounded-lg shadow overflow-y-auto max-h-[400px]">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-6 py-4 text-left font-semibold text-sm">
                Weight (kg)
              </th>
              <th className="px-6 py-4 text-left font-semibold text-sm">
                Waist (cm)
              </th>
              <th className="px-6 py-4 text-left font-semibold text-sm">
                Chest (cm)
              </th>
              <th className="px-6 py-4 text-left font-semibold text-sm">
                Run Time (min)
              </th>
              <th className="px-6 py-4 text-left font-semibold text-sm">
                Bench Press (kg)
              </th>
              <th className="px-6 py-4 text-left font-semibold text-sm">
                Date
              </th>
              <th className="px-6 py-4 text-left font-semibold text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((progress) => (
                <tr
                  key={progress._id}
                  className="hover:bg-gray-50 transition duration-200 border-b text-left"
                >
                  <td className="px-6 py-4 text-base font-bold">
                    {progress.weight}
                  </td>
                  <td className="px-6 py-4 text-base font-bold">
                    {progress.bodyMeasurements?.waist || "-"}
                  </td>
                  <td className="px-6 py-4 text-base font-bold">
                    {progress.bodyMeasurements?.chest || "-"}
                  </td>
                  <td className="px-6 py-4 text-base font-bold">
                    {progress.performanceMetrics?.runTime || "-"}
                  </td>
                  <td className="px-6 py-4 text-base font-bold">
                    {progress.performanceMetrics?.benchPress || "-"}
                  </td>
                  <td className="px-6 py-4 text-base font-bold">
                    {new Date(progress.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 relative space-y-2">
                    <button
                      onClick={() => handleDelete(progress._id)}
                      className="bg-red-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300 w-full text-base font-bold"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleExportProgressToPDF(progress)} // Use the new function here
                      className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 w-full text-base font-bold"
                    >
                      Export
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No matching logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Progress;
