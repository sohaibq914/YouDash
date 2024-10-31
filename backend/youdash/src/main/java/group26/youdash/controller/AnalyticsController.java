package group26.youdash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

import group26.youdash.service.AnalyticsService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;
import java.util.HashMap;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "chrome-extension://pcfljeghhkdmleihaobbdhkphdonijdm"
})
public class AnalyticsController {

    @Autowired
    private AnalyticsService as;



    @GetMapping("/{userId}/watch-time-by-hour")
    public Map<String, Float> getWatchTimeByHour(
        @PathVariable int userId,
        @RequestParam(value = "category", required = false) String category) {
    return as.getAggregatedWatchTimeByHour(userId, category);
}
    @GetMapping("/{userId}/watch-time-by-hour-custom")
    public Map<Integer, Float> getWatchTimeByHourCustom(
            @PathVariable int userId,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "timeFrame", required = true) int timeFrame,
            @RequestParam(value = "timeFrameSelection", required = true) int timeFrameSelection) {

        LocalDateTime st = LocalDateTime.now();
        LocalDateTime en = LocalDateTime.now();
        if (timeFrame == 0) { //day
            st = st.minusDays(timeFrameSelection);
            en = en.minusDays(timeFrameSelection-1);
        } else if (timeFrame == 1) { //week
            st = st.minusWeeks(timeFrameSelection);
            en = en.minusWeeks(timeFrameSelection-1);
        } else if (timeFrame == 2) {//month
            st = st.minusMonths(timeFrameSelection);
            en = en.minusMonths(timeFrameSelection-1);
        }
        return as.getAggregatedWatchTimeByHourCustom(userId, category, st, en);
    }

}
