package br.edu.sanquim.studi.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TurmaResponse(
        Long id,
        String nome,
        String codigo,
        Long disciplinaId,
        String disciplinaNome,
        String professorResponsavel,
        String periodo,
        Integer vagas,
        Integer vagasOcupadas,
        String status,
        String horario,
        String sala,
        LocalDate dataInicio,
        LocalDate dataFim,
        String observacoes,
        LocalDateTime criadoEm
) {}
