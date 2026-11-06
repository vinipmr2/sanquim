package br.edu.sanquim.studi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matricula")
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "matricula_codigo", nullable = false, unique = true, length = 50)
    private String matriculaCodigo;

    @Column(name = "aluno_nome", nullable = false, length = 150)
    private String alunoNome;

    @Column(nullable = false, length = 150)
    private String curso;

    @Column(nullable = false, length = 20)
    private String semestre;

    @Column(nullable = false, length = 20)
    private String status = "ativo";

    @Column(name = "turma_id")
    private Long turmaId;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    public Matricula() {
    }

    @PrePersist
    public void prePersist() {
        this.criadoEm = LocalDateTime.now();
        if (this.status == null) this.status = "ativo";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatriculaCodigo() {
        return matriculaCodigo;
    }

    public void setMatriculaCodigo(String matriculaCodigo) {
        this.matriculaCodigo = matriculaCodigo;
    }

    public String getAlunoNome() {
        return alunoNome;
    }

    public void setAlunoNome(String alunoNome) {
        this.alunoNome = alunoNome;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public String getSemestre() {
        return semestre;
    }

    public void setSemestre(String semestre) {
        this.semestre = semestre;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getTurmaId() {
        return turmaId;
    }

    public void setTurmaId(Long turmaId) {
        this.turmaId = turmaId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
