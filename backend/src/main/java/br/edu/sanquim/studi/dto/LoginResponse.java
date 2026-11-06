package br.edu.sanquim.studi.dto;

import br.edu.sanquim.studi.model.PerfilUsuario;

public class LoginResponse {

    private boolean autenticado;
    private String mensagem;
    private Long id;
    private String nome;
    private String email;
    private String usuario;
    private PerfilUsuario perfil;
    private String redirecionamento;

    public LoginResponse() {
    }

    public LoginResponse(boolean autenticado, String mensagem, Long id, String nome, String email, String usuario, PerfilUsuario perfil, String redirecionamento) {
        this.autenticado = autenticado;
        this.mensagem = mensagem;
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.usuario = usuario;
        this.perfil = perfil;
        this.redirecionamento = redirecionamento;
    }

    public static LoginResponse falha(String mensagem) {
        LoginResponse response = new LoginResponse();
        response.setAutenticado(false);
        response.setMensagem(mensagem);
        return response;
    }

    public boolean isAutenticado() {
        return autenticado;
    }

    public void setAutenticado(boolean autenticado) {
        this.autenticado = autenticado;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public PerfilUsuario getPerfil() {
        return perfil;
    }

    public void setPerfil(PerfilUsuario perfil) {
        this.perfil = perfil;
    }

    public String getRedirecionamento() {
        return redirecionamento;
    }

    public void setRedirecionamento(String redirecionamento) {
        this.redirecionamento = redirecionamento;
    }
}
