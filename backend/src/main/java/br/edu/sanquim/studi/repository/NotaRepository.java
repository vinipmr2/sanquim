package br.edu.sanquim.studi.repository;

import br.edu.sanquim.studi.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {

    List<Nota> findByAvaliacaoId(Long avaliacaoId);

    List<Nota> findByAlunoId(Long alunoId);

    Optional<Nota> findByAvaliacaoIdAndAlunoId(Long avaliacaoId, Long alunoId);

    List<Nota> findByAvaliacaoIdInAndAlunoId(List<Long> avaliacaoIds, Long alunoId);
}
