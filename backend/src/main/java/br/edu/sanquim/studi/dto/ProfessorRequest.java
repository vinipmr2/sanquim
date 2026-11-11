package br.edu.sanquim.studi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ProfessorRequest(
        @NotBlank(message = "O nome é obrigatório.")
        String nome,

        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "Formato de e-mail inválido.")
        String email,

        String senha,
        String cpf,
        String telefone,
        String formacao,
        String instituicao,
        String disciplinasAtuacao,
        String experiencia,
        String registroProfissional,
        String experienciaDetalhada
) {}
