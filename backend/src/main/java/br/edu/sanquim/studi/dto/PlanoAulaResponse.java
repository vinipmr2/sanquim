package br.edu.sanquim.studi.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PlanoAulaResponse(
        Long id,
        Long turmaId,
        String turmaNome,
        Long disciplinaId,
        String disciplinaNome,
        LocalDate dataAula,
        String titulo,
        String topicos,
        String objetivos,
        String materiaisApoio,
        String observacoes,
        LocalDateTime criadoEm
) {}
