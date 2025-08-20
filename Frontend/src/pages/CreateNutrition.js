import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateNutrition = () => {
  const [mealType, setMealType] = useState("");
  const [foodItems, setFoodItems] = useState([
    {
      name: "",
      quantity: "",
      unit: "",
      calories: "",
      macros: {
        protein: "",
        carbs: "",
        fats: "",
      },
    },
  ]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle changes in meal type
  const handleMealTypeChange = (e) => {
    setMealType(e.target.value);
  };

  // Handle changes in food item fields
  const handleFoodItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFoodItems = [...foodItems];
    if (name === "macros") {
      updatedFoodItems[index].macros[e.target.dataset.type] = value;
    } else {
      updatedFoodItems[index][name] = value;
    }
    setFoodItems(updatedFoodItems);
  };

  // Add a new food item to the list
  const addFoodItem = () => {
    setFoodItems([
      ...foodItems,
      {
        name: "",
        quantity: "",
        unit: "",
        calories: "",
        macros: {
          protein: "",
          carbs: "",
          fats: "",
        },
      },
    ]);
  };

  // Remove a food item from the list
  const removeFoodItem = (index) => {
    const updatedFoodItems = foodItems.filter((_, i) => i !== index);
    setFoodItems(updatedFoodItems);
  };

  // Handle date change
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

    try {
      const response = await axios.post(
        "http://localhost:5000/api/nutrition/add",
        { mealType, foodItems, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Nutrition entry added:", response.data);
      setLoading(false);

      // Clear form
      setMealType("");
      setFoodItems([
        {
          name: "",
          quantity: "",
          unit: "",
          calories: "",
          macros: {
            protein: "",
            carbs: "",
            fats: "",
          },
        },
      ]);
      setDate(""); // Reset the date field
      alert("Nutrition added successfully!");

      // Redirect to /dashboard/nutrition after successful submission
      navigate("/dashboard/nutrition");
    } catch (err) {
      console.error("Error adding nutrition entry:", err);
      setError("Failed to add nutrition entry");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Add Nutrition Entry
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Date input */}
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleDateChange}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="mealType"
            className="block text-sm font-medium text-gray-700"
          >
            Meal Type
          </label>
          <select
            id="mealType"
            value={mealType}
            onChange={handleMealTypeChange}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            required
          >
            <option value="">Select meal type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </div>

        {foodItems.map((item, index) => (
          <div
            key={index}
            className="mb-6 p-4 border border-gray-200 rounded-md"
          >
            <h4 className="text-lg font-medium mb-4">Food Item {index + 1}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={(e) => handleFoodItemChange(index, e)}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleFoodItemChange(index, e)}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <input
                  type="text"
                  name="unit"
                  value={item.unit}
                  onChange={(e) => handleFoodItemChange(index, e)}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Calories
                </label>
                <input
                  type="number"
                  name="calories"
                  value={item.calories}
                  onChange={(e) => handleFoodItemChange(index, e)}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Protein (g)
                </label>
                <input
                  type="number"
                  name="macros"
                  data-type="protein"
                  value={item.macros.protein}
                  onChange={(e) => handleFoodItemChange(index, e)}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  name="macros"
                  data-type="carbs"
                  value={item.macros.carbs}
                  onChange={(e) => handleFoodItemChange(index, e)}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fats (g)
                </label>
                <input
                  type="number"
                  name="macros"
                  data-type="fats"
                  value={item.macros.fats}
                  onChange={(e) => handleFoodItemChange(index, e)}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeFoodItem(index)}
                className="w-full mt-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Remove Food Item
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={addFoodItem}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Add Food Item
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            {loading ? "Submitting..." : "Submit Nutrition Entry"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default CreateNutrition;
