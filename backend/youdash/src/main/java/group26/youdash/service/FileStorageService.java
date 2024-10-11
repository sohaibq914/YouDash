package group26.youdash.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.UUID;

@Service
public class FileStorageService {

    private AmazonS3 s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.access-key}")
    private String accessKey;

    @Value("${aws.secret-key}")
    private String secretKey;

    @Value("${aws.region}")
    private String region;

    @PostConstruct
    private void initializeAmazon() {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
        this.s3Client = AmazonS3ClientBuilder.standard()
                .withRegion(Regions.fromName(region))
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .build();
    }

    // Upload a file to S3 with a specific key
    public String uploadFile(MultipartFile file, String fileName) throws IOException {
        File convertedFile = convertMultiPartToFile(file);
        
        // Upload file to S3 with the specified key
        try {
            s3Client.putObject(new PutObjectRequest(bucketName, fileName, convertedFile));
            convertedFile.delete();  // Delete local copy after upload
        } catch (Exception e) {
            System.out.println(e);
        }
       
        
        return s3Client.getUrl(bucketName, fileName).toString();  // Return the URL of the uploaded file
    }

    // Utility method to convert MultipartFile to File
    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        }
        return convertedFile;
    }

        // Get the S3 URL for a specific key
        public String getS3FileUrl(String key) {
            return s3Client.getUrl(bucketName, key).toString();  // Return the S3 URL for the given key
        }

    // Method to generate a pre-signed URL for the given file name
    public String generatePresignedUrl(String fileName) {
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 60;  // Add 1 hour (in milliseconds)
        expiration.setTime(expTimeMillis);

        // Create the presigned URL request
        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucketName, fileName)
                        .withMethod(HttpMethod.GET)  // Specify HTTP method
                        .withExpiration(expiration);

        // Generate the URL
        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }
}
