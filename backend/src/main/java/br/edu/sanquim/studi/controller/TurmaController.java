package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.dto.TurmaRequest;
import br.edu.sanquim.studi.dto.TurmaResponse;
import br.edu.sanquim.studi.exception.RecursoNaoEncontradoException;
import br.edu.sanquim.studi.model.Turma;
import br.edu.sanquim.studi.repository.TurmaRepository;
import br.edu.sanquim.studi.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turmas")
@Tag(name = "6. Turmas (Geral)", description = "Endpoints de consulta e gerenciamento de turmas")
public class TurmaController {

    private final TurmaRepository turmaRepository;
    private final AdminService adminService;

    public TurmaController(TurmaRepository turmaRepository, AdminService adminService) {
        this.turmaRepository = turmaRepository;
        this.adminService = adminService;
    }

    @GetMapping
    @Operation(summary = "Listar todas as turmas")
    public List<TurmaResponse> listarTodas() {
        return adminService.listarTurmas();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar turma por ID")
    public ResponseEntity<TurmaResponse> buscarPorId(@PathVariable Long id) {
        Turma t = turmaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Turma não encontrada para o ID: " + id));
        return ResponseEntity.ok(adminService.toTurmaResponse(t));
    }

    @PostMapping
    @Operation(summary = "Criar nova turma")
    public ResponseEntity<TurmaResponse> criar(@Valid @RequestBody TurmaRequest request) {
        TurmaResponse salva = adminService.cadastrarTurma(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar turma")
    public ResponseEntity<TurmaResponse> atualizar(@PathVariable Long id, @Valid @RequestBody TurmaRequest request) {
        Turma existente = turmaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Turma não encontrada para o ID: " + id));

        existente.setNome(request.nome());
        existente.setCodigo(request.codigo());
        existente.setDisciplinaId(request.disciplinaId());
        existente.setDisciplinaNome(request.disciplinaNome());
        existente.setProfessorResponsavel(request.professorResponsavel());
        existente.setPeriodo(request.periodo());
        existente.setVagas(request.vagas());
        existente.setHorario(request.horario());
        existente.setSala(request.sala());
        existente.setDataInicio(request.dataInicio());
        existente.setDataFim(request.dataFim());
        existente.setObservacoes(request.observacoes());

        Turma salva = turmaRepository.save(existente);
        return ResponseEntity.ok(adminService.toTurmaResponse(salva));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir turma")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!turmaRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Turma não encontrada para o ID: " + id);
        }
        turmaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
