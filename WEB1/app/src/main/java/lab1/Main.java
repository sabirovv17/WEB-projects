package lab1;

import java.util.HashMap;
import com.fastcgi.FCGIInterface;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

public class Main {
    private static final String RESPONSE_TEMPLATE = "Content-type: application/json\n" + 
                                                    "Content-length: %d\n\n%s";

    public static void main (String args[]) { 
        while(new FCGIInterface().FCGIaccept() >= 0) {
            try {
                HashMap<String, String> params = parse(FCGIInterface.request.params.getProperty("QUERY_STRING"));
                
                long startTime = System.nanoTime();
                
                BigDecimal x = new BigDecimal(params.get("x"));
                BigDecimal y = new BigDecimal(params.get("y"));
                int r = Integer.parseInt(params.get("r"));
                if (Validator.validateArgs(x, y, r)) {
                    boolean isHit = Checker.isHit(x.floatValue(), y.floatValue(), r);
                    long endTime = System.nanoTime();

                    sendJson(String.format("{\"result\": %b, \"executionTime\": %d}", isHit, (endTime - startTime)));
                } else {
                    sendJson("{\"error\": \"invalid data\"}");
                }
            } catch (NumberFormatException e) {
                sendJson("{\"error\": \"wrong query param type\"}");
            } catch (NullPointerException e) {
                sendJson(String.format("{\"error\": \"missed necessary query param\"}"));
            } catch (Exception e) {
                sendJson(String.format("{\"error\": \"%s\"}", e.toString()));
            }
        }
    }

    private static void sendJson(String json) {
        System.out.println(String.format(RESPONSE_TEMPLATE, json.getBytes(StandardCharsets.UTF_8).length, json));   
    }
    
    private static HashMap<String, String> parse(String queryString) {
        HashMap<String, String> params = new HashMap<String, String>(); 
        for (String pair : queryString.split("&")) {
            String[] keyValue = pair.split("=");
            if (keyValue.length > 1) {
                params.put(keyValue[0], keyValue[1]);
            } else {
                params.put(keyValue[0], "");
            }
        }
        return params;
    }
}