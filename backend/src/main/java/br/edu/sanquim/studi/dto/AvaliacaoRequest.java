package br.edu.sanquim.studi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record AvaliacaoRequest(
        @NotNull(message = "O ID da turma é obrigatório.")
        Long turmaId,

        @NotNull(message = "O ID da disciplina é obrigatório.")
        Long disciplinaId,

        @NotBlank(message = "O título da avaliação é obrigatório.")
        String titulo,

        String tipo,
        Double peso,
        Double notaMaxima,
        LocalDate dataEntrega,
        String descricao
) {}
