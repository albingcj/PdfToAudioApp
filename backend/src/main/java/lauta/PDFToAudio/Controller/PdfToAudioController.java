package lauta.PDFToAudio.Controller;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lauta.PDFToAudio.Service.PdfToAudioService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*") // <- This annotation allows cross-origin requests from all domains
@RestController
public class PdfToAudioController {

  PdfToAudioService pdfToAudioService;

  public PdfToAudioController(PdfToAudioService pdfToAudioService) {
    this.pdfToAudioService = pdfToAudioService;
  }

  @PostMapping("/upload")
  public ResponseEntity<Map<String, Object>> upload(
    @RequestParam("file") MultipartFile file
  ) {
    Map<String, Object> response = new HashMap<>();

    if (file.isEmpty()) {
      response.put("status", "error");
      response.put("message", "File is empty");
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    String name = file.getOriginalFilename();
    if (name == null || !name.toLowerCase().endsWith(".pdf")) {
      response.put("status", "error");
      response.put("message", "The file need to be a PDF");
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    String id = UUID.randomUUID().toString();
    String fileName = id + ".pdf";
    String uploadDirectly = System.getProperty("java.io.tmpdir");
    File targetFile = new File(uploadDirectly, fileName);

    try {
      file.transferTo(targetFile);
    } catch (IOException e) {
      response.put("status", "error");
      response.put("message", "Error when transferring the file");
      return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    response.put("status", "success");
    response.put("message", "File uploaded successfully");
    response.put("uuid", id);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @GetMapping("/getText/{uuid}")
  public ResponseEntity<Map<String, Object>> getText(
    @PathVariable String uuid
  ) {
    Map<String, Object> response = new HashMap<>();
    String uploadDirectly = System.getProperty("java.io.tmpdir");
    File file = new File(uploadDirectly, uuid + ".pdf");

    if (!file.exists()) {
      response.put("status", "error");
      response.put("message", "Need to upload a PDF first");
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    response.put("status", "success");
    response.put("message", pdfToAudioService.pdfToString(file));
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @PostMapping("/textToSpeech/{uuid}")
  public ResponseEntity<Map<String, Object>> textToSpeech(
    @PathVariable String uuid
  ) {
    Map<String, Object> response = new HashMap<>();
    String uploadDir = System.getProperty("java.io.tmpdir");
    File file = new File(uploadDir, uuid + ".pdf");

    if (!file.exists()) {
      response.put("status", "error");
      response.put("message", "Need to upload a PDF first");
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    response.put("status", "success");
    response.put("message", "Text to speech transformation done succesfully");
    pdfToAudioService.textToSpeech(file, uuid);
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @GetMapping(value = "/download/{uuid}")
  public ResponseEntity<InputStreamResource> downloadFile(
    @PathVariable String uuid
  ) {
    try {
      InputStream inputStream = pdfToAudioService.downloadAudioFile(uuid);
      InputStreamResource resource = new InputStreamResource(inputStream);

      HttpHeaders respHeaders = new HttpHeaders();
      respHeaders.setContentType(MediaType.parseMediaType("audio/wav"));
      respHeaders.setContentDisposition(
        ContentDisposition.attachment().filename(uuid + "_audio.wav").build()
      );

      Path filePath = Paths.get("/app/output", uuid + "_combined_output.wav");
      long fileSize = Files.exists(filePath) ? Files.size(filePath) : 0;

      return ResponseEntity
        .ok()
        .headers(respHeaders)
        .contentLength(fileSize)
        .body(resource);
    } catch (FileNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }
}
