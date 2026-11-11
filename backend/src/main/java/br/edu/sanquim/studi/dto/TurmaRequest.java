package br.edu.sanquim.studi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record TurmaRequest(
        @NotBlank(message = "O nome da turma é obrigatório.")
        String nome,

        @NotBlank(message = "O código da turma é obrigatório.")
        String codigo,

        Long disciplinaId,
        String disciplinaNome,

        @NotBlank(message = "O professor responsável é obrigatório.")
        String professorResponsavel,

        @NotBlank(message = "O período é obrigatório (ex: 2026.1).")
        String periodo,

        @NotNull(message = "O número de vagas é obrigatório.")
        Integer vagas,

        String horario,
        String sala,
        LocalDate dataInicio,
        LocalDate dataFim,
        String observacoes
) {}
