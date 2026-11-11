package br.edu.sanquim.studi.service;

import br.edu.sanquim.studi.config.JwtTokenProvider;
import br.edu.sanquim.studi.dto.AuthLoginRequest;
import br.edu.sanquim.studi.dto.AuthLoginResponse;
import br.edu.sanquim.studi.dto.UsuarioDTO;
import br.edu.sanquim.studi.exception.RecursoNaoEncontradoException;
import br.edu.sanquim.studi.model.Usuario;
import br.edu.sanquim.studi.repository.UsuarioRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional(readOnly = true)
    public AuthLoginResponse login(AuthLoginRequest request) {
        String loginKey = request.getUsernameOrEmail().trim();

        Usuario usuario = usuarioRepository.findByUsuarioOrEmail(loginKey, loginKey)
                .orElseThrow(() -> new BadCredentialsException("E-mail/usuário ou senha inválidos."));

        if (!usuario.getAtivo()) {
            throw new BadCredentialsException("Usuário inativo. Procure a secretaria acadêmica.");
        }

        // Validação de senha: BCrypt ou fallback para texto puro inicial se não for hash
        boolean senhaValida;
        if (usuario.getSenha().startsWith("$2a$") || usuario.getSenha().startsWith("$2b$") || usuario.getSenha().startsWith("$2y$")) {
            senhaValida = passwordEncoder.matches(request.senha(), usuario.getSenha());
        } else {
            senhaValida = usuario.getSenha().equals(request.senha());
        }

        if (!senhaValida) {
            throw new BadCredentialsException("E-mail/usuário ou senha inválidos.");
        }

        String token = jwtTokenProvider.gerarToken(usuario);
        long expiraEm = jwtTokenProvider.getExpirationSeconds();
        String roleName = usuario.getPerfil().getRoleName();

        UsuarioDTO usuarioDTO = toDTO(usuario);
        return AuthLoginResponse.of(token, expiraEm, roleName, usuarioDTO);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO getUsuarioAtual(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado para o e-mail: " + email));
        return toDTO(usuario);
    }

    public UsuarioDTO toDTO(Usuario u) {
        return new UsuarioDTO(
                u.getId(),
                u.getNome(),
                u.getEmail(),
                u.getUsuario(),
                u.getPerfil().getRoleName(),
                u.getAtivo(),
                u.getCriadoEm()
        );
    }
}
