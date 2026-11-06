package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.model.Turma;
import br.edu.sanquim.studi.repository.TurmaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turmas")
public class TurmaController {

    private final TurmaRepository turmaRepository;

    public TurmaController(TurmaRepository turmaRepository) {
        this.turmaRepository = turmaRepository;
    }

    @GetMapping
    public List<Turma> listarTodas() {
        return turmaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Turma> buscarPorId(@PathVariable Long id) {
        return turmaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Turma turma) {
        if (turmaRepository.existsByCodigo(turma.getCodigo())) {
            return ResponseEntity.badRequest().body("Já existe uma turma cadastrada com este código.");
        }
        Turma salva = turmaRepository.save(turma);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Turma turmaAtualizada) {
        return turmaRepository.findById(id)
                .map(existente -> {
                    existente.setNome(turmaAtualizada.getNome());
                    existente.setCodigo(turmaAtualizada.getCodigo());
                    existente.setDisciplinaId(turmaAtualizada.getDisciplinaId());
                    existente.setDisciplinaNome(turmaAtualizada.getDisciplinaNome());
                    existente.setProfessorResponsavel(turmaAtualizada.getProfessorResponsavel());
                    existente.setPeriodo(turmaAtualizada.getPeriodo());
                    existente.setVagas(turmaAtualizada.getVagas());
                    existente.setVagasOcupadas(turmaAtualizada.getVagasOcupadas());
                    existente.setStatus(turmaAtualizada.getStatus());
                    existente.setHorario(turmaAtualizada.getHorario());
                    existente.setSala(turmaAtualizada.getSala());
                    existente.setDataInicio(turmaAtualizada.getDataInicio());
                    existente.setDataFim(turmaAtualizada.getDataFim());
                    existente.setObservacoes(turmaAtualizada.getObservacoes());
                    Turma salva = turmaRepository.save(existente);
                    return ResponseEntity.ok(salva);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!turmaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        turmaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
