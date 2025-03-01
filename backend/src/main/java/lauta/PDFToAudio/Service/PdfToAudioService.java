package lauta.PDFToAudio.Service;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import lauta.PDFToAudio.Exceptions.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PdfToAudioService {

  private static final Logger logger = LoggerFactory.getLogger(
    (PdfToAudioService.class)
  );

  // URL of the Python Flask API
  private static final String PYTHON_API_URL =
    "http://pdftoaudio-python-script:5000"; // Replace with the actual service name

  public String pdfToString(File file) {
    PDDocument inptPDF = null;
    try {
      inptPDF = PDDocument.load(file);
      PDFTextStripper pdfReader = new PDFTextStripper();
      return pdfReader.getText(inptPDF);
    } catch (IOException e) {
      logger.error("Error processing PDF file: {}", file.getName());
      throw new PdfProcessingException("Failed to extract text from PDF");
    } finally {
      if (inptPDF != null) {
        try {
          inptPDF.close();
        } catch (IOException e) {
          logger.error("Error trying to close the PDDocument: {}", inptPDF);
          throw new PdfProcessingException("Error closing the PDF");
        }
      }
    }
  }

  public int textToSpeech(File file, String uuid) {
    String content = pdfToString(file);
    if (content == null || content.trim().isEmpty()) {
      throw new PdfProcessingException(
        "The extracted text from the PDF is empty"
      );
    }
    ArrayList<String> chunks = largeTextToChunks(file);
    String pathString = Paths
      .get(System.getProperty("user.dir"), "outputs")
      .toString();
    Path path = Paths.get(pathString);
    if (!Files.exists(path)) {
      try {
        Files.createDirectory(path);
      } catch (IOException e) {
        logger.error("Failed to create directory of the outputs: {}", path);
        throw new DirectoryCreationException("Failed to create directory");
      }
    }
    for (int i = 0; i < chunks.size(); i++) {
      String chunk = chunks.get(i);
      logger.info("Chunk index: {}", i);
      logger.info("Processing chunk {}: {}", i, chunk);

      try {
        callPythonGenerate(chunk, i);
      } catch (IOException | InterruptedException e) {
        logger.error("Error processing the chunk {}: {}", i, e.getMessage(), e);
        throw new ProcessExceptionHandler("Failed to call Python script", e);
      }
    }
    try {
      combineAudioFiles(uuid);
    } catch (IOException | InterruptedException e) {
      logger.error("Error combining audio files: {}", e.getMessage());
      throw new ProcessExceptionHandler("Failed to combine audio files", e);
    }

    return 0;
  }

  //   private ArrayList<String> largeTextToChunks(File file) {
  //     ArrayList<String> chunks = new ArrayList<>();
  //     String content = pdfToString(file);
  //     content = content.replaceAll("\\s+", " ");
  //     content = content.trim();

  //     String[] sentences = content.split("[.!?]");
  //     StringBuilder currentChunk = new StringBuilder();
  //     int chunkSize = 500;
  //     for (String sentence : sentences) {
  //       String fullSentence = sentence.trim() + ".";
  //       if (currentChunk.length() + fullSentence.length() <= chunkSize) {
  //         currentChunk.append(fullSentence).append(" ");
  //       } else {
  //         chunks.add(currentChunk.toString().trim());
  //         currentChunk = new StringBuilder(fullSentence).append(" ");
  //       }
  //     }

  //     if (currentChunk.length() > 0) {
  //       chunks.add(currentChunk.toString().trim());
  //     }

  //     return chunks;
  //   }
  private ArrayList<String> largeTextToChunks(File file) {
    ArrayList<String> chunks = new ArrayList<>();
    String content = pdfToString(file);
    // Normalize spacing
    content = content.replaceAll("\\s+", " ").trim();

    // Split by sentence terminators (".", "?", "!", "...") or new lines
    // The regex looks for a sentence terminator or triple dots or a newline
    // and includes that as a split endpoint.
    String[] sentences = content.split("(?<=(?<![.!?])[.!?](?![.!?]))|\\n");

    StringBuilder currentChunk = new StringBuilder();
    int chunkSize = 500;
    for (String sentence : sentences) {
      String trimmedSentence = sentence.trim();
      if (trimmedSentence.isEmpty()) {
        continue;
      }
      // Add a period at the end if you want to keep punctuation consistent
      // or you can rely on the existing punctuation in trimmedSentence.
      // Here, we'll just rely on the splitting punctuation.
      if (currentChunk.length() + trimmedSentence.length() <= chunkSize) {
        currentChunk.append(trimmedSentence).append(" ");
      } else {
        chunks.add(currentChunk.toString().trim());
        currentChunk = new StringBuilder(trimmedSentence).append(" ");
      }
    }

    if (currentChunk.length() > 0) {
      chunks.add(currentChunk.toString().trim());
    }
    return chunks;
  }

  private void callPythonGenerate(String chunk, int index)
    throws IOException, InterruptedException {
    HttpClient client = HttpClient.newHttpClient();
    String url = PYTHON_API_URL + "/generate";
    String jsonBody = String.format(
      "{\"text\": \"%s\", \"chunk_index\": %d}",
      chunk.replace("\"", "\\\""),
      index
    );

    HttpRequest request = HttpRequest
      .newBuilder()
      .uri(URI.create(url))
      .header("Content-Type", "application/json")
      .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
      .build();

    HttpResponse<String> response = client.send(
      request,
      HttpResponse.BodyHandlers.ofString()
    );

    if (response.statusCode() != 200) {
      throw new IOException(
        "Python script failed with status code: " +
        response.statusCode() +
        ", message: " +
        response.body()
      );
    }

    logger.info(
      "Python script successfully processed chunk {}: {}",
      index,
      response.body()
    );
  }

  private void combineAudioFiles(String uuid)
    throws IOException, InterruptedException {
    HttpClient client = HttpClient.newHttpClient();
    String url = PYTHON_API_URL + "/combine";
    String jsonBody = String.format("{\"uuid\": \"%s\"}", uuid);

    HttpRequest request = HttpRequest
      .newBuilder()
      .uri(URI.create(url))
      .header("Content-Type", "application/json")
      .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
      .build();

    HttpResponse<String> response = client.send(
      request,
      HttpResponse.BodyHandlers.ofString()
    );

    if (response.statusCode() != 200) {
      throw new IOException(
        "Python script failed with status code: " +
        response.statusCode() +
        ", message: " +
        response.body()
      );
    }

    logger.info(
      "Python script successfully combined audio files for UUID: {}",
      uuid
    );
  }

  public InputStream downloadAudioFile(String uuid) throws IOException {
    String fileName = String.format("%s_combined_output.wav", uuid);
    Path filePath = Paths.get("/app/output", fileName);

    if (!Files.exists(filePath)) {
      throw new IOException(
        "The file with UUID: " + uuid + " could not be found"
      );
    }
    return Files.newInputStream(filePath);
  }
}
