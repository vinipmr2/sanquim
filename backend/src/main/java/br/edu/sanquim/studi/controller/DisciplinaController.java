package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.dto.DisciplinaRequest;
import br.edu.sanquim.studi.dto.DisciplinaResponse;
import br.edu.sanquim.studi.exception.RecursoNaoEncontradoException;
import br.edu.sanquim.studi.model.Disciplina;
import br.edu.sanquim.studi.repository.DisciplinaRepository;
import br.edu.sanquim.studi.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
@Tag(name = "5. Disciplinas (Geral)", description = "Endpoints de consulta e manutenção de disciplinas")
public class DisciplinaController {

    private final DisciplinaRepository disciplinaRepository;
    private final AdminService adminService;

    public DisciplinaController(DisciplinaRepository disciplinaRepository, AdminService adminService) {
        this.disciplinaRepository = disciplinaRepository;
        this.adminService = adminService;
    }

    @GetMapping
    @Operation(summary = "Listar todas as disciplinas")
    public List<DisciplinaResponse> listarTodas() {
        return adminService.listarDisciplinas();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar disciplina por ID")
    public ResponseEntity<DisciplinaResponse> buscarPorId(@PathVariable Long id) {
        Disciplina d = disciplinaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Disciplina não encontrada para o ID: " + id));
        return ResponseEntity.ok(adminService.toDisciplinaResponse(d));
    }

    @PostMapping
    @Operation(summary = "Criar nova disciplina")
    public ResponseEntity<DisciplinaResponse> criar(@Valid @RequestBody DisciplinaRequest request) {
        DisciplinaResponse salva = adminService.cadastrarDisciplina(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar disciplina")
    public ResponseEntity<DisciplinaResponse> atualizar(@PathVariable Long id, @Valid @RequestBody DisciplinaRequest request) {
        Disciplina existente = disciplinaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Disciplina não encontrada para o ID: " + id));

        existente.setNome(request.nome());
        existente.setCodigo(request.codigo());
        existente.setCargaHoraria(request.cargaHoraria());
        existente.setCreditos(request.creditos());
        existente.setPeriodo(request.periodo());
        existente.setProfessorResponsavel(request.professorResponsavel());
        existente.setDepartamento(request.departamento());
        existente.setEmenta(request.ementa());

        Disciplina salva = disciplinaRepository.save(existente);
        return ResponseEntity.ok(adminService.toDisciplinaResponse(salva));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir disciplina")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!disciplinaRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Disciplina não encontrada para o ID: " + id);
        }
        disciplinaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
