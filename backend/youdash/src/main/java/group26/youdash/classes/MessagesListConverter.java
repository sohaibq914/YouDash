package group26.youdash.classes;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;

public class MessagesListConverter implements DynamoDBTypeConverter<String, List<Messages>> {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convert(List<Messages> messages) {
        try {
            return mapper.writeValueAsString(messages);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting messages to JSON", e);
        }
    }

    @Override
    public List<Messages> unconvert(String json) {
        try {
            return Arrays.asList(mapper.readValue(json, Messages[].class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting JSON to messages", e);
        }
    }
}
