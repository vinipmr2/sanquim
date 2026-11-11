package br.edu.sanquim.studi.dto;

import java.time.LocalDateTime;

public record NotaResponse(
        Long id,
        Long avaliacaoId,
        String avaliacaoTitulo,
        Long alunoId,
        String alunoNome,
        Double valor,
        String observacao,
        LocalDateTime dataLancamento
) {}
