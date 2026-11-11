package br.edu.sanquim.studi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "chamada_registro", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"chamada_id", "aluno_id"})
})
public class ChamadaRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "chamada_id", nullable = false)
    private Long chamadaId;

    @Column(name = "aluno_id", nullable = false)
    private Long alunoId;

    @Column(nullable = false)
    private Boolean presente = true;

    @Column(length = 255)
    private String observacao;

    public ChamadaRegistro() {
    }

    public ChamadaRegistro(Long chamadaId, Long alunoId, Boolean presente, String observacao) {
        this.chamadaId = chamadaId;
        this.alunoId = alunoId;
        this.presente = presente != null ? presente : true;
        this.observacao = observacao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChamadaId() {
        return chamadaId;
    }

    public void setChamadaId(Long chamadaId) {
        this.chamadaId = chamadaId;
    }

    public Long getAlunoId() {
        return alunoId;
    }

    public void setAlunoId(Long alunoId) {
        this.alunoId = alunoId;
    }

    public Boolean getPresente() {
        return presente;
    }

    public void setPresente(Boolean presente) {
        this.presente = presente;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
