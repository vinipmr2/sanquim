package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.dto.CadastroProfessorRequest;
import br.edu.sanquim.studi.dto.MensagemResponse;
import br.edu.sanquim.studi.model.PerfilUsuario;
import br.edu.sanquim.studi.model.ProfessorDetalhes;
import br.edu.sanquim.studi.model.Usuario;
import br.edu.sanquim.studi.repository.ProfessorDetalhesRepository;
import br.edu.sanquim.studi.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final UsuarioRepository usuarioRepository;
    private final ProfessorDetalhesRepository professorDetalhesRepository;

    public ProfessorController(UsuarioRepository usuarioRepository, ProfessorDetalhesRepository professorDetalhesRepository) {
        this.usuarioRepository = usuarioRepository;
        this.professorDetalhesRepository = professorDetalhesRepository;
    }

    @GetMapping
    public List<ProfessorDetalhes> listarTodos() {
        return professorDetalhesRepository.findAll();
    }

    @PostMapping("/cadastro")
    public ResponseEntity<MensagemResponse> cadastrar(@Valid @RequestBody CadastroProfessorRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new MensagemResponse(false, "Este e-mail já está cadastrado."));
        }

        if (professorDetalhesRepository.findByCpf(request.getCpf()).isPresent()) {
            return ResponseEntity.badRequest().body(new MensagemResponse(false, "Este CPF já está cadastrado."));
        }

        // Criar usuário para o professor
        Usuario usuario = new Usuario(
                request.getNome(),
                request.getEmail(),
                request.getEmail(),
                "123456", // Senha inicial provisória
                PerfilUsuario.PROFESSOR
        );
        Usuario salvo = usuarioRepository.save(usuario);

        // Criar detalhes do perfil profissional
        ProfessorDetalhes detalhes = new ProfessorDetalhes();
        detalhes.setUsuarioId(salvo.getId());
        detalhes.setCpf(request.getCpf());
        detalhes.setTelefone(request.getTelefone());
        detalhes.setDataNascimento(request.getDataNascimento());
        detalhes.setGenero(request.getGenero());
        detalhes.setEndereco(request.getEndereco());
        detalhes.setFormacao(request.getFormacao());
        detalhes.setInstituicao(request.getInstituicao());
        if (request.getDisciplinas() != null) {
            detalhes.setDisciplinasAtuacao(String.join(",", request.getDisciplinas()));
        }
        detalhes.setExperiencia(request.getExperiencia());
        detalhes.setRegistroProfissional(request.getRegistro());
        detalhes.setExperienciaDetalhada(request.getExperienciaDetalhada());

        professorDetalhesRepository.save(detalhes);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensagemResponse(true, "Cadastro de professor submetido com sucesso! Nossa equipe entrará em contato."));
    }
}
