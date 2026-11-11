package br.edu.sanquim.studi.dto;

public record AuthLoginResponse(
        String token,
        String tipo,
        long expiraEm,
        String perfil,
        UsuarioDTO usuario
) {
    public static AuthLoginResponse of(String token, long expiraEm, String perfil, UsuarioDTO usuario) {
        return new AuthLoginResponse(token, "Bearer", expiraEm, perfil, usuario);
    }
}
