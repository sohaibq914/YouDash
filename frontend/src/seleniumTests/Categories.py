import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class BlockedCategoriesTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:3000/block-categories")

    def test_fetch_blocked_categories(self):
        driver = self.driver

        # Simulate page load and fetching blocked categories
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "blockedCategories-list"))  # Adjust to actual element ID
        )

        # Check that specific categories appear in the blocked categories list
        blocked_categories = driver.find_element(By.ID, "blockedCategories-list")
        
        # Assert that the list is not empty
        assert blocked_categories.text.strip() != "", "Blocked categories list is empty"


    def test_add_category(self):
        driver = self.driver

        # Wait until the input for adding a new category is present on the page
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "addCategoryInput"))
        )

        # Find the input and add a category
        add_category_input = driver.find_element(By.ID, "addCategoryInput")
        add_category_input.send_keys("Comedy")

        add_category_button = driver.find_element(By.ID, "add-btn-Comedy")
        add_category_button.click()

        # Wait for the alert to appear and accept it
        try:
            WebDriverWait(driver, 10).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            alert_text = alert.text
            alert.accept()  # Accept the alert to proceed
        except TimeoutException:
            print("No alert appeared.")

        # Now wait for the blocked categories list to update
        WebDriverWait(driver, 10).until(
            EC.text_to_be_present_in_element((By.ID, "blockedCategories-list"), "Comedy")
        )

        # Assert that the "Comedy" category was added
        blocked_categories = driver.find_element(By.ID, "blockedCategories-list")
        assert "Comedy" in blocked_categories.text, "Category not added to list!"


    def test_remove_blocked_category(self):
        driver = self.driver
        
        # Assuming the category "Music" was already added in the previous test case
        blockedCategoriesList = driver.find_element(by=By.ID, value="blockedCategories-list")
        assert blockedCategoriesList is not None

        # Wait until the delete button for the "Music" category is present
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "delete-btn-Music"))
        )

        # Remove the "Music" category (assuming there's a remove button next to each blocked category)
        removeButton = driver.find_element(by=By.ID, value="delete-btn-Music")  # Adjust the ID accordingly
        assert removeButton is not None
        removeButton.click()

        # Handle the first alert (confirmation)
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        assert alert.text == "Are you sure you want to delete the category: Music"
        alert.accept()  # Confirm the deletion by accepting the alert

        # Handle the second alert (success message)
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        successAlert = driver.switch_to.alert
        assert successAlert.text == "Music deleted successfully!"
        successAlert.accept()  # Dismiss the success alert

        # Now wait for the blocked categories list to update
        WebDriverWait(driver, 10).until(
            EC.text_to_be_present_in_element((By.ID, "availableCategories-list"), "Music")
        )

        available_categories = driver.find_element(By.ID, "availableCategories-list")
        assert "Music" in available_categories.text, "Category not added to available list!"




    def tearDown(self):
        self.driver.close()

# Execute the script
if __name__ == "__main__":
    unittest.main()
