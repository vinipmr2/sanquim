package br.edu.sanquim.studi.dto;

public record DashboardStatsResponse(
        long totalAlunos,
        long totalProfessores,
        long totalTurmas,
        long totalDisciplinas,
        double taxaMediaFrequencia,
        long totalAlunosRisco
) {}
