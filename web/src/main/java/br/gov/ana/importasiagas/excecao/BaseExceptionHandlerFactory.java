package importacsv.excecao;

import javax.faces.context.ExceptionHandler;
import javax.faces.context.ExceptionHandlerFactory;

public class BaseExceptionHandlerFactory extends ExceptionHandlerFactory {

    protected final ExceptionHandlerFactory parent;

    public BaseExceptionHandlerFactory(ExceptionHandlerFactory parent) {
        this.parent = parent;
    }

    @Override
    public ExceptionHandler getExceptionHandler() {
        ExceptionHandler result = parent.getExceptionHandler();
        result = new BaseExceptionHandler(result);
        return result;
    }

}
