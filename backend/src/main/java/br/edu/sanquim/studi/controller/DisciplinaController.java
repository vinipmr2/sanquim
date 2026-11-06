package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.model.Disciplina;
import br.edu.sanquim.studi.repository.DisciplinaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
public class DisciplinaController {

    private final DisciplinaRepository disciplinaRepository;

    public DisciplinaController(DisciplinaRepository disciplinaRepository) {
        this.disciplinaRepository = disciplinaRepository;
    }

    @GetMapping
    public List<Disciplina> listarTodas() {
        return disciplinaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disciplina> buscarPorId(@PathVariable Long id) {
        return disciplinaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Disciplina disciplina) {
        if (disciplinaRepository.existsByCodigo(disciplina.getCodigo())) {
            return ResponseEntity.badRequest().body("Já existe uma disciplina com este código.");
        }
        Disciplina salva = disciplinaRepository.save(disciplina);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Disciplina disciplinaAtualizada) {
        return disciplinaRepository.findById(id)
                .map(existente -> {
                    existente.setNome(disciplinaAtualizada.getNome());
                    existente.setCodigo(disciplinaAtualizada.getCodigo());
                    existente.setCargaHoraria(disciplinaAtualizada.getCargaHoraria());
                    existente.setCreditos(disciplinaAtualizada.getCreditos());
                    existente.setPeriodo(disciplinaAtualizada.getPeriodo());
                    existente.setProfessorResponsavel(disciplinaAtualizada.getProfessorResponsavel());
                    existente.setDepartamento(disciplinaAtualizada.getDepartamento());
                    existente.setEmenta(disciplinaAtualizada.getEmenta());
                    Disciplina salva = disciplinaRepository.save(existente);
                    return ResponseEntity.ok(salva);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!disciplinaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        disciplinaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
