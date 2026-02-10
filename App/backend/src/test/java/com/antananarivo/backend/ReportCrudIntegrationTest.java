package com.antananarivo.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ReportCrudIntegrationTest {
    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate rest;

    private String loginAsAdmin(){
        String url = "http://localhost:"+port+"/api/auth/login";
        HttpHeaders headers = new HttpHeaders(); headers.setContentType(MediaType.APPLICATION_JSON);
        String body = "{\"email\":\"admin@example.com\",\"password\":\"password\"}";
        ResponseEntity<Map> resp = rest.postForEntity(url, new HttpEntity<>(body, headers), Map.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        return (String)resp.getBody().get("token");
    }

    @Test
    public void managerCanCrudReports(){
        String token = loginAsAdmin();
        HttpHeaders h = new HttpHeaders(); h.setBearerAuth(token); h.setContentType(MediaType.APPLICATION_JSON);
        String createBody = "{\"title\":\"Test report\",\"description\":\"desc\",\"surface\":10,\"budget\":1000}";
        ResponseEntity<Map> createResp = rest.postForEntity("http://localhost:"+port+"/api/reports", new HttpEntity<>(createBody,h), Map.class);
        assertThat(createResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        Integer id = (Integer)createResp.getBody().get("id");

        String updateBody = "{\"status\":\"en_cours\", \"budget\":2000}";
        rest.exchange("http://localhost:"+port+"/api/reports/"+id, HttpMethod.PUT, new HttpEntity<>(updateBody,h), Map.class);

        rest.exchange("http://localhost:"+port+"/api/reports/"+id, HttpMethod.DELETE, new HttpEntity<>(h), Void.class);
    }
}
