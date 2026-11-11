package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.dto.AulaTimelineResponse;
import br.edu.sanquim.studi.dto.BoletimResponse;
import br.edu.sanquim.studi.dto.FrequenciaResponse;
import br.edu.sanquim.studi.service.AlunoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/aluno")
@PreAuthorize("hasRole('ALUNO')")
@Tag(name = "4. Portal do Aluno", description = "Endpoints de autoatendimento acadêmico para discentes (ROLE_ALUNO)")
@SecurityRequirement(name = "BearerAuth")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @GetMapping("/boletim")
    @Operation(summary = "Consultar boletim escolar", description = "Consulta discriminada das notas obtidas por disciplina e cálculo de média parcial ponderada.")
    public ResponseEntity<BoletimResponse> getBoletim(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(alunoService.getBoletim(email));
    }

    @GetMapping("/frequencia")
    @Operation(summary = "Consultar frequência e faltas", description = "Consulta percentual global de presença e total de faltas acumuladas por componente curricular.")
    public ResponseEntity<FrequenciaResponse> getFrequencia(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(alunoService.getFrequencia(email));
    }

    @GetMapping("/aulas")
    @Operation(summary = "Linha do tempo de aulas lecionadas", description = "Consulta a cronologia de conteúdos e tópicos ministrados na turma do discente.")
    public ResponseEntity<List<AulaTimelineResponse>> getLinhaDoTempoAulas(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(alunoService.getLinhaDoTempoAulas(email));
    }
}
