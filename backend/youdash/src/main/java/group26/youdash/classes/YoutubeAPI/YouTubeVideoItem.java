package group26.youdash.classes.YoutubeAPI;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class YouTubeVideoItem {
    private String kind;
    private String etag;
    private String id;
    private YouTubeSnippet snippet;

    private YouTubeContentDetails contentDetails;



    // Getters and Setters

    public YouTubeContentDetails getContentDetails() { return contentDetails;}

    public void setContentDetails(YouTubeContentDetails contentDetails) {
        this.contentDetails = contentDetails;
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public String getEtag() {
        return etag;
    }

    public void setEtag(String etag) {
        this.etag = etag;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public YouTubeSnippet getSnippet() {
        return snippet;
    }

    public void setSnippet(YouTubeSnippet snippet) {
        this.snippet = snippet;
    }
}

