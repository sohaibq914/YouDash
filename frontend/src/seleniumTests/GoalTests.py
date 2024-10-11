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
        self.driver.get("http://localhost:3000/")
        self.create_goal()
        #set up goals

    def navigate_to_goal_create(self):
        driver = self.driver
        driver.execute_script("window.scrollTo(0, 0)")
        time.sleep(0.5)
        createDropdown = driver.find_element(by=By.ID, value="goalsCreate")
        assert createDropdown is not None
        createDropdown.click()

    def create_goal(self):
        driver = self.driver
        self.navigate_to_goal_create()
        action = ActionChains(driver)
        #create watchtime goal
        goalNameInput = driver.find_element(by=By.ID, value="goalName")
        assert goalNameInput is not None
        goalNameInput.send_keys("testing goal name")

        goalDescInput = driver.find_element(by=By.ID, value="goalDescription")
        assert goalDescInput is not None
        goalDescInput.send_keys("testing goal description")

        goalHoursInput = driver.find_element(by=By.ID, value="hoursInput")
        assert goalHoursInput is not None
        goalHoursInput.send_keys("10")

        goalMinutesInput = driver.find_element(by=By.ID, value="minutesInput")
        assert goalMinutesInput is not None
        goalMinutesInput.send_keys("13")

        goalAimBelowBtn = driver.find_element(by=By.ID, value="aimBelowGoal")
        assert goalAimBelowBtn is not None
        goalAimBelowBtn.click()

        goalCategorySelect = Select(driver.find_element(by=By.ID, value="category"))
        assert goalCategorySelect is not None
        goalCategorySelect.select_by_value("Entertainment")
        goalSubmit = driver.find_element(by=By.ID, value="goalSubmit")
        assert goalSubmit is not None
        driver.execute_script("window.scrollTo(0, 200)")
        time.sleep(0.5)
        goalSubmit.click()

        #create quality goal
        driver.execute_script("window.scrollTo(0, 0)")
        time.sleep(0.5)
        qgoalBtn = driver.find_element(by=By.ID, value="qGoalsBtn")
        assert qgoalBtn is not None
        qgoalBtn.click()
        time.sleep(0.5)

        goalNameInputQ = driver.find_element(by=By.ID, value="goalNameQ")
        assert goalNameInputQ is not None
        goalNameInputQ.send_keys("testing goal name q")

        goalDescInputQ = driver.find_element(by=By.ID, value="goalDescriptionQ")
        assert goalDescInputQ is not None
        goalDescInputQ.send_keys("testing goal description q")

        categoryToWatch = Select(driver.find_element(by=By.ID, value="categoryToWatch"))
        assert categoryToWatch is not None
        categoryToWatch.select_by_value("ALL")

        categoryToAvoid = Select(driver.find_element(by=By.ID, value="categoryToAvoid"))
        assert categoryToAvoid is not None
        categoryToAvoid.select_by_value("Sports")

        goalMultInput = driver.find_element(by=By.ID, value="multiplier")
        assert goalMultInput is not None
        goalMultInput.send_keys(Keys.BACKSPACE)
        goalMultInput.send_keys("10")

        goalSubmitQ = driver.find_element(by=By.ID, value="goalSubmitQ")
        assert goalSubmitQ is not None
        driver.execute_script("window.scrollTo(0, 200)")
        time.sleep(0.5)
        goalSubmitQ.click()


    def navigate_to_goal_view(self):
        driver = self.driver
        driver.execute_script("window.scrollTo(0, 0)")
        time.sleep(0.5)
        viewDropdown = driver.find_element(by=By.ID, value="goalsView")
        assert viewDropdown is not None
        viewDropdown.click()
        time.sleep(8)

    def navigate_to_goal_edit(self):
        driver = self.driver
        driver.execute_script("window.scrollTo(0, 0)")
        time.sleep(0.5)
        editDropdown = driver.find_element(by=By.ID, value="goalsEdit")
        assert editDropdown is not None
        editDropdown.click()
        time.sleep(8)

    def navigate_to_goal_vis(self):
        driver = self.driver
        driver.execute_script("window.scrollTo(0, 0)")
        time.sleep(0.5)
        editDropdown = driver.find_element(by=By.ID, value="goalsVis")
        assert editDropdown is not None
        editDropdown.click()
        time.sleep(8)


    # Test case method. It should always start with test_
    def test_create_and_view_goal(self):

        # get driver
        driver = self.driver
        # get python.org using selenium
        self.navigate_to_goal_view()
        time.sleep(2)
        assert "testing goal name" in driver.page_source
        assert "testing goal description" in driver.page_source
        assert "613" in driver.page_source
        assert "Below" in driver.page_source
        assert "Entertainment" in driver.page_source

        assert "testing goal name q" in driver.page_source
        assert "testing goal description q" in driver.page_source
        assert "10" in driver.page_source
        assert "Sports" in driver.page_source
        assert "ALL" in driver.page_source

        time.sleep(1)

    def test_create_and_vis_goal(self):

        # get driver
        driver = self.driver
        # get python.org using selenium
        self.navigate_to_goal_vis()
        time.sleep(1)
        assert "Goal #1: testing goal name" in driver.page_source
        assert "Goal Progress: " in driver.page_source

        time.sleep(1)

    def test_edit_goal(self):
        driver = self.driver
        action = ActionChains(driver)
        self.navigate_to_goal_edit()
        time.sleep(2.5)
        fields = driver.find_elements(by=By.TAG_NAME, value="input")
        goalNameField = fields[0]
        assert goalNameField is not None
        goalNameField.send_keys("123")
        goalDescField = fields[1]
        assert goalDescField is not None
        goalDescField.send_keys("4567")
        goalCategoryField = Select(driver.find_element(by=By.TAG_NAME, value="select"))
        assert goalCategoryField is not None
        goalCategoryField.select_by_value("ALL")
        goalWatchTime = fields[2]
        assert goalWatchTime is not None
        goalWatchTime.send_keys(Keys.BACKSPACE)
        goalAimAboveBtn = driver.find_elements(by=By.TAG_NAME, value="button")[1]
        assert goalAimAboveBtn is not None
        action.move_to_element(goalAimAboveBtn).click()
        self.navigate_to_goal_view()
        time.sleep(2)
        assert "testing goal name123" in driver.page_source
        assert "testing goal description4567" in driver.page_source
        assert "61" in driver.page_source
        assert "Above" in driver.page_source
        assert "ALL" in driver.page_source
        self.navigate_to_goal_edit()
        time.sleep(2)
        deleteBtn = driver.find_element(by=By.CLASS_NAME, value="deleteBtn")
        deleteBtn.click()
        time.sleep(0.5)
        fields = driver.find_elements(by=By.TAG_NAME, value="input")
        time.sleep(2)
        goalNameFieldQ = fields[0]
        assert goalNameFieldQ is not None
        goalNameFieldQ.send_keys("123")
        goalDescFieldQ = fields[1]
        assert goalDescFieldQ is not None
        goalDescFieldQ.send_keys("4567")
        goalCategoryFieldQ = Select(driver.find_element(by=By.TAG_NAME, value="select"))
        assert goalCategoryFieldQ is not None
        goalCategoryFieldQ.select_by_value("Entertainment")
        mult = fields[2]
        assert mult is not None
        mult.send_keys(Keys.BACKSPACE)
        self.navigate_to_goal_view()
        time.sleep(1)
        assert "testing goal name q123" in driver.page_source
        assert "testing goal description q4567" in driver.page_source
        assert "1" in driver.page_source
        assert "Entertainment" in driver.page_source
        assert "ALL" in driver.page_source


    def create_dup_goal(self):
        driver = self.driver
        self.navigate_to_goal_create()
        time.sleep(1)
        action = ActionChains(driver)
        #create watchtime goal
        goalNameInput = driver.find_element(by=By.ID, value="goalName")
        assert goalNameInput is not None
        goalNameInput.send_keys("testing goal name")

        goalDescInput = driver.find_element(by=By.ID, value="goalDescription")
        assert goalDescInput is not None
        goalDescInput.send_keys("testing goal description")

        goalHoursInput = driver.find_element(by=By.ID, value="hoursInput")
        assert goalHoursInput is not None
        goalHoursInput.send_keys("10")

        goalMinutesInput = driver.find_element(by=By.ID, value="minutesInput")
        assert goalMinutesInput is not None
        goalMinutesInput.send_keys("13")

        goalAimBelowBtn = driver.find_element(by=By.ID, value="aimBelowGoal")
        assert goalAimBelowBtn is not None
        goalAimBelowBtn.click()

        goalCategorySelect = Select(driver.find_element(by=By.ID, value="category"))
        assert goalCategorySelect is not None
        goalCategorySelect.select_by_value("Entertainment")
        goalSubmit = driver.find_element(by=By.ID, value="goalSubmit")
        assert goalSubmit is not None
        driver.execute_script("window.scrollTo(0, 200)")
        time.sleep(0.5)
        goalSubmit.click()

    def test_no_duplicate_goals(self):
        driver = self.driver
        print("Test No Dup")
        self.navigate_to_goal_view()
        self.navigate_to_goal_create()
        time.sleep(1)
        print("creating goal")
        self.create_dup_goal()
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        assert alert.text == "No duplicate goals!"
        alert.accept()
        time.sleep(1)


    def delete_goals(self):
        driver = self.driver
        self.navigate_to_goal_edit()
        time.sleep(2)
        deleteBtn = driver.find_element(by=By.CLASS_NAME, value="deleteBtn")
        while deleteBtn is not None:
            deleteBtn.click()
            time.sleep(8)
            try:
                deleteBtn = driver.find_element(by=By.CLASS_NAME, value="deleteBtn")
            except:
                break
        time.sleep(2)


    # cleanup method called after every test performed
    def tearDown(self):
        self.delete_goals()
        self.driver.close()
        #delete goals?

# execute the script
if __name__ == "__main__":
    unittest.main()