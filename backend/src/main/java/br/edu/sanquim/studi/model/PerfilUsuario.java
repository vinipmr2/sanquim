package br.edu.sanquim.studi.model;

public enum PerfilUsuario {
    ROLE_GESTAO,
    ROLE_PROFESSOR,
    ROLE_ALUNO,
    // Compatibilidade com cadastros antigos:
    ADMIN,
    COORDENADOR,
    PROFESSOR,
    ALUNO;

    public String getRoleName() {
        return switch (this) {
            case ROLE_GESTAO, ADMIN, COORDENADOR -> "ROLE_GESTAO";
            case ROLE_PROFESSOR, PROFESSOR -> "ROLE_PROFESSOR";
            case ROLE_ALUNO, ALUNO -> "ROLE_ALUNO";
        };
    }

    public static PerfilUsuario fromString(String perfil) {
        if (perfil == null) return ROLE_ALUNO;
        String p = perfil.trim().toUpperCase();
        if (p.equals("ROLE_GESTAO") || p.equals("GESTAO") || p.equals("ADMIN") || p.equals("COORDENADOR")) {
            return ROLE_GESTAO;
        }
        if (p.equals("ROLE_PROFESSOR") || p.equals("PROFESSOR")) {
            return ROLE_PROFESSOR;
        }
        return ROLE_ALUNO;
    }
}
