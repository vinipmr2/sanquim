package br.edu.sanquim.studi.repository;

import br.edu.sanquim.studi.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {

    Optional<Turma> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    List<Turma> findByProfessorResponsavel(String professorResponsavel);

    List<Turma> findByProfessorResponsavelIgnoreCase(String professorResponsavel);

    List<Turma> findByDisciplinaId(Long disciplinaId);
}
