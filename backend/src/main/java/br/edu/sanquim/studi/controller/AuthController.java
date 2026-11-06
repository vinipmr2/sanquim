package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.dto.*;
import br.edu.sanquim.studi.model.PerfilUsuario;
import br.edu.sanquim.studi.model.Usuario;
import br.edu.sanquim.studi.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login/aluno")
    public ResponseEntity<LoginResponse> loginAluno(@Valid @RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsuarioOrEmail(request.getUsername(), request.getUsername());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse.falha("Usuário ou senha inválidos."));
        }

        Usuario usuario = usuarioOpt.get();

        // Comparação de senha (em produção recomenda-se BCrypt)
        if (!usuario.getSenha().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse.falha("Usuário ou senha inválidos."));
        }

        if (usuario.getPerfil() != PerfilUsuario.ALUNO && usuario.getPerfil() != PerfilUsuario.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(LoginResponse.falha("Acesso não autorizado para esta área."));
        }

        LoginResponse response = new LoginResponse(
                true,
                "Login realizado com sucesso!",
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getUsuario(),
                usuario.getPerfil(),
                "/dashboard/aluno"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login/professor")
    public ResponseEntity<LoginResponse> loginProfessor(@Valid @RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsuarioOrEmail(request.getUsername(), request.getUsername());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse.falha("Usuário ou senha inválidos."));
        }

        Usuario usuario = usuarioOpt.get();

        if (!usuario.getSenha().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse.falha("Usuário ou senha inválidos."));
        }

        String redirecionamento = "/dashboard/professor";
        if (usuario.getPerfil() == PerfilUsuario.COORDENADOR || usuario.getPerfil() == PerfilUsuario.ADMIN) {
            redirecionamento = "/dashboard/coordenador";
        } else if (usuario.getPerfil() != PerfilUsuario.PROFESSOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(LoginResponse.falha("Acesso restrito a professores e coordenadores."));
        }

        LoginResponse response = new LoginResponse(
                true,
                "Login realizado com sucesso!",
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getUsuario(),
                usuario.getPerfil(),
                redirecionamento
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/cadastro/aluno")
    public ResponseEntity<MensagemResponse> cadastrarAluno(@Valid @RequestBody CadastroAlunoRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MensagemResponse(false, "Este e-mail já está cadastrado."));
        }

        if (request.getUsuario() != null && usuarioRepository.existsByUsuario(request.getUsuario())) {
            return ResponseEntity.badRequest()
                    .body(new MensagemResponse(false, "Este nome de usuário já está em uso."));
        }

        Usuario novoUsuario = new Usuario(
                request.getUsuario(),
                request.getEmail(),
                request.getUsuario(),
                request.getSenha(),
                PerfilUsuario.ALUNO
        );

        usuarioRepository.save(novoUsuario);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensagemResponse(true, "Aluno cadastrado com sucesso! Faça seu login."));
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<MensagemResponse> esqueciSenha(@Valid @RequestBody EsqueciSenhaRequest request) {
        // Valida se o e-mail existe no banco
        boolean existe = usuarioRepository.existsByEmail(request.getEmail());

        // Por segurança, retorna mensagem de sucesso mesmo se o e-mail não existir para evitar enumeração
        return ResponseEntity.ok(new MensagemResponse(
                true,
                "Se o e-mail estiver cadastrado, as instruções de recuperação foram enviadas para " + request.getEmail() + "."
        ));
    }
}
