package br.edu.sanquim.studi.dto;

import java.time.LocalDateTime;

public record ProfessorResponse(
        Long id,
        Long usuarioId,
        String nome,
        String email,
        String cpf,
        String telefone,
        String formacao,
        String instituicao,
        String disciplinasAtuacao,
        String experiencia,
        Boolean ativo,
        LocalDateTime criadoEm
) {}
