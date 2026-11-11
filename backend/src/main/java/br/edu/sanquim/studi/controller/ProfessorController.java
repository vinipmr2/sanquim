package br.edu.sanquim.studi.controller;

import br.edu.sanquim.studi.dto.MensagemResponse;
import br.edu.sanquim.studi.dto.ProfessorRequest;
import br.edu.sanquim.studi.dto.ProfessorResponse;
import br.edu.sanquim.studi.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
@Tag(name = "8. Professores (Geral)", description = "Endpoints de consulta e cadastro voluntário de docentes")
public class ProfessorController {

    private final AdminService adminService;

    public ProfessorController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    @Operation(summary = "Listar professores cadastrados")
    public List<ProfessorResponse> listarTodos() {
        return adminService.listarProfessores();
    }

    @PostMapping("/cadastro")
    @Operation(summary = "Cadastro de professor voluntário (Público)", description = "Permite que novos professores voluntários se cadastrem na plataforma.")
    public ResponseEntity<MensagemResponse> cadastrar(@Valid @RequestBody ProfessorRequest request) {
        adminService.cadastrarProfessor(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MensagemResponse(true, "Cadastro de professor voluntário realizado com sucesso!"));
    }
}
