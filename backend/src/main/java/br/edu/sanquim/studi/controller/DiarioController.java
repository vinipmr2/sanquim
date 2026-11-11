package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.dto.*;
import br.edu.sanquim.studi.service.DiarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diario")
@PreAuthorize("hasAnyRole('PROFESSOR', 'GESTAO')")
@Tag(name = "3. Pedagógico e Diário de Classe", description = "Endpoints para chamada em lote, avaliações, lançamento de notas e planos de aula")
@SecurityRequirement(name = "BearerAuth")
public class DiarioController {

    private final DiarioService diarioService;

    public DiarioController(DiarioService diarioService) {
        this.diarioService = diarioService;
    }

    @GetMapping("/minhas-turmas")
    @Operation(summary = "Listar turmas do professor", description = "Lista turmas e disciplinas sob responsabilidade do docente autenticado (ou todas para a gestão).")
    public ResponseEntity<List<TurmaResponse>> getMinhasTurmas(Authentication authentication) {
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_PROFESSOR");

        return ResponseEntity.ok(diarioService.getMinhasTurmas(email, role));
    }

    @PostMapping("/chamada")
    @Operation(summary = "Registro de chamada em lote", description = "Registra presenças e ausências dos alunos de uma turma em uma data letiva. Trata duplicidades atualizando o registro existente.")
    public ResponseEntity<ChamadaResponse> registrarChamada(@Valid @RequestBody ChamadaRequest request) {
        ChamadaResponse response = diarioService.registrarChamada(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/chamadas")
    @Operation(summary = "Listar chamadas realizadas", description = "Consulta o histórico de chamadas por turma e/ou disciplina.")
    public ResponseEntity<List<ChamadaResponse>> listarChamadas(
            @RequestParam(required = false) Long turmaId,
            @RequestParam(required = false) Long disciplinaId
    ) {
        return ResponseEntity.ok(diarioService.listarChamadas(turmaId, disciplinaId));
    }

    @PostMapping("/avaliacoes")
    @Operation(summary = "Cadastrar atividade avaliativa", description = "Registra prova, trabalho ou seminário com peso, nota máxima e prazo de entrega.")
    public ResponseEntity<AvaliacaoResponse> cadastrarAvaliacao(@Valid @RequestBody AvaliacaoRequest request) {
        AvaliacaoResponse response = diarioService.cadastrarAvaliacao(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/avaliacoes")
    @Operation(summary = "Listar atividades avaliativas", description = "Lista as avaliações cadastradas com filtros opcionais por turma e disciplina.")
    public ResponseEntity<List<AvaliacaoResponse>> listarAvaliacoes(
            @RequestParam(required = false) Long turmaId,
            @RequestParam(required = false) Long disciplinaId
    ) {
        return ResponseEntity.ok(diarioService.listarAvaliacoes(turmaId, disciplinaId));
    }

    @PostMapping("/avaliacoes/{avaliacaoId}/notas")
    @Operation(summary = "Lançamento de notas dos alunos", description = "Lança ou atualiza as notas dos discentes na respectiva atividade avaliativa.")
    public ResponseEntity<List<NotaResponse>> lancarNotas(
            @PathVariable Long avaliacaoId,
            @Valid @RequestBody LancamentoNotasRequest request
    ) {
        List<NotaResponse> response = diarioService.lancarNotas(avaliacaoId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/avaliacoes/{avaliacaoId}/notas")
    @Operation(summary = "Listar notas de uma avaliação", description = "Retorna a relação de notas e observações lançadas para uma avaliação.")
    public ResponseEntity<List<NotaResponse>> listarNotas(@PathVariable Long avaliacaoId) {
        return ResponseEntity.ok(diarioService.listarNotas(avaliacaoId));
    }

    @PostMapping("/planos-aula")
    @Operation(summary = "Registrar plano de aula", description = "Registra o planejamento pedagógico e o resumo dos tópicos lecionados na data.")
    public ResponseEntity<PlanoAulaResponse> registrarPlanoAula(@Valid @RequestBody PlanoAulaRequest request) {
        PlanoAulaResponse response = diarioService.registrarPlanoAula(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/planos-aula")
    @Operation(summary = "Listar planos de aula", description = "Consulta o diário de planos de aula por turma e/ou disciplina.")
    public ResponseEntity<List<PlanoAulaResponse>> listarPlanosAula(
            @RequestParam(required = false) Long turmaId,
            @RequestParam(required = false) Long disciplinaId
    ) {
        return ResponseEntity.ok(diarioService.listarPlanosAula(turmaId, disciplinaId));
    }
}
