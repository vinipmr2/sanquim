package br.edu.sanquim.studi.dto;

import java.time.LocalDateTime;

public record UsuarioDTO(
        Long id,
        String nome,
        String email,
        String usuario,
        String perfil,
        Boolean ativo,
        LocalDateTime criadoEm
) {}
