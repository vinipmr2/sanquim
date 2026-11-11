package br.edu.sanquim.studi.dto;

import java.util.List;

public record BoletimResponse(
        Long alunoId,
        String alunoNome,
        String email,
        String matriculaCodigo,
        String turmaNome,
        List<DisciplinaBoletimDTO> disciplinas,
        Double mediaGeral
) {}
