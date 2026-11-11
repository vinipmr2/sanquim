package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.dto.MatriculaRequest;
import br.edu.sanquim.studi.dto.MatriculaResponse;
import br.edu.sanquim.studi.exception.RecursoNaoEncontradoException;
import br.edu.sanquim.studi.model.Matricula;
import br.edu.sanquim.studi.repository.MatriculaRepository;
import br.edu.sanquim.studi.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matriculas")
@Tag(name = "7. Matrículas (Geral)", description = "Endpoints de consulta e gerenciamento de matrículas")
public class MatriculaController {

    private final MatriculaRepository matriculaRepository;
    private final AdminService adminService;

    public MatriculaController(MatriculaRepository matriculaRepository, AdminService adminService) {
        this.matriculaRepository = matriculaRepository;
        this.adminService = adminService;
    }

    @GetMapping
    @Operation(summary = "Listar todas as matrículas")
    public List<MatriculaResponse> listarTodas() {
        return adminService.listarMatriculas();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar matrícula por ID")
    public ResponseEntity<MatriculaResponse> buscarPorId(@PathVariable Long id) {
        Matricula m = matriculaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Matrícula não encontrada para o ID: " + id));
        return ResponseEntity.ok(adminService.toMatriculaResponse(m, null));
    }

    @PostMapping
    @Operation(summary = "Efetuar nova matrícula")
    public ResponseEntity<MatriculaResponse> criar(@Valid @RequestBody MatriculaRequest request) {
        MatriculaResponse salva = adminService.realizarMatricula(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancelar matrícula")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!matriculaRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Matrícula não encontrada para o ID: " + id);
        }
        matriculaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
