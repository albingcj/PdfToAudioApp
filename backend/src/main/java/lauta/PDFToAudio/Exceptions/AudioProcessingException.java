package lauta.PDFToAudio.Exceptions;

import java.io.IOException;

public class AudioProcessingException extends  RuntimeException{
    public AudioProcessingException(String message, IOException e){
        super(message);
    }
}
