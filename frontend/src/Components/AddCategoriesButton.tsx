import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface AddCategoriesButtonProps {
  userId: string | undefined; // userID from useParams can be undefined if the route is missing
  categoryName: string;
  onAddCategory: (categoryName: string) => void;
}

const AddCategoriesButton: React.FC<AddCategoriesButtonProps> = ({
  userId,
  categoryName,
  onAddCategory,
}) => {
  const handleClick = async () => {
    if (!userId) {
      alert("User ID is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/block-categories/${userId}/addCategory`,
        { categoryName }
      );
      console.log("Response from backend:", response.data);
      toast.success(`${categoryName} added successfully!`);

      onAddCategory(categoryName);
    } catch (error) {
      console.error("Error adding category", error);
      toast.error("Failed to add category!");
    }
  };

  return (
    <div>
      <button
        className="add-btn"
        onClick={handleClick}
        id={`add-btn-${categoryName}`}
      >
        Add
      </button>
    </div>
  );
};

export default AddCategoriesButton;
