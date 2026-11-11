package br.edu.sanquim.studi.repository;

import br.edu.sanquim.studi.model.ChamadaRegistro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChamadaRegistroRepository extends JpaRepository<ChamadaRegistro, Long> {

    List<ChamadaRegistro> findByChamadaId(Long chamadaId);

    List<ChamadaRegistro> findByAlunoId(Long alunoId);

    Optional<ChamadaRegistro> findByChamadaIdAndAlunoId(Long chamadaId, Long alunoId);

    List<ChamadaRegistro> findByChamadaIdInAndAlunoId(List<Long> chamadaIds, Long alunoId);
}
