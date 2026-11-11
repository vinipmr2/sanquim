package br.edu.sanquim.studi.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthLoginRequest(
        @NotBlank(message = "O e-mail ou nome de usuário é obrigatório.")
        String email,

        @NotBlank(message = "A senha é obrigatória.")
        String senha
) {
    public String getUsernameOrEmail() {
        return email;
    }
}
