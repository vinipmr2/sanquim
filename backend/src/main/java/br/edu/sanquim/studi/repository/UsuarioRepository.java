package br.edu.sanquim.studi.repository;

import br.edu.sanquim.studi.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsuario(String usuario);

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByUsuarioOrEmail(String usuario, String email);

    boolean existsByEmail(String email);

    boolean existsByUsuario(String usuario);
}
