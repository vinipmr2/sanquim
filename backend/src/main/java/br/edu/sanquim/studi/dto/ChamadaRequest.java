package br.edu.sanquim.studi.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record ChamadaRequest(
        @NotNull(message = "O ID da turma é obrigatório.")
        Long turmaId,

        @NotNull(message = "O ID da disciplina é obrigatório.")
        Long disciplinaId,

        @NotNull(message = "A data da aula é obrigatória.")
        LocalDate dataAula,

        @NotEmpty(message = "A lista de registros de presença não pode estar vazia.")
        @Valid
        List<ChamadaRegistroItem> registros
) {}
