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

    def navigate_view_goals(self):
        driver = self.driver
        self.clickById("goalsView")

    def navigate_edit_goals(self):
        driver = self.driver
        self.clickById("goalsEdit")

    def navigate_vis_goals(self):
        driver = self.driver
        self.clickById("goalsVis")

    #AC 1
    def test_create_and_view_tod_goal(self):
        driver = self.driver
        self.navigate_view_goals()

        assert "testTOD" in driver.page_source
        assert "testTODDesc" in driver.page_source
        assert "11" in driver.page_source
        assert "1" in driver.page_source
        assert "12" in driver.page_source
        assert "23" in driver.page_source
        assert "59" in driver.page_source
        assert "Sports" in driver.page_source
        assert "ALL" in driver.page_source
        assert "2" in driver.page_source


    #AC 2 - test you can view progress as percentage
    def test_view_tod_progress(self):
        driver = self.driver
        self.navigate_view_goals()
        #good watch time
        assert "40.33" in driver.page_source
        #bad watch time
        assert "89.93333" in driver.page_source
        # progress as a percentage, good * multiplier / bad
        assert "89.696074" in driver.page_source


    #AC 3 - basic editing of all fields
    def test_edit_tod_goal(self):
        driver = self.driver
        self.navigate_edit_goals()
        time.sleep(1)
        fields = driver.find_elements(by=By.TAG_NAME, value="input")
        goalNameField = fields[0]
        assert goalNameField is not None
        goalNameField.send_keys("123")
        goalDescField = fields[1]
        assert goalDescField is not None
        goalDescField.send_keys("4567")

        #time to watch
        fields[2].send_keys(Keys.BACKSPACE)
        fields[2].send_keys("0")
        fields[3].send_keys(Keys.BACKSPACE)
        fields[3].send_keys("3")
        fields[4].send_keys(Keys.BACKSPACE)
        fields[4].send_keys("3")
        fields[5].send_keys(Keys.BACKSPACE)
        fields[5].send_keys("4")

        #time to avoid
        fields[6].send_keys(Keys.BACKSPACE)
        fields[6].send_keys("0")
        fields[7].send_keys(Keys.BACKSPACE)
        fields[7].send_keys("3")
        fields[8].send_keys(Keys.BACKSPACE)
        fields[8].send_keys("2")
        fields[9].send_keys(Keys.BACKSPACE)
        fields[9].send_keys("4")

        selects = driver.find_elements(by=By.TAG_NAME, value="select")
        avoid = Select(selects[0])
        avoid.select_by_value("Comedy")
        watch = Select(selects[1])
        watch.select_by_value("Gaming")

        #multiplier
        fields[10].send_keys(Keys.BACKSPACE)
        fields[10].send_keys("5")
        self.navigate_view_goals()
        time.sleep(5)

        assert "testTOD123" in driver.page_source
        assert "testTODDesc4567" in driver.page_source
        assert "10" in driver.page_source
        assert "3" in driver.page_source
        assert "13" in driver.page_source
        assert "24" in driver.page_source
        assert "54" in driver.page_source
        assert "22" in driver.page_source
        assert "0" in driver.page_source
        assert "Comedy" in driver.page_source
        assert "Gaming" in driver.page_source
        assert "5" in driver.page_source


    #AC 4 - checks that corresponding image is displayed
    def test_visualize_tod_goal(self):
        driver = self.driver
        self.navigate_vis_goals()
        time.sleep(1)
        assert "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACACAYAAAC7gW9qAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAJtSURBVHhe7Zo9TsQwFIQDR6DfCiHBAajp6KDmDhyBmiNwB2ro6Kg5AEiIip4rAF5NJG+0dpzEz3Ey80nWuGHRTuY9/2QPfv9piDmE0iIDoLTIACgtZqvA8dMVZvv5un7GbF5UAlBaZACUlmxN8Gdzgtku5w+nmO2iJlgJMgBKy2wGuJ7RjjlRAqC0LNoAv4z8MQQlAEoLvQGz3Qe83X5g1jRH35+YDSNU70M+z/xa3OpixH2ub6JPe/5I+Wz1ACgtyQa4yIXGktEqkNoEY0861mz6EjKlCfaxiCbYllHKF7IgiwGlvoTF/zFPwNiIl2KVTdCZnmp81QZMOeamssoEDIHegFGHob4u7NdfKLr7Xph067b7t6GXLF2GNF6VADSI34TaYYW/zudc62MoAVBaqjbANT1/WLC6BAxZARwqAWhWSnXwHNAnoHcnuG/dT2lIfi2WTET2HuBeMnTHmjA5CzgsEzD0KcdQD7BKgCVKQEaqTkDOJx2CPgEqgTElECJnaZSIv0MJqCkBoV98WO4+F5EAy3vIrAmIkZKOUAIcVinQMgilpYgBc58dYigB0CqwuvqOUWQVGFMC2gkWQgZAacnWA/q2q0MbnHpAIWQAtDpK7R6VACgtMgBKiwyA0lLtadChV2MFKGJAqX39GJQAKC0yAEqLDIDSQm9A8k7w5e4Gs2Vwef+IWRyVAJQWGQClRQZAaZEBUFroDZh0J1jT7jB159cliwGv799bnYOLs81WxxqgHgClRQZAaZEBUFpkAJQWGQClRQZAaZEBUFpkAJQW+hshJWBKAtaAmiCUFhkApUUGQGmRAVBSmuYPkqMFYLmaKYoAAAAASUVORK5CYII=" in driver.page_source

    #AC 5 - "regresses" by shifting time frame to not include certain videos
    def test_different_time_frames(self):
        driver = self.driver
        self.navigate_view_goals()
        time.sleep(1)
        assert "40.33" in driver.page_source
        #bad watch time
        assert "89.93333" in driver.page_source
        # progress as a percentage, good * multiplier / bad
        assert "89.696074" in driver.page_source

        self.navigate_edit_goals()
        time.sleep(1)
        fields = driver.find_elements(by=By.TAG_NAME, value="input")
        fields[8].send_keys(Keys.BACKSPACE)
        fields[8].send_keys(Keys.BACKSPACE)
        fields[8].send_keys("13")
        self.navigate_view_goals()
        time.sleep(1)
        assert "40.33" in driver.page_source
        #bad watch time
        assert "40.68" in driver.page_source
        # progress as a percentage, good * multiplier / bad
        assert "198.27939" in driver.page_source





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