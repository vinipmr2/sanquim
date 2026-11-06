package br.edu.sanquim.studi.repository;

import br.edu.sanquim.studi.model.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, Long> {

    Optional<Matricula> findByMatriculaCodigo(String matriculaCodigo);

    List<Matricula> findByStatus(String status);

    List<Matricula> findByAlunoNomeContainingIgnoreCase(String nome);
}
