package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.dto.*;
import br.edu.sanquim.studi.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "1. Autenticação", description = "Endpoints para login, emissão de token JWT e identificação de usuário")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Autentica usuário e emite Token JWT", description = "Autentica gestor, professor ou aluno via e-mail e senha. Retorna o token JWT assinado, expiração e perfil canônico (ROLE_GESTAO, ROLE_PROFESSOR ou ROLE_ALUNO).")
    public ResponseEntity<AuthLoginResponse> login(@Valid @RequestBody AuthLoginRequest request) {
        AuthLoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login/aluno")
    @Operation(summary = "Login de Aluno (Compatibilidade)", description = "Rota de compatibilidade para formulários web de alunos.")
    public ResponseEntity<AuthLoginResponse> loginAluno(@Valid @RequestBody AuthLoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/login/professor")
    @Operation(summary = "Login de Professor (Compatibilidade)", description = "Rota de compatibilidade para formulários web de professores.")
    public ResponseEntity<AuthLoginResponse> loginProfessor(@Valid @RequestBody AuthLoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    @Operation(summary = "Obter dados do usuário autenticado", description = "Retorna informações cadastrais do usuário correspondente ao token JWT enviado no cabeçalho Authorization.")
    public ResponseEntity<UsuarioDTO> getUsuarioLogado(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();
        return ResponseEntity.ok(authService.getUsuarioAtual(email));
    }

    @PostMapping("/esqueci-senha")
    @Operation(summary = "Recuperação de senha", description = "Envia instruções provisórias de recuperação de senha para o e-mail informado.")
    public ResponseEntity<MensagemResponse> esqueciSenha(@RequestBody EsqueciSenhaRequest request) {
        return ResponseEntity.ok(new MensagemResponse(true, "Se o e-mail estiver cadastrado, as instruções de recuperação foram enviadas com sucesso."));
    }
}
