package br.edu.sanquim.studi.dto;

import java.util.List;

public record FrequenciaResponse(
        Long alunoId,
        String alunoNome,
        double percentualGlobal,
        int totalAulas,
        int totalPresencas,
        int totalFaltas,
        List<DisciplinaFrequenciaDTO> disciplinas
) {}
