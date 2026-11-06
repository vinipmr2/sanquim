package br.edu.sanquim.studi.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "professor_detalhes")
public class ProfessorDetalhes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(length = 20)
    private String cpf;

    @Column(length = 30)
    private String telefone;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 30)
    private String genero;

    @Column(columnDefinition = "TEXT")
    private String endereco;

    @Column(length = 200)
    private String formacao;

    @Column(length = 200)
    private String instituicao;

    @Column(name = "disciplinas_atuacao", columnDefinition = "TEXT")
    private String disciplinasAtuacao;

    @Column(length = 50)
    private String experiencia;

    @Column(name = "registro_profissional", length = 100)
    private String registroProfissional;

    @Column(name = "experiencia_detalhada", columnDefinition = "TEXT")
    private String experienciaDetalhada;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    public ProfessorDetalhes() {
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

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getFormacao() {
        return formacao;
    }

    public void setFormacao(String formacao) {
        this.formacao = formacao;
    }

    public String getInstituicao() {
        return instituicao;
    }

    public void setInstituicao(String instituicao) {
        this.instituicao = instituicao;
    }

    public String getDisciplinasAtuacao() {
        return disciplinasAtuacao;
    }

    public void setDisciplinasAtuacao(String disciplinasAtuacao) {
        this.disciplinasAtuacao = disciplinasAtuacao;
    }

    public String getExperiencia() {
        return experiencia;
    }

    public void setExperiencia(String experiencia) {
        this.experiencia = experiencia;
    }

    public String getRegistroProfissional() {
        return registroProfissional;
    }

    public void setRegistroProfissional(String registroProfissional) {
        this.registroProfissional = registroProfissional;
    }

    public String getExperienciaDetalhada() {
        return experienciaDetalhada;
    }

    public void setExperienciaDetalhada(String experienciaDetalhada) {
        this.experienciaDetalhada = experienciaDetalhada;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
