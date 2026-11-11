package br.edu.sanquim.studi.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record LancamentoNotasRequest(
        @NotEmpty(message = "A lista de notas não pode estar vazia.")
        @Valid
        List<NotaAlunoItem> notas
) {}
