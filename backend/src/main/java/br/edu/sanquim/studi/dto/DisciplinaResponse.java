package br.edu.sanquim.studi.dto;

import java.time.LocalDateTime;

public record DisciplinaResponse(
        Long id,
        String nome,
        String codigo,
        Integer cargaHoraria,
        Integer creditos,
        String periodo,
        String professorResponsavel,
        String departamento,
        String ementa,
        LocalDateTime criadoEm
) {}
