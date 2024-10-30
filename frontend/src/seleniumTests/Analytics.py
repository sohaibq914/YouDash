import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

class AnalyticsTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:3000/login")
        self.login()
    
    def login(self):
        driver = self.driver
        self.writeInput("loginUsername", "aarikatt1")
        self.writeInput("loginPassword", "aarikatt1")
        self.clickById("loginBtn")
        time.sleep(0.5)
        # Wait for redirect to the analytics page after login

    def writeInput(self, id, input):
        driver = self.driver

        # Scroll to the input
        inputElem = driver.find_element(by=By.ID, value=id)
        driver.execute_script("arguments[0].scrollIntoView(true);", inputElem)
        time.sleep(0.5)

        inputElem.send_keys(input)
        time.sleep(0.5)

    def clickById(self, id):
        driver = self.driver

        # Scroll to the button
        button = driver.find_element(by=By.ID, value=id)
        driver.execute_script("arguments[0].scrollIntoView(true);", button)
        time.sleep(0.5)

        # Click the button
        button.click()
        time.sleep(0.5)

    def test_youtube_analytics_displayed(self):
        driver = self.driver

        self.clickById("analytics-button")
        time.sleep(2)

        # Step 1: Ensure the page has the chart container for analytics
        try:
            chart_container = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "watch-time-chart-container"))
            )
            self.assertTrue(chart_container.is_displayed(), "Analytics chart container is not visible.")
            print("Analytics chart container displayed successfully.")

            # Step 2: Confirm that the chart itself is present within the container
            line_chart = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "recharts-wrapper"))
            )
            self.assertTrue(line_chart.is_displayed(), "Line chart is not displayed.")
            print("YouTube analytics line chart displayed successfully.")
        
        except TimeoutException:
            print("Line chart failed to load within the timeout period.")
            self.fail("YouTube analytics line chart was not displayed.")
    
    def tearDown(self):
        self.driver.quit()

# Ensure this line is outside the class definition
if __name__ == "__main__":
    unittest.main()
