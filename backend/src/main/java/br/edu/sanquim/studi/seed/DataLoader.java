package br.edu.sanquim.studi.seed;

import br.edu.sanquim.studi.model.*;
import br.edu.sanquim.studi.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    private final UsuarioRepository usuarioRepository;
    private final ProfessorDetalhesRepository professorDetalhesRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final TurmaRepository turmaRepository;
    private final MatriculaRepository matriculaRepository;
    private final ChamadaRepository chamadaRepository;
    private final ChamadaRegistroRepository chamadaRegistroRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final NotaRepository notaRepository;
    private final PlanoAulaRepository planoAulaRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(
            UsuarioRepository usuarioRepository,
            ProfessorDetalhesRepository professorDetalhesRepository,
            DisciplinaRepository disciplinaRepository,
            TurmaRepository turmaRepository,
            MatriculaRepository matriculaRepository,
            ChamadaRepository chamadaRepository,
            ChamadaRegistroRepository chamadaRegistroRepository,
            AvaliacaoRepository avaliacaoRepository,
            NotaRepository notaRepository,
            PlanoAulaRepository planoAulaRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.professorDetalhesRepository = professorDetalhesRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.turmaRepository = turmaRepository;
        this.matriculaRepository = matriculaRepository;
        this.chamadaRepository = chamadaRepository;
        this.chamadaRegistroRepository = chamadaRegistroRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.notaRepository = notaRepository;
        this.planoAulaRepository = planoAulaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info(">>> Verificando carga inicial de dados (Seed) para o Colégio Sanquim...");

        // 1. Gestor
        Usuario gestor = usuarioRepository.findByEmail("admin@sanquim.br").orElseGet(() -> {
            Usuario u = new Usuario("Coordenação Sanquim", "admin@sanquim.br", "admin", passwordEncoder.encode("admin123"), PerfilUsuario.ROLE_GESTAO);
            return usuarioRepository.save(u);
        });

        // 2. Professores
        Usuario prof1 = usuarioRepository.findByEmail("carlos.santos@sanquim.br").orElseGet(() -> {
            Usuario u = new Usuario("Prof. Carlos Santos", "carlos.santos@sanquim.br", "carlos.santos", passwordEncoder.encode("prof123"), PerfilUsuario.ROLE_PROFESSOR);
            Usuario salvo = usuarioRepository.save(u);
            ProfessorDetalhes det = new ProfessorDetalhes();
            det.setUsuarioId(salvo.getId());
            det.setCpf("111.222.333-44");
            det.setTelefone("(19) 98765-4321");
            det.setFormacao("Licenciatura e Bacharelado em Matemática");
            det.setInstituicao("UNICAMP");
            det.setDisciplinasAtuacao("Matemática e Raciocínio Lógico");
            det.setExperiencia("10 anos no ensino pré-vestibular");
            professorDetalhesRepository.save(det);
            return salvo;
        });

        Usuario prof2 = usuarioRepository.findByEmail("ana.oliveira@sanquim.br").orElseGet(() -> {
            Usuario u = new Usuario("Profa. Ana Oliveira", "ana.oliveira@sanquim.br", "ana.oliveira", passwordEncoder.encode("prof123"), PerfilUsuario.ROLE_PROFESSOR);
            Usuario salvo = usuarioRepository.save(u);
            ProfessorDetalhes det = new ProfessorDetalhes();
            det.setUsuarioId(salvo.getId());
            det.setCpf("222.333.444-55");
            det.setTelefone("(19) 98123-4567");
            det.setFormacao("Mestrado em Ensino de Física");
            det.setInstituicao("USP");
            det.setDisciplinasAtuacao("Física Geral e Mecânica");
            det.setExperiencia("8 anos em cursinhos comunitários");
            professorDetalhesRepository.save(det);
            return salvo;
        });

        // Usuários de compatibilidade para formulários antigos
        if (usuarioRepository.findByEmail("aluno@sanquim.edu.br").isEmpty()) {
            usuarioRepository.save(new Usuario("Aluno Teste Geral", "aluno@sanquim.edu.br", "aluno", passwordEncoder.encode("123456"), PerfilUsuario.ROLE_ALUNO));
        }
        if (usuarioRepository.findByEmail("professor@sanquim.edu.br").isEmpty()) {
            usuarioRepository.save(new Usuario("Prof. Convidado", "professor@sanquim.edu.br", "professor", passwordEncoder.encode("123456"), PerfilUsuario.ROLE_PROFESSOR));
        }
        if (usuarioRepository.findByEmail("coordenador@sanquim.edu.br").isEmpty()) {
            usuarioRepository.save(new Usuario("Coordenador Geral", "coordenador@sanquim.edu.br", "coordenador", passwordEncoder.encode("123456"), PerfilUsuario.ROLE_GESTAO));
        }

        // 3. Disciplinas
        Disciplina mat = disciplinaRepository.findByCodigo("MAT001").orElseGet(() -> {
            Disciplina d = new Disciplina();
            d.setNome("Matemática Aplicada");
            d.setCodigo("MAT001");
            d.setCargaHoraria(60);
            d.setCreditos(4);
            d.setPeriodo("2026.1");
            d.setProfessorResponsavel("Prof. Carlos Santos");
            d.setDepartamento("Departamento de Exatas");
            d.setEmenta("Funções polinomiais, progressões, trigonometria, geometria e resolução de provas ENEM e Fuvest.");
            return disciplinaRepository.save(d);
        });

        Disciplina fis = disciplinaRepository.findByCodigo("FIS001").orElseGet(() -> {
            Disciplina d = new Disciplina();
            d.setNome("Física Geral");
            d.setCodigo("FIS001");
            d.setCargaHoraria(80);
            d.setCreditos(5);
            d.setPeriodo("2026.1");
            d.setProfessorResponsavel("Profa. Ana Oliveira");
            d.setDepartamento("Departamento de Exatas");
            d.setEmenta("Cinemática, dinâmica newtoniana, trabalho e energia, eletrostática e óptica para vestibulares.");
            return disciplinaRepository.save(d);
        });

        Disciplina red = disciplinaRepository.findByCodigo("LET001").orElseGet(() -> {
            Disciplina d = new Disciplina();
            d.setNome("Redação e Literatura");
            d.setCodigo("LET001");
            d.setCargaHoraria(60);
            d.setCreditos(4);
            d.setPeriodo("2026.1");
            d.setProfessorResponsavel("Profa. Beatriz Costa");
            d.setDepartamento("Departamento de Humanas");
            d.setEmenta("Produção textual dissertativo-argumentativa nota 1000, repertório sociocultural e análise das obras obrigatórias.");
            return disciplinaRepository.save(d);
        });

        // 4. Turmas
        Turma turmaA = turmaRepository.findByCodigo("MAT-A1").orElseGet(() -> {
            Turma t = new Turma();
            t.setNome("Turma A - Matemática 2026.1");
            t.setCodigo("MAT-A1");
            t.setDisciplinaId(mat.getId());
            t.setDisciplinaNome(mat.getNome());
            t.setProfessorResponsavel("Prof. Carlos Santos");
            t.setPeriodo("2026.1");
            t.setVagas(35);
            t.setVagasOcupadas(5);
            t.setStatus("ATIVA");
            t.setHorario("Seg/Qua 14:00-16:00");
            t.setSala("Sala 101 - Bloco A");
            t.setDataInicio(LocalDate.now().minusWeeks(4));
            t.setDataFim(LocalDate.now().plusMonths(4));
            t.setObservacoes("Turma preparatória focada em vestibulares paulistas e ENEM.");
            return turmaRepository.save(t);
        });

        Turma turmaB = turmaRepository.findByCodigo("FIS-B1").orElseGet(() -> {
            Turma t = new Turma();
            t.setNome("Turma B - Física Vestibular");
            t.setCodigo("FIS-B1");
            t.setDisciplinaId(fis.getId());
            t.setDisciplinaNome(fis.getNome());
            t.setProfessorResponsavel("Profa. Ana Oliveira");
            t.setPeriodo("2026.1");
            t.setVagas(30);
            t.setVagasOcupadas(0);
            t.setStatus("ATIVA");
            t.setHorario("Ter/Qui 16:00-18:00");
            t.setSala("Laboratório 2");
            t.setDataInicio(LocalDate.now().minusWeeks(4));
            t.setDataFim(LocalDate.now().plusMonths(4));
            t.setObservacoes("Turma intensiva de ciências da natureza.");
            return turmaRepository.save(t);
        });

        // 5. 5 Alunos Enturmados na Turma A
        String[][] alunosData = {
                {"João Silva", "joao.silva@sanquim.br", "2026001"},
                {"Maria Santos", "maria.santos@sanquim.br", "2026002"},
                {"Pedro Oliveira", "pedro.oliveira@sanquim.br", "2026003"},
                {"Beatriz Costa", "beatriz.costa@sanquim.br", "2026004"},
                {"Lucas Ferreira", "lucas.ferreira@sanquim.br", "2026005"}
        };

        Long[] alunoIds = new Long[5];

        for (int i = 0; i < alunosData.length; i++) {
            String nome = alunosData[i][0];
            String email = alunosData[i][1];
            String codMat = alunosData[i][2];

            final int idx = i;
            Usuario u = usuarioRepository.findByEmail(email).orElseGet(() -> {
                Usuario novo = new Usuario(nome, email, email.split("@")[0], passwordEncoder.encode("aluno123"), PerfilUsuario.ROLE_ALUNO);
                return usuarioRepository.save(novo);
            });
            alunoIds[idx] = u.getId();

            if (matriculaRepository.findByMatriculaCodigo(codMat).isEmpty()) {
                Matricula m = new Matricula();
                m.setMatriculaCodigo(codMat);
                m.setAlunoNome(nome);
                m.setUsuarioId(u.getId());
                m.setCurso("Pré-Vestibular Sanquim");
                m.setSemestre("2026.1");
                m.setStatus("ativo");
                m.setTurmaId(turmaA.getId());
                matriculaRepository.save(m);
            }
        }

        // 6. Chamada Registrada (com presentes e ausentes)
        LocalDate dataAulaChamada = LocalDate.now().minusDays(2);
        Chamada chamada = chamadaRepository.findByTurmaIdAndDisciplinaIdAndDataAula(turmaA.getId(), mat.getId(), dataAulaChamada)
                .orElseGet(() -> chamadaRepository.save(new Chamada(turmaA.getId(), mat.getId(), dataAulaChamada)));

        boolean[] presencas = {true, true, false, true, true}; // Pedro ausente
        for (int i = 0; i < alunoIds.length; i++) {
            Long alId = alunoIds[i];
            if (chamadaRegistroRepository.findByChamadaIdAndAlunoId(chamada.getId(), alId).isEmpty()) {
                chamadaRegistroRepository.save(new ChamadaRegistro(
                        chamada.getId(),
                        alId,
                        presencas[i],
                        presencas[i] ? "Presente em sala" : "Falta não justificada"
                ));
            }
        }

        // 7. Avaliação e Notas Registradas
        Avaliacao avaliacao = avaliacaoRepository.findByTurmaIdAndDisciplinaId(turmaA.getId(), mat.getId()).stream()
                .findFirst()
                .orElseGet(() -> {
                    Avaliacao a = new Avaliacao(
                            turmaA.getId(),
                            mat.getId(),
                            "Prova 1 - Funções e Geometria Analítica",
                            "PROVA",
                            1.0,
                            10.0,
                            LocalDate.now().minusDays(4),
                            "Avaliação diagnóstica do primeiro ciclo de estudos."
                    );
                    return avaliacaoRepository.save(a);
                });

        double[] notasValores = {9.5, 8.5, 4.5, 9.0, 7.5};
        String[] notasObs = {
                "Excelente raciocínio e demonstrações claras",
                "Ótimo desempenho nas questões discursivas",
                "Necessita reforço nos conceitos fundamentais",
                "Resoluções precisas e ótimo tempo de prova",
                "Bom domínio geral da matéria"
        };

        for (int i = 0; i < alunoIds.length; i++) {
            Long alId = alunoIds[i];
            if (notaRepository.findByAvaliacaoIdAndAlunoId(avaliacao.getId(), alId).isEmpty()) {
                notaRepository.save(new Nota(
                        avaliacao.getId(),
                        alId,
                        notasValores[i],
                        notasObs[i]
                ));
            }
        }

        // 8. Plano de Aula Registrado na Linha do Tempo
        if (planoAulaRepository.findByTurmaId(turmaA.getId()).isEmpty()) {
            PlanoAula p1 = new PlanoAula(
                    turmaA.getId(),
                    mat.getId(),
                    LocalDate.now().minusDays(2),
                    "Funções Polinomiais e Aplicações em Gráficos",
                    "Estudo de raízes, vértice da parábola, interpretação de problemas reais do ENEM.",
                    "Capacitar os estudantes a resolver questões contextualizadas dos vestibulares paulistas e ENEM.",
                    "Apostila Módulo 1, slides interativos e lista com 15 exercícios da Fuvest/Unicamp.",
                    "Excelente participação e engajamento dos discentes."
            );
            planoAulaRepository.save(p1);

            PlanoAula p2 = new PlanoAula(
                    turmaA.getId(),
                    mat.getId(),
                    LocalDate.now().minusWeeks(1),
                    "Introdução a Conjuntos e Funções Elementares",
                    "Noções de conjuntos numéricos, domínio, contradomínio e imagem.",
                    "Compreender a definição formal de relações e funções.",
                    "Livro Didático Cap. 1 e exercícios de fixação.",
                    "Aula introdutória ministrada conforme cronograma."
            );
            planoAulaRepository.save(p2);
        }

        log.info(">>> Seed concluído com sucesso! Gestor: admin@sanquim.br (admin123) | Professores: prof123 | Alunos: aluno123");
    }
}
