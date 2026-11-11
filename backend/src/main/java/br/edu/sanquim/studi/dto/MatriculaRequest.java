package br.edu.sanquim.studi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MatriculaRequest(
        String matriculaCodigo,

        @NotBlank(message = "O nome do aluno é obrigatório.")
        String alunoNome,

        Long usuarioId,

        @NotBlank(message = "O curso é obrigatório.")
        String curso,

        @NotBlank(message = "O semestre é obrigatório.")
        String semestre,

        String status,

        @NotNull(message = "O identificador da turma é obrigatório.")
        Long turmaId
) {}
