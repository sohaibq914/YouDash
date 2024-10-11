package group26.youdash.service;


import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import com.amazonaws.services.simpleemail.model.*;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class EmailService {


   private final AmazonSimpleEmailService sesClient;


   public EmailService(@Value("${aws.access-key}") String accessKey,
                       @Value("${aws.secret-key}") String secretKey,
                       @Value("${aws.region}") String region) {
       BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
       this.sesClient = AmazonSimpleEmailServiceClientBuilder.standard()
               .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
               .withRegion(region)
               .build();
   }


   public void sendEmail(String to, String subject, String body) {
       SendEmailRequest request = new SendEmailRequest()
               .withDestination(new Destination().withToAddresses(to))
               .withMessage(new Message()
                       .withBody(new Body()
                               .withHtml(new Content().withData(body)))
                       .withSubject(new Content().withData(subject)))
               .withSource("aarikatt@purdue.edu"); // Replace with your verified email


       sesClient.sendEmail(request);
   }
}

