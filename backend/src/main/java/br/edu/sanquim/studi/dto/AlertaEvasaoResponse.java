package br.edu.sanquim.studi.dto;

public record AlertaEvasaoResponse(
        Long alunoId,
        String alunoNome,
        String email,
        String turmaNome,
        long totalFaltas,
        double percentualFrequencia,
        String statusRisco,
        String recomendacao
) {}
