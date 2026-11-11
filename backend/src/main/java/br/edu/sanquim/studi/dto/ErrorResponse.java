package br.edu.sanquim.studi.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String erro,
        String mensagem,
        String path,
        List<CampoErroDTO> campos
) {
    public static ErrorResponse build(int status, String erro, String mensagem, String path) {
        return new ErrorResponse(LocalDateTime.now(), status, erro, mensagem, path, null);
    }

    public static ErrorResponse buildComCampos(int status, String erro, String mensagem, String path, List<CampoErroDTO> campos) {
        return new ErrorResponse(LocalDateTime.now(), status, erro, mensagem, path, campos);
    }
}
