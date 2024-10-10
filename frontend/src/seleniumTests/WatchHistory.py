import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException  # Make sure to import this

class WatchHistoryTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:3000/watch-history")

    def test_fetch_watch_history(self):
        driver = self.driver
        # Wait for the alert to appear and accept it
        try:
            WebDriverWait(driver, 10).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            alert_text = alert.text
            alert.accept()  # Accept the alert to proceed
        except TimeoutException:
            print("No alert appeared.")

        try:
            WebDriverWait(driver, 10).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            alert_text = alert.text
            alert.accept()  # Accept the alert to proceed
        except TimeoutException:
            print("No alert appeared.")

        # Simulate page load and fetching blocked categories
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "watchHistory-list"))  # Adjust to actual element ID
        )

        # Check that specific categories appear in the blocked categories list
        watch_history = driver.find_element(By.ID, "watchHistory-list")
        assert watch_history.text.strip() != "", "Watch History list is empty"

    def tearDown(self):
        self.driver.close()


# Execute the script
if __name__ == "__main__":
    unittest.main()
