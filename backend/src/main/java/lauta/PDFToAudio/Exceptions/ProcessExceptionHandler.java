package lauta.PDFToAudio.Exceptions;

public class ProcessExceptionHandler extends RuntimeException{
    public ProcessExceptionHandler(String message, Exception e){
        super(message);
    }
}
