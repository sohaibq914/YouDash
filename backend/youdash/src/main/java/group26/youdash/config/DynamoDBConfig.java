package group26.youdash.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for setting up the DynamoDB client and mapper.
 * This class is responsible for creating the necessary beans to
 * interact with Amazon DynamoDB.
 *
 * Author: Abdul Wajid Arikattayil
 */
@Configuration
public class DynamoDBConfig {

    /**
     * Creates a DynamoDBMapper bean to perform operations on DynamoDB.
     *
     * @return A configured instance of DynamoDBMapper.
     */
    @Bean
    public DynamoDBMapper dynamoDBMapper() {
        return new DynamoDBMapper(buildAmazonDynamoDB());
    }

    /**
     * Builds and configures the AmazonDynamoDB client with the
     * specified endpoint and credentials.
     *
     * @return A configured instance of AmazonDynamoDB.
     */
    private AmazonDynamoDB buildAmazonDynamoDB() {
        return AmazonDynamoDBClientBuilder
            .standard()
            .withEndpointConfiguration(
                new AwsClientBuilder.EndpointConfiguration(
                    "dynamodb.us-east-2.amazonaws.com",
                    "us-east-2"
                )
            )
            .withCredentials(
                new AWSStaticCredentialsProvider(
                    new BasicAWSCredentials(
                        "AKIAQ3EGVY3J2O7RDDWL",
                        "wLlTwv3FHs3r4yf9BpLsCyGL+IsrA5dyLeOKeaX7"
                    )
                )
            )
            .build();
    }
}
