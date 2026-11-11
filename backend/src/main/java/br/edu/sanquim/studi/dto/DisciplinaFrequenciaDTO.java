package br.edu.sanquim.studi.dto;

public record DisciplinaFrequenciaDTO(
        Long disciplinaId,
        String disciplinaNome,
        String professorResponsavel,
        int totalAulas,
        int presencas,
        int faltas,
        double percentual,
        String situacao
) {}
