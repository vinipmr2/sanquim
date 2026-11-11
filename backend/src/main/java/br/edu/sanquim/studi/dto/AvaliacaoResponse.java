package br.edu.sanquim.studi.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AvaliacaoResponse(
        Long id,
        Long turmaId,
        String turmaNome,
        Long disciplinaId,
        String disciplinaNome,
        String titulo,
        String tipo,
        Double peso,
        Double notaMaxima,
        LocalDate dataEntrega,
        String descricao,
        LocalDateTime criadoEm
) {}
