package br.edu.sanquim.studi.repository;

import br.edu.sanquim.studi.model.PlanoAula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanoAulaRepository extends JpaRepository<PlanoAula, Long> {

    List<PlanoAula> findByTurmaId(Long turmaId);

    List<PlanoAula> findByDisciplinaId(Long disciplinaId);

    List<PlanoAula> findByTurmaIdAndDisciplinaId(Long turmaId, Long disciplinaId);

    List<PlanoAula> findByTurmaIdInOrderByDataAulaDesc(List<Long> turmaIds);

    List<PlanoAula> findAllByOrderByDataAulaDesc();
}
