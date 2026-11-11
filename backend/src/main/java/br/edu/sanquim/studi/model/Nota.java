package br.edu.sanquim.studi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nota", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"avaliacao_id", "aluno_id"})
})
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "avaliacao_id", nullable = false)
    private Long avaliacaoId;

    @Column(name = "aluno_id", nullable = false)
    private Long alunoId;

    @Column(nullable = false)
    private Double valor;

    @Column(length = 255)
    private String observacao;

    @Column(name = "data_lancamento")
    private LocalDateTime dataLancamento;

    public Nota() {
    }

    public Nota(Long avaliacaoId, Long alunoId, Double valor, String observacao) {
        this.avaliacaoId = avaliacaoId;
        this.alunoId = alunoId;
        this.valor = valor;
        this.observacao = observacao;
    }

    @PrePersist
    @PreUpdate
    public void onSave() {
        this.dataLancamento = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAvaliacaoId() {
        return avaliacaoId;
    }

    public void setAvaliacaoId(Long avaliacaoId) {
        this.avaliacaoId = avaliacaoId;
    }

    public Long getAlunoId() {
        return alunoId;
    }

    public void setAlunoId(Long alunoId) {
        this.alunoId = alunoId;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public LocalDateTime getDataLancamento() {
        return dataLancamento;
    }

    public void setDataLancamento(LocalDateTime dataLancamento) {
        this.dataLancamento = dataLancamento;
    }
}
