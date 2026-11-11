package br.edu.sanquim.studi.dto;

import java.time.LocalDateTime;

public record AlunoResponse(
        Long id,
        Long usuarioId,
        String nome,
        String email,
        String matriculaCodigo,
        String curso,
        String semestre,
        String status,
        Long turmaId,
        String turmaNome,
        LocalDateTime criadoEm
) {}
