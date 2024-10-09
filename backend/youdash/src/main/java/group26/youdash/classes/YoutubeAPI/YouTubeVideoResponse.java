package group26.youdash.classes.YoutubeAPI;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class YouTubeVideoResponse {
    private String kind;
    private String etag;
    private List<YouTubeVideoItem> items;

    // Getters and Setters
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

    public List<YouTubeVideoItem> getItems() {
        return items;
    }

    public void setItems(List<YouTubeVideoItem> items) {
        this.items = items;
    }
}
