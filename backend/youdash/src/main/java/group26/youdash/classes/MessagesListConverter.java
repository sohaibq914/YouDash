package group26.youdash.classes;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

public class MessagesListConverter implements DynamoDBTypeConverter<String, List<Messages>> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convert(List<Messages> messagesList) {
        try {
            return objectMapper.writeValueAsString(messagesList);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "[]"; // Return an empty JSON array if serialization fails
        }
    }

    @Override
    public List<Messages> unconvert(String jsonString) {
        try {
            return objectMapper.readValue(jsonString, objectMapper.getTypeFactory().constructCollectionType(List.class, Messages.class));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ArrayList<>(); // Return an empty list if deserialization fails
        }
    }
}
