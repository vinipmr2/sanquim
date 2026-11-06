package br.edu.sanquim.studi.repository;

import br.edu.sanquim.studi.model.ProfessorDetalhes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfessorDetalhesRepository extends JpaRepository<ProfessorDetalhes, Long> {

    Optional<ProfessorDetalhes> findByUsuarioId(Long usuarioId);

    Optional<ProfessorDetalhes> findByCpf(String cpf);
}
