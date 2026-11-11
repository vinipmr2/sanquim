package br.edu.sanquim.studi.dto;

import java.time.LocalDate;

public record AvaliacaoNotaDTO(
        Long avaliacaoId,
        String titulo,
        String tipo,
        Double peso,
        Double notaMaxima,
        Double nota,
        String observacao,
        LocalDate dataEntrega
) {}
