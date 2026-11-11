package br.edu.sanquim.studi.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ChamadaResponse(
        Long id,
        Long turmaId,
        String turmaNome,
        Long disciplinaId,
        String disciplinaNome,
        LocalDate dataAula,
        int totalAlunos,
        int totalPresentes,
        int totalAusentes,
        List<ChamadaRegistroItem> registros,
        LocalDateTime criadoEm
) {}
