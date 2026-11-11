package br.edu.sanquim.studi.dto;

import java.time.LocalDateTime;

public record MatriculaResponse(
        Long id,
        String matriculaCodigo,
        String alunoNome,
        Long usuarioId,
        String curso,
        String semestre,
        String status,
        Long turmaId,
        String turmaNome,
        LocalDateTime criadoEm
) {}
