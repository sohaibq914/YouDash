import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class OpenAITests(unittest.TestCase):
    # Initialization of webdriver
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

    def writeInput(self, id, input):
        driver = self.driver

        #scroll to btn
        inputElem = driver.find_element(by=By.ID, value=id)
        driver.execute_script("arguments[0].scrollIntoView(true);", inputElem)
        time.sleep(0.5)

        inputElem.send_keys(input)
        time.sleep(0.5)

    def clickById(self, id):
        driver = self.driver

        #scroll to btn
        button = driver.find_element(by=By.ID, value=id)
        driver.execute_script("arguments[0].scrollIntoView(true);", button)
        time.sleep(0.5)

        #click btn
        button.click()
        time.sleep(0.5)


    def test_ai_recommendations_updated_on_multiple_requests(self):
        driver = self.driver

        # Step 1: Click the "Get AI Recommendations" button initially
        self.clickById("AI-recommendations")

        # Capture the initial recommendations text
        ai_recommendations_text_initial = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//p[contains(text(), 'recommendations')]"))
        )
        initial_text = ai_recommendations_text_initial.text

        # Step 2: Wait and click again for updated recommendations
        time.sleep(2)  # Small delay to prevent overlapping requests
        self.clickById("AI-recommendations")

        # Step 3: Use a loop to wait until the text updates or the timeout limit is reached
        updated_text = initial_text
        timeout = time.time() + 10  # Set a 10-second limit for the update
        while updated_text == initial_text and time.time() < timeout:
            try:
                updated_text_element = WebDriverWait(driver, 2).until(
                    EC.visibility_of_element_located((By.XPATH, "//p[contains(text(), 'recommendations')]"))
                )
                updated_text = updated_text_element.text
            except TimeoutException:
                continue

        # Step 4: Assert that the updated recommendations differ from the initial recommendations
        self.assertNotEqual(initial_text, updated_text, "AI Recommendations did not update on re-request.")
        print("AI Recommendations updated successfully on second request.")



    def test_prompt_history(self):
        driver = self.driver

        self.clickById("prompt-history")

        # Wait until the prompt history list appears
        prompt_history_list = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//ul"))
        )

        # Find the list items within the prompt history list
        prompt_history_items = driver.find_elements(By.XPATH, "//ul/li")
        num_prompts = len(prompt_history_items)

         # Output for verification
        if num_prompts >= 3:
            print(f"Test passed. {num_prompts} prompts found in history.")
        else:
            print(f"Test failed. Only {num_prompts} prompts found.")


    def tearDown(self):
        self.driver.quit()

# Execute the script
if __name__ == "__main__":
    unittest.main()
