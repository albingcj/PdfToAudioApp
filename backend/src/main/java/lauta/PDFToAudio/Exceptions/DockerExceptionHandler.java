package lauta.PDFToAudio.Exceptions;

public class DockerExceptionHandler extends RuntimeException {
    public DockerExceptionHandler(String message){
        super(message);
    }
}
