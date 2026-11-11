package br.edu.sanquim.studi.repository;

import br.edu.sanquim.studi.model.Chamada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChamadaRepository extends JpaRepository<Chamada, Long> {

    Optional<Chamada> findByTurmaIdAndDisciplinaIdAndDataAula(Long turmaId, Long disciplinaId, LocalDate dataAula);

    List<Chamada> findByTurmaId(Long turmaId);

    List<Chamada> findByTurmaIdAndDisciplinaId(Long turmaId, Long disciplinaId);

    List<Chamada> findByDisciplinaId(Long disciplinaId);
}
