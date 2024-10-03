package group26.youdash.classes;

public class Category {

    private String categoryName;
    public Category() {
    }


    public Category(String categoryName) {
        this.categoryName=categoryName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String name) {
        this.categoryName = name;
    }
    
}
