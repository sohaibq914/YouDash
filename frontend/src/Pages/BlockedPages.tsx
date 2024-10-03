import React, { useState } from "react";
import "./BlockedPages.css";
import AddCategoriesButton from "../Components/AddCategoriesButton.tsx";
import { DeleteCategoriesButton } from "../Components/DeleteCategoriesButton.tsx";

const BlockedPages = () => {
  const categories = [
    "Gaming",
    "Sports",
    "Entertainment",
    "Music",
    "Vlogs",
    "Comedy",
  ];

  // track available categories to block
  const [availableCategories, setAvailableCategories] = useState([
    "Gaming",
    "Sports",
    "Entertainment",
    "Music",
    "Vlogs",
    "Comedy",
  ]);

  // tracks blocked categories
  const [blockedCategories, setBlockedCategories] = useState<string[]>([]);
  

  // gets user input from the input field
  const [inputValue, setInputValue] = useState("");
  // will hold filtered options depending on what user inputs
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  const handleAddCategory = (categoryName: string) => {
    //will remove from available categories
    const updatedAvailableCategories = availableCategories.filter(
      (category) => category != categoryName
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
      (blockedCategory) => blockedCategory != categoryName
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
      <div className="CategoryBlockTitle">
        <h1>Category Block</h1>
      </div>

      <div className="CurrentlyBlockedTitle">
        <h1>Currently Blocked</h1>
      </div>

      {/*// main screen container for Blocked Page */}
      <div className="container">
        {/* rectangle container for Currently Blocked */}
        <div className="CurrentlyBlockedCategoriesContainer">
          <div className="CategoriesRectangleTitle">
            <h2>Categories</h2>
          </div>

          <ul className="category-list">
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

        {/* a rectangle container for Blocking Categories */}
        <div className="AddCategoriesContainer">
          {/* Header for container(Category and Search function)*/}
          <div className="AddCategoriesContainerHeader">
            <h1>Categories</h1>
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
                onChange={handleInputChange}
              />
            </div>
          </div>

          <ul className="category-list">
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
      {/* // end of main screen container */}
    </div> //end header for currently blocked and category block
  );
};

export default BlockedPages;
