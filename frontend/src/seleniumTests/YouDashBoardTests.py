import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

# inherit TestCase Class and create a new test class
class GoalTests(unittest.TestCase):

    # initialization of webdriver
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:3000/login")
        self.logIn()
        self.navigate_create_tod_goal()
        #self.create_goal()
        #set up goals

    def clickById(self, id):
        driver = self.driver

        #scroll to btn
        button = driver.find_element(by=By.ID, value=id)
        driver.execute_script("arguments[0].scrollIntoView(true);", button)
        time.sleep(0.5)

        #click btn
        button.click()
        time.sleep(0.5)

    def clickByClassName(self, className):
        driver = self.driver

        #scroll to btn
        button = driver.find_element(by=By.CLASS_NAME, value=className)
        driver.execute_script("arguments[0].scrollIntoView(true);", button)
        time.sleep(0.5)

        #click btn
        button.click()
        time.sleep(0.5)

    def writeInput(self, id, input):
        driver = self.driver

        #scroll to btn
        inputElem = driver.find_element(by=By.ID, value=id)
        driver.execute_script("arguments[0].scrollIntoView(true);", inputElem)
        time.sleep(0.5)

        inputElem.send_keys(input)
        time.sleep(0.5)

    def selectInput(self, id, input):
        driver = self.driver

        #scroll to btn
        inputElem = Select(driver.find_element(by=By.ID, value=id))
        #driver.execute_script("arguments[0].scrollIntoView(true);", inputElem)
        time.sleep(0.5)

        inputElem.select_by_value(input)
        time.sleep(0.5)

    def logIn(self):
        driver = self.driver
        self.writeInput("loginUsername", "testing")
        self.writeInput("loginPassword", "testing")
        self.clickById("loginBtn")
        time.sleep(0.5)

    def navigate_create_tod_goal(self):
        driver = self.driver
        self.clickById("goalsCreate")
        self.clickById("todGoalsBtn")
        time.sleep(2)
        self.writeInput("goalNameTOD", "testTOD")
        self.writeInput("goalDescriptionTOD", "testTODDesc")
        self.writeInput("startWatchHour", "11")
        self.writeInput("startWatchMinute", "1")
        self.writeInput("endWatchHour", "12")
        self.writeInput("endWatchMinute", "23")
        self.writeInput("startAvoidHour", "1")
        self.writeInput("startAvoidMinute", "1")
        self.writeInput("endAvoidHour", "23")
        self.writeInput("endAvoidMinute", "59")
        self.selectInput("categoryWatch", "Sports")
        self.selectInput("categoryAvoid", "ALL")
        self.writeInput("multiplierTOD", 2)
        self.clickById("goalSubmitTOD")

    def navigate_youdashboard(self):
        driver = self.driver
        self.clickById("youDashBoard")
        time.sleep(1)


    def navigate_edit_goals(self):
        driver = self.driver
        self.clickById("goalsEdit")

    #AC 1
    def test_view_pie_chart(self):
        driver = self.driver
        self.navigate_youdashboard()
        time.sleep(1)

        assert not "pie NaN" in driver.page_source
        assert "PieChart" in driver.page_source
        assert "pie 0.89696074" in driver.page_source

    #AC 2
    def test_progress_changes(self):
        driver = self.driver
        self.navigate_youdashboard()
        time.sleep(1)

        assert "pie 0.89696074" in driver.page_source
        self.navigate_edit_goals()

        fields = driver.find_elements(by=By.TAG_NAME, value="input")
        fields[8].send_keys(Keys.BACKSPACE)
        fields[8].send_keys(Keys.BACKSPACE)
        fields[8].send_keys("13")
        self.navigate_youdashboard()
        time.sleep(1)
        assert "pie 1" in driver.page_source

    #AC 3
    #Test Case 1001
    #System: YouDash
    #Test Confetti
    #Severity: 3
    #Instructions:
    # - Log in with the credentials "testing", "testing" for password/username at http://localhost:3000/login
    # - Navigate to Create Goal on the navigation bar
    # - Create a Time of Day goal with name "testing" and watch time from 11:00 to 12:00, and avoid time from 1:01 to 13:59 and multiplier 2
    # - Navigate to YouDashBoard on the navigation bar
    #Expected Result: Confetti should be coming down from the top of the page and the pie chart should be at 100% progress




    def delete_goals(self):
        driver = self.driver
        self.navigate_edit_goals()
        time.sleep(2)
        while len(driver.find_elements(by=By.CLASS_NAME, value="deleteBtn")) != 0:
            self.clickByClassName("deleteBtn")
            time.sleep(1)


    # cleanup method called after every test performed
    def tearDown(self):
        self.delete_goals()
        self.driver.close()
        #delete goals?

# execute the script
if __name__ == "__main__":
    unittest.main()



