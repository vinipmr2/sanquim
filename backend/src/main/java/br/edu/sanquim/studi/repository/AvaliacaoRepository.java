package br.edu.sanquim.studi.repository;

import br.edu.sanquim.studi.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    List<Avaliacao> findByTurmaId(Long turmaId);

    List<Avaliacao> findByDisciplinaId(Long disciplinaId);

    List<Avaliacao> findByTurmaIdAndDisciplinaId(Long turmaId, Long disciplinaId);

    List<Avaliacao> findByTurmaIdIn(List<Long> turmaIds);
}
