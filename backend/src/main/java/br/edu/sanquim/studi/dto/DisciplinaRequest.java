package br.edu.sanquim.studi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DisciplinaRequest(
        @NotBlank(message = "O nome da disciplina é obrigatório.")
        String nome,

        @NotBlank(message = "O código da disciplina é obrigatório.")
        String codigo,

        @NotNull(message = "A carga horária é obrigatória.")
        Integer cargaHoraria,

        Integer creditos,
        String periodo,

        @NotBlank(message = "O professor responsável é obrigatório.")
        String professorResponsavel,

        String departamento,
        String ementa
) {}
