package br.edu.sanquim.studi.dto;

import jakarta.validation.constraints.NotNull;

public record ChamadaRegistroItem(
        @NotNull(message = "O ID do aluno é obrigatório.")
        Long alunoId,

        @NotNull(message = "O status de presença é obrigatório.")
        Boolean presente,

        String observacao
) {}
