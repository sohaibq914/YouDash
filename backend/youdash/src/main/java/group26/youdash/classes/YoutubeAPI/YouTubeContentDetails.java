package group26.youdash.classes.YoutubeAPI;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class YouTubeContentDetails {

    private String duration;

    private String dimension;

    private String definition;

    private String caption;

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public void setDimension(String dimension) {
        this.dimension = dimension;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getDuration() {
        return duration;
    }

    public String getDimension() {
        return dimension;
    }

    public String getDefinition() {
        return definition;
    }

    public String getCaption() {
        return caption;
    }
}
