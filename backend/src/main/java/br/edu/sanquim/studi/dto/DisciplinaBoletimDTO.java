package br.edu.sanquim.studi.dto;

import java.util.List;

public record DisciplinaBoletimDTO(
        Long disciplinaId,
        String disciplinaNome,
        String professorResponsavel,
        List<AvaliacaoNotaDTO> avaliacoes,
        Double mediaParcial,
        String situacao
) {}
