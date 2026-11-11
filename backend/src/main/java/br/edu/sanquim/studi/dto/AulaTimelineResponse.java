package br.edu.sanquim.studi.dto;

import java.time.LocalDate;

public record AulaTimelineResponse(
        Long id,
        Long turmaId,
        String turmaNome,
        Long disciplinaId,
        String disciplinaNome,
        String professorResponsavel,
        LocalDate dataAula,
        String titulo,
        String topicos,
        String objetivos,
        String materiaisApoio,
        String observacoes
) {}
