import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const NutritionTracking = () => {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null); // State for selected log for details view
  const dropdownRefs = useRef({});

  // Fetch nutrition logs when component mounts
  useEffect(() => {
    const fetchNutritionLogs = async () => {
      const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

      try {
        const response = await axios.get(
          "http://localhost:5000/api/nutrition/get",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNutritionLogs(response.data); // response.data contains the actual data
        setFilteredLogs(response.data); // Initially, no filtering
      } catch (err) {
        console.error("Error fetching nutrition logs:", err);
        // Handle error message based on the response
        if (err.response) {
          // If the error is from the server (e.g., 4xx or 5xx)
          setError(
            err.response.data.message || "Failed to fetch nutrition logs"
          );
        } else if (err.request) {
          // If no response was received from the server
          setError("No response from server");
        } else {
          // Other types of errors (e.g., network issues)
          setError("An error occurred while fetching nutrition logs");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionLogs();
  }, []);

  // Function to handle viewing details of a specific nutrition log
  const handleViewDetails = (log) => {
    setSelectedLog(log); // Set the selected log for details view
  };

  const handleExportNutritionLogsToPDF = (nutritionLogs) => {
    if (!nutritionLogs || nutritionLogs.length === 0) {
      alert("No nutrition logs available to export.");
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Nutrition Logs", 105, 20, { align: "center" });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Divider
    doc.setDrawColor(150, 150, 150);
    doc.line(20, 35, 190, 35);

    let yOffset = 45; // Starting position for the first log

    nutritionLogs.forEach((log, index) => {
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
      doc.text(`Meal Type: ${log.mealType || "N/A"}`, 25, yOffset);
      doc.text(
        `Date: ${new Date(log.createdAt).toLocaleDateString()}`,
        25,
        yOffset + 10
      );

      yOffset += 20;

      // Food Items Table
      if (log.foodItems && log.foodItems.length > 0) {
        const foodItemsTable = log.foodItems.map((item, itemIndex) => [
          itemIndex + 1,
          item.name || "N/A",
          `${item.quantity || "N/A"} ${item.unit || ""}`,
          `${item.calories || "N/A"} kcal`,
          `${item.macros?.protein || "N/A"} g`,
          `${item.macros?.carbs || "N/A"} g`,
          `${item.macros?.fats || "N/A"} g`,
        ]);

        doc.autoTable({
          startY: yOffset,
          head: [
            [
              "#",
              "Food Item",
              "Quantity",
              "Calories",
              "Protein (g)",
              "Carbs (g)",
              "Fats (g)",
            ],
          ],
          body: foodItemsTable,
          theme: "grid",
          styles: { font: "helvetica", fontSize: 10 },
          headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
        });

        yOffset = doc.lastAutoTable.finalY + 10; // Adjust yOffset after the table
      } else {
        doc.setFont("helvetica", "italic");
        doc.text("No food items recorded.", 25, yOffset);
        yOffset += 20;
      }

      yOffset += 10; // Space after each log
    });

    // Save the PDF
    doc.save("Nutrition.pdf");
  };
  const handleExportIndividualNutritionToPDF = (log) => {
    if (!log) {
      alert("No nutrition log available to export.");
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(`${log.mealType} Nutrition Log`, 105, 20, { align: "center" });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Divider
    doc.setDrawColor(150, 150, 150);
    doc.line(20, 35, 190, 35);

    let yOffset = 45; // Starting position for the first log

    // Log Details
    yOffset += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Meal Type: ${log.mealType || "N/A"}`, 25, yOffset);
    doc.text(
      `Date: ${new Date(log.createdAt).toLocaleDateString()}`,
      25,
      yOffset + 10
    );

    yOffset += 20;

    // Food Items Table
    if (log.foodItems && log.foodItems.length > 0) {
      const foodItemsTable = log.foodItems.map((item, itemIndex) => [
        itemIndex + 1,
        item.name || "N/A",
        `${item.quantity || "N/A"} ${item.unit || ""}`,
        `${item.calories || "N/A"} kcal`,
        `${item.macros?.protein || "N/A"} g`,
        `${item.macros?.carbs || "N/A"} g`,
        `${item.macros?.fats || "N/A"} g`,
      ]);

      doc.autoTable({
        startY: yOffset,
        head: [
          [
            "#",
            "Food Item",
            "Quantity",
            "Calories",
            "Protein (g)",
            "Carbs (g)",
            "Fats (g)",
          ],
        ],
        body: foodItemsTable,
        theme: "grid",
        styles: { font: "helvetica", fontSize: 10 },
        headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255] },
      });

      yOffset = doc.lastAutoTable.finalY + 10; // Adjust yOffset after the table
    } else {
      doc.setFont("helvetica", "italic");
      doc.text("No food items recorded.", 25, yOffset);
      yOffset += 20;
    }

    // Save the PDF
    doc.save(`${log.mealType}_Nutrition.pdf`);
  };
  // Function to handle search filter
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    // Filter logs based on meal type, food items, and date
    const filtered = nutritionLogs.filter((log) => {
      const mealTypeMatch = log.mealType.toLowerCase().includes(query);
      const foodItemsMatch = log.foodItems.some((item) =>
        item.name.toLowerCase().includes(query)
      );
      const dateMatch = new Date(log.date).toLocaleDateString().includes(query);

      return mealTypeMatch || foodItemsMatch || dateMatch;
    });

    setFilteredLogs(filtered); // Update the displayed logs
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  const handleOutsideClick = (e) => {
    if (
      dropdownRefs.current &&
      !Object.values(dropdownRefs.current).some((ref) =>
        ref?.contains(e.target)
      )
    ) {
      setDropdownOpen(null);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not authenticated.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/nutrition/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNutritionLogs(
          nutritionLogs.filter((nutrition) => nutrition._id !== id)
        );
        alert("Nutrition deleted successfully!");
        window.location.reload(); // Page refresh after successful delete
      } else {
        const errorResponse = await response.json();
        alert(errorResponse.message || "Failed to delete.");
      }
    } catch (error) {
      console.error("Error deleting nutrition:", error);
      alert("An error occurred while deleting the nutrition.");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <span className="text-lg text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-2xl font-extrabold text-center mb-6 md:mb-0">
          Nutrition Logs
        </h2>
  
        {/* Buttons */}
        <div className="mb-6 flex justify-end space-x-4">
          <button
            onClick={() => (window.location.href = "/dashboard/nutrition/create")}
            className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 w-full md:w-auto"
          >
            + Create Nutrition
          </button>
          <button
            onClick={() => handleExportNutritionLogsToPDF(nutritionLogs)}
            className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 w-full md:w-auto"
          >
            Export All
          </button>
        </div>
      </div>
  
      {/* Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by meal type, food name, or date"
          className="p-3 w-full md:w-1/2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
  
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-6 py-4 text-left font-semibold text-sm">Meal Type</th>
              <th className="px-6 py-4 text-left font-semibold text-sm">Food Items</th>
              <th className="px-6 py-4 text-left font-semibold text-sm">Calories</th>
              <th className="px-6 py-4 text-left font-semibold text-sm">Protein (g)</th>
              <th className="px-6 py-4 text-left font-semibold text-sm">Carbs (g)</th>
              <th className="px-6 py-4 text-left font-semibold text-sm">Fats (g)</th>
              <th className="px-6 py-4 text-left font-semibold text-sm">Date</th>
              <th className="px-6 py-4 text-left font-semibold text-sm">Actions</th>
            </tr>
          </thead>
  
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((nutrition) => (
                <tr key={nutrition._id} className="hover:bg-gray-50 transition text-left duration-200 border-b">
                  <td className="px-6 py-4 text-base font-bold">{nutrition.mealType || "N/A"}</td>
                  <td className="px-6 py-4 text-base font-bold">
                    {nutrition.foodItems?.map((item, idx) => (
                      <span key={idx} className="block text-base font-bold">
                        {item.name} ({item.quantity} {item.unit})
                      </span>
                    )) || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-base font-bold">
                    {nutrition.foodItems
                      ? nutrition.foodItems.reduce((acc, item) => acc + item.calories, 0)
                      : 0}{" "}
                    kcal
                  </td>
                  <td className="px-6 py-4 text-base font-bold">
                    {nutrition.foodItems
                      ? nutrition.foodItems.reduce((acc, item) => acc + item.macros.protein, 0)
                      : 0}{" "}
                    g
                  </td>
                  <td className="px-6 py-4 text-base font-bold">
                    {nutrition.foodItems
                      ? nutrition.foodItems.reduce((acc, item) => acc + item.macros.carbs, 0)
                      : 0}{" "}
                    g
                  </td>
                  <td className="px-6 py-4 text-base font-bold">
                    {nutrition.foodItems
                      ? nutrition.foodItems.reduce((acc, item) => acc + item.macros.fats, 0)
                      : 0}{" "}
                    g
                  </td>
                  <td className="px-6 py-4 text-base font-bold">
                    {nutrition.date ? new Date(nutrition.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 relative space-y-2">
                    <button
                      onClick={() => handleViewDetails(nutrition)}
                      className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 w-full text-base font-bold"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(nutrition._id)}
                      className="bg-red-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300 w-full text-base font-bold"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleExportIndividualNutritionToPDF(nutrition)}
                      className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 w-full text-base font-bold"
                    >
                      Export
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  No Nutrition found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {/* Modal for viewing details */}
      {selectedLog && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Nutrition Log Details
            </h3>
  
            {/* Details Section */}
            <div className="space-y-4">
              <div>
                <strong className="text-lg">Meal Type:</strong>
                <span className="text-gray-700">{selectedLog.mealType || "N/A"}</span>
              </div>
  
              <div>
                <strong className="text-lg">Date:</strong>
                <span className="text-gray-700">
                  {new Date(selectedLog.date).toLocaleDateString() || "N/A"}
                </span>
              </div>
  
              <div>
                <strong className="text-lg">Food Items:</strong>
                <ul className="list-disc pl-6">
                  {selectedLog.foodItems?.map((item, idx) => (
                    <li key={idx} className="text-gray-700">
                      {item.name} ({item.quantity} {item.unit})
                    </li>
                  )) || <li className="text-gray-500">No food items recorded</li>}
                </ul>
              </div>
  
              <div className="space-y-2">
                <strong className="text-lg">Nutritional Information:</strong>
                <div>
                  <span className="font-semibold">Calories:</span>
                  <span className="text-gray-700">
                    {selectedLog.foodItems
                      ? selectedLog.foodItems.reduce((acc, item) => acc + item.calories, 0)
                      : 0}{" "}
                    kcal
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Protein:</span>
                  <span className="text-gray-700">
                    {selectedLog.foodItems
                      ? selectedLog.foodItems.reduce((acc, item) => acc + item.macros.protein, 0)
                      : 0}{" "}
                    g
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Carbs:</span>
                  <span className="text-gray-700">
                    {selectedLog.foodItems
                      ? selectedLog.foodItems.reduce((acc, item) => acc + item.macros.carbs, 0)
                      : 0}{" "}
                    g
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Fats:</span>
                  <span className="text-gray-700">
                    {selectedLog.foodItems
                      ? selectedLog.foodItems.reduce((acc, item) => acc + item.macros.fats, 0)
                      : 0}{" "}
                    g
                  </span>
                </div>
              </div>
              <div>
                <strong className="text-lg">Created At:</strong>
                <span className="text-gray-700">
                  {new Date(selectedLog.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
  
            {/* Close Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setSelectedLog(null)}
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

export default NutritionTracking;
