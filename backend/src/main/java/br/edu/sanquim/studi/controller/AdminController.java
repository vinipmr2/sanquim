package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.dto.*;
import br.edu.sanquim.studi.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('GESTAO')")
@Tag(name = "2. Gestão Administrativa", description = "Endpoints exclusivos para gestores escolares (ROLE_GESTAO)")
@SecurityRequirement(name = "BearerAuth")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // --- Professores ---

    @PostMapping("/professores")
    @Operation(summary = "Cadastrar professor", description = "Cadastra novo professor no sistema com usuário e detalhes de formação.")
    public ResponseEntity<ProfessorResponse> cadastrarProfessor(@Valid @RequestBody ProfessorRequest request) {
        ProfessorResponse response = adminService.cadastrarProfessor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/professores")
    @Operation(summary = "Listar professores", description = "Retorna todos os professores cadastrados no sistema.")
    public ResponseEntity<List<ProfessorResponse>> listarProfessores() {
        return ResponseEntity.ok(adminService.listarProfessores());
    }

    // --- Alunos ---

    @PostMapping("/alunos")
    @Operation(summary = "Cadastrar aluno", description = "Cadastra novo aluno, gera matrícula e associa opcionalmente a uma turma.")
    public ResponseEntity<AlunoResponse> cadastrarAluno(@Valid @RequestBody AlunoRequest request) {
        AlunoResponse response = adminService.cadastrarAluno(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/alunos")
    @Operation(summary = "Listar alunos", description = "Retorna todos os alunos cadastrados no sistema.")
    public ResponseEntity<List<AlunoResponse>> listarAlunos() {
        return ResponseEntity.ok(adminService.listarAlunos());
    }

    // --- Turmas ---

    @PostMapping("/turmas")
    @Operation(summary = "Criar turma letiva", description = "Cria uma turma letiva vinculada a um período, sala e professor responsável.")
    public ResponseEntity<TurmaResponse> cadastrarTurma(@Valid @RequestBody TurmaRequest request) {
        TurmaResponse response = adminService.cadastrarTurma(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/turmas")
    @Operation(summary = "Listar turmas", description = "Retorna a relação de turmas cadastradas com total de vagas e ocupação.")
    public ResponseEntity<List<TurmaResponse>> listarTurmas() {
        return ResponseEntity.ok(adminService.listarTurmas());
    }

    // --- Disciplinas ---

    @PostMapping("/disciplinas")
    @Operation(summary = "Cadastrar disciplina", description = "Cadastra componente curricular com carga horária, créditos e ementa.")
    public ResponseEntity<DisciplinaResponse> cadastrarDisciplina(@Valid @RequestBody DisciplinaRequest request) {
        DisciplinaResponse response = adminService.cadastrarDisciplina(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/disciplinas")
    @Operation(summary = "Listar disciplinas", description = "Retorna todas as disciplinas cadastradas no colégio.")
    public ResponseEntity<List<DisciplinaResponse>> listarDisciplinas() {
        return ResponseEntity.ok(adminService.listarDisciplinas());
    }

    // --- Matrículas ---

    @PostMapping("/matriculas")
    @Operation(summary = "Vínculo de enturmação (Matrícula)", description = "Associa um aluno a uma turma ativa, validando limite de vagas disponíveis.")
    public ResponseEntity<MatriculaResponse> realizarMatricula(@Valid @RequestBody MatriculaRequest request) {
        MatriculaResponse response = adminService.realizarMatricula(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/matriculas")
    @Operation(summary = "Listar matrículas", description = "Lista todas as matrículas ativas e enturmações no colégio.")
    public ResponseEntity<List<MatriculaResponse>> listarMatriculas() {
        return ResponseEntity.ok(adminService.listarMatriculas());
    }

    // --- Indicadores & Evasão (US07, US08) ---

    @GetMapping("/stats")
    @Operation(summary = "Indicadores gerais do colégio", description = "Métricas agregadas para o dashboard do coordenador.")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/alertas-evasao")
    @Operation(summary = "Sistema de alerta contra evasão", description = "Identifica alunos com baixa frequência (<75%) ou faltas excessivas e sugere intervenções.")
    public ResponseEntity<List<AlertaEvasaoResponse>> getAlertasEvasao() {
        return ResponseEntity.ok(adminService.getAlertasEvasao());
    }
}
