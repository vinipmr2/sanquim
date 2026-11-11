package br.edu.sanquim.studi.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "avaliacao")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "turma_id", nullable = false)
    private Long turmaId;

    @Column(name = "disciplina_id", nullable = false)
    private Long disciplinaId;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(length = 50)
    private String tipo = "PROVA"; // PROVA, TRABALHO, SEMINARIO, SIMULADO

    @Column(nullable = false)
    private Double peso = 1.0;

    @Column(name = "nota_maxima", nullable = false)
    private Double notaMaxima = 10.0;

    @Column(name = "data_entrega")
    private LocalDate dataEntrega;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    public Avaliacao() {
    }

    public Avaliacao(Long turmaId, Long disciplinaId, String titulo, String tipo, Double peso, Double notaMaxima, LocalDate dataEntrega, String descricao) {
        this.turmaId = turmaId;
        this.disciplinaId = disciplinaId;
        this.titulo = titulo;
        this.tipo = tipo != null ? tipo : "PROVA";
        this.peso = peso != null ? peso : 1.0;
        this.notaMaxima = notaMaxima != null ? notaMaxima : 10.0;
        this.dataEntrega = dataEntrega;
        this.descricao = descricao;
    }

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.peso == null) this.peso = 1.0;
        if (this.notaMaxima == null) this.notaMaxima = 10.0;
        if (this.tipo == null) this.tipo = "PROVA";
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

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public Double getNotaMaxima() {
        return notaMaxima;
    }

    public void setNotaMaxima(Double notaMaxima) {
        this.notaMaxima = notaMaxima;
    }

    public LocalDate getDataEntrega() {
        return dataEntrega;
    }

    public void setDataEntrega(LocalDate dataEntrega) {
        this.dataEntrega = dataEntrega;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
