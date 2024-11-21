import React, { useState, useEffect } from "react";
import "./BlockedPages.css";
import AddCategoriesButton from "../Components/AddCategoriesButton.tsx";
import { DeleteCategoriesButton } from "../Components/DeleteCategoriesButton.tsx";

import axios from "axios";

const BlockedPages = () => {
  // track available categories to block
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // tracks blocked categories
  const [blockedCategories, setBlockedCategories] = useState<string[]>([]);

  // gets user input from the input field
  const [inputValue, setInputValue] = useState("");
  // will hold filtered options depending on what user inputs
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  // fetch data from backend when the component mounts
  useEffect(() => {
    const userID = 12345;

    // Fetch available categories
    const fetchAvailableCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/block-categories/${userID}/availableCategories`
        );
        console.log("Available Categories Response:", response.data);
        setAvailableCategories(response.data.availableCategories);
      } catch (error) {
        console.error("Error fetching available categories", error);
      }
    };

    // Fetch currently blocked categories
    const fetchBlockedCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/block-categories/${userID}/blockedCategories`
        );
        console.log("Blocked Categories Response:", response.data); // Log response
        setBlockedCategories(response.data.blockedCategories);
      } catch (error) {
        console.log("Error fetching blocked categories", error);
      }
    };

    fetchAvailableCategories();
    fetchBlockedCategories();
  }, []);

  const handleAddCategory = (categoryName: string) => {
    //will remove from available categories
    const updatedAvailableCategories = availableCategories.filter(
      (category) => category !== categoryName
    );

    // creates new blocked categories array with what is already inside and adds categoryName into that array.
    setBlockedCategories([...blockedCategories, categoryName]);

    //update available categories
    setAvailableCategories(updatedAvailableCategories);
    setFilteredOptions(updatedAvailableCategories);

    //clear the input after it has been added
    setInputValue("");
  };

  const handleDeleteCategory = (categoryName: string) => {
    // remove from blocked categories
    const updatedDeletedCategories = blockedCategories.filter(
      (blockedCategory) => blockedCategory !== categoryName
    );

    // add deleted category back into the available ones
    setAvailableCategories([...availableCategories, categoryName]);

    // update deleted categories
    setBlockedCategories(updatedDeletedCategories);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    //Filter options
    const filtered = availableCategories.filter((option) =>
      option.toLowerCase().startsWith(value.toLowerCase())
    );

    //show all the options that match the input
    setFilteredOptions(filtered);
  };

  return (
    //header for currently blocked and category block
    <div>
    {/* main screen container for Blocked Page */}
    <div className="container">
      {/* rectangle container for Currently Blocked */}
      <div className="CurrentlyBlockedCategoriesContainer">
        <h1>Currently Blocked</h1>
        <div className="CategoriesRectangleTitle">
          <h2>Categories</h2>
        </div>
  
        <div className="scroll-container">
          <ul className="category-list" id="blockedCategories-list">
            {blockedCategories.map((category, index) => (
              <li className="category-item" key={index}>
                <span>{category}</span>
                <DeleteCategoriesButton
                  categoryName={category}
                  onDeleteCategory={handleDeleteCategory}
                />
              </li>
            ))}
          </ul>
        </div>
        <br/>
      </div>
  
      {/* a rectangle container for Blocking Categories */}
      <div className="AddCategoriesContainer">
        <h1>Available Categories</h1>
        {/* Header for container(Category and Search function)*/}
        <div className="AddCategoriesContainerHeader">
          <h2>Search:</h2>
  
          <div
            className="input-group flex-nowrap"
            style={{ paddingLeft: "10px" }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search Category"
              aria-label="Category"
              value={inputValue}
              id="addCategoryInput"
              onChange={handleInputChange}
              style={{width: "100%"}}
            />
          </div>
        </div>
  
        <div className="scroll-container">
          <ul className="category-list" id="availableCategories-list">
            {(inputValue ? filteredOptions : availableCategories).map(
              (category, index) => (
                <li className="category-item" key={index}>
                  <span>{category}</span>
                  <AddCategoriesButton
                    categoryName={category}
                    onAddCategory={handleAddCategory}
                  />
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>

  </div>
  
  );
};

export default BlockedPages;
