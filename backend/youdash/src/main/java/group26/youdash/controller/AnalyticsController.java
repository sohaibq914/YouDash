package group26.youdash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

import group26.youdash.service.AnalyticsService;

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

}
