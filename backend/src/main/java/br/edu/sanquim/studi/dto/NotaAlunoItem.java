package br.edu.sanquim.studi.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record NotaAlunoItem(
        @NotNull(message = "O ID do aluno é obrigatório.")
        Long alunoId,

        @NotNull(message = "O valor da nota é obrigatório.")
        @DecimalMin(value = "0.0", message = "A nota mínima é 0.0.")
        @DecimalMax(value = "10.0", message = "A nota máxima é 10.0.")
        Double nota,

        String observacao
) {}
