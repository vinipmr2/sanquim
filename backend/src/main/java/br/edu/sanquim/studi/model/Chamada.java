package br.edu.sanquim.studi.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "chamada", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"turma_id", "disciplina_id", "data_aula"})
})
public class Chamada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "turma_id", nullable = false)
    private Long turmaId;

    @Column(name = "disciplina_id", nullable = false)
    private Long disciplinaId;

    @Column(name = "data_aula", nullable = false)
    private LocalDate dataAula;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    public Chamada() {
    }

    public Chamada(Long turmaId, Long disciplinaId, LocalDate dataAula) {
        this.turmaId = turmaId;
        this.disciplinaId = disciplinaId;
        this.dataAula = dataAula;
    }

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTurmaId() {
        return turmaId;
    }

    public void setTurmaId(Long turmaId) {
        this.turmaId = turmaId;
    }

    public Long getDisciplinaId() {
        return disciplinaId;
    }

    public void setDisciplinaId(Long disciplinaId) {
        this.disciplinaId = disciplinaId;
    }

    public LocalDate getDataAula() {
        return dataAula;
    }

    public void setDataAula(LocalDate dataAula) {
        this.dataAula = dataAula;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
