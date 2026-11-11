package br.edu.sanquim.studi;

import com.fasterxml.jackson.databind.ObjectMapper;
import br.edu.sanquim.studi.dto.AuthLoginRequest;
import br.edu.sanquim.studi.dto.AuthLoginResponse;
import br.edu.sanquim.studi.dto.ChamadaRegistroItem;
import br.edu.sanquim.studi.dto.ChamadaRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class StudiApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String efetuarLogin(String email, String senha) throws Exception {
        AuthLoginRequest loginReq = new AuthLoginRequest(email, senha);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        AuthLoginResponse resp = objectMapper.readValue(result.getResponse().getContentAsString(), AuthLoginResponse.class);
        return resp.token();
    }

    @Test
    @DisplayName("1. Deve autenticar o Gestor com sucesso e retornar token JWT e ROLE_GESTAO")
    void testLoginGestor() throws Exception {
        AuthLoginRequest req = new AuthLoginRequest("admin@sanquim.br", "admin123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.perfil").value("ROLE_GESTAO"))
                .andExpect(jsonPath("$.usuario.email").value("admin@sanquim.br"));
    }

    @Test
    @DisplayName("2. Deve rejeitar credenciais incorretas com HTTP 401")
    void testLoginInvalido() throws Exception {
        AuthLoginRequest req = new AuthLoginRequest("admin@sanquim.br", "senha-errada");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("3. RBAC: Gestor consegue acessar endpoints administrativos (/api/admin/professores)")
    void testAcessoAdminComGestor() throws Exception {
        String token = efetuarLogin("admin@sanquim.br", "admin123");

        mockMvc.perform(get("/api/admin/professores")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("4. RBAC: Aluno é BLOQUEADO com HTTP 403 ao tentar acessar rota administrativa (/api/admin/alunos)")
    void testAcessoAdminComAlunoDeveRetornar403() throws Exception {
        String token = efetuarLogin("joao.silva@sanquim.br", "aluno123");

        mockMvc.perform(get("/api/admin/alunos")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("5. Módulo do Aluno: Aluno consegue consultar seu boletim")
    void testConsultaBoletimAluno() throws Exception {
        String token = efetuarLogin("joao.silva@sanquim.br", "aluno123");

        mockMvc.perform(get("/api/aluno/boletim")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.alunoNome").value("João Silva"))
                .andExpect(jsonPath("$.disciplinas").isArray());
    }

    @Test
    @DisplayName("6. Módulo do Aluno: Aluno consegue consultar sua frequência acumulada")
    void testConsultaFrequenciaAluno() throws Exception {
        String token = efetuarLogin("joao.silva@sanquim.br", "aluno123");

        mockMvc.perform(get("/api/aluno/frequencia")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.percentualGlobal").isNumber())
                .andExpect(jsonPath("$.disciplinas").isArray());
    }

    @Test
    @DisplayName("7. Módulo Diário: Professor consegue registrar chamada em lote")
    void testRegistroChamadaProfessor() throws Exception {
        String token = efetuarLogin("carlos.santos@sanquim.br", "prof123");

        ChamadaRequest req = new ChamadaRequest(
                1L,
                1L,
                LocalDate.now(),
                List.of(
                        new ChamadaRegistroItem(4L, true, "Presente"),
                        new ChamadaRegistroItem(5L, false, "Ausente")
                )
        );

        mockMvc.perform(post("/api/diario/chamada")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalAlunos").value(2))
                .andExpect(jsonPath("$.totalPresentes").value(1))
                .andExpect(jsonPath("$.totalAusentes").value(1));
    }
}
