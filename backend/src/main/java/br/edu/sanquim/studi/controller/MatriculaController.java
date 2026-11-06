package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.model.Matricula;
import br.edu.sanquim.studi.repository.MatriculaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matriculas")
public class MatriculaController {

    private final MatriculaRepository matriculaRepository;

    public MatriculaController(MatriculaRepository matriculaRepository) {
        this.matriculaRepository = matriculaRepository;
    }

    @GetMapping
    public List<Matricula> listarTodas(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String busca
    ) {
        if (status != null && !status.isBlank()) {
            return matriculaRepository.findByStatus(status.toLowerCase());
        }
        if (busca != null && !busca.isBlank()) {
            return matriculaRepository.findByAlunoNomeContainingIgnoreCase(busca);
        }
        return matriculaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Matricula> buscarPorId(@PathVariable Long id) {
        return matriculaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Matricula matricula) {
        if (matricula.getMatriculaCodigo() == null || matricula.getMatriculaCodigo().isBlank()) {
            matricula.setMatriculaCodigo("MAT-" + System.currentTimeMillis());
        } else if (matriculaRepository.findByMatriculaCodigo(matricula.getMatriculaCodigo()).isPresent()) {
            return ResponseEntity.badRequest().body("Já existe uma matrícula com este código.");
        }
        Matricula salva = matriculaRepository.save(matricula);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Matricula matriculaAtualizada) {
        return matriculaRepository.findById(id)
                .map(existente -> {
                    existente.setAlunoNome(matriculaAtualizada.getAlunoNome());
                    existente.setMatriculaCodigo(matriculaAtualizada.getMatriculaCodigo());
                    existente.setCurso(matriculaAtualizada.getCurso());
                    existente.setSemestre(matriculaAtualizada.getSemestre());
                    existente.setStatus(matriculaAtualizada.getStatus());
                    existente.setTurmaId(matriculaAtualizada.getTurmaId());
                    Matricula salva = matriculaRepository.save(existente);
                    return ResponseEntity.ok(salva);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!matriculaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        matriculaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
