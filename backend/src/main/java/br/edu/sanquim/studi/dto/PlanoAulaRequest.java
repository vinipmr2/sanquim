package br.edu.sanquim.studi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record PlanoAulaRequest(
        @NotNull(message = "O ID da turma é obrigatório.")
        Long turmaId,

        @NotNull(message = "O ID da disciplina é obrigatório.")
        Long disciplinaId,

        @NotNull(message = "A data da aula é obrigatória.")
        LocalDate dataAula,

        @NotBlank(message = "O título da aula é obrigatório.")
        String titulo,

        @NotBlank(message = "O resumo dos tópicos lecionados é obrigatório.")
        String topicos,

        String objetivos,
        String materiaisApoio,
        String observacoes
) {}
