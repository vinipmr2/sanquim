package br.edu.sanquim.studi.service;

import br.edu.sanquim.studi.dto.*;
import br.edu.sanquim.studi.exception.EntidadeJaExisteException;
import br.edu.sanquim.studi.exception.RecursoNaoEncontradoException;
import br.edu.sanquim.studi.exception.RegraDeNegocioException;
import br.edu.sanquim.studi.model.*;
import br.edu.sanquim.studi.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final ProfessorDetalhesRepository professorDetalhesRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final TurmaRepository turmaRepository;
    private final MatriculaRepository matriculaRepository;
    private final ChamadaRepository chamadaRepository;
    private final ChamadaRegistroRepository chamadaRegistroRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(
            UsuarioRepository usuarioRepository,
            ProfessorDetalhesRepository professorDetalhesRepository,
            DisciplinaRepository disciplinaRepository,
            TurmaRepository turmaRepository,
            MatriculaRepository matriculaRepository,
            ChamadaRepository chamadaRepository,
            ChamadaRegistroRepository chamadaRegistroRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.professorDetalhesRepository = professorDetalhesRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.turmaRepository = turmaRepository;
        this.matriculaRepository = matriculaRepository;
        this.chamadaRepository = chamadaRepository;
        this.chamadaRegistroRepository = chamadaRegistroRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- Professores ---

    @Transactional
    public ProfessorResponse cadastrarProfessor(ProfessorRequest req) {
        if (usuarioRepository.existsByEmail(req.email())) {
            throw new EntidadeJaExisteException("Já existe um usuário cadastrado com este e-mail: " + req.email());
        }

        if (req.cpf() != null && !req.cpf().isBlank() && professorDetalhesRepository.findByCpf(req.cpf()).isPresent()) {
            throw new EntidadeJaExisteException("Já existe um professor cadastrado com este CPF: " + req.cpf());
        }

        String rawSenha = (req.senha() != null && !req.senha().isBlank()) ? req.senha() : "123456";
        Usuario usuario = new Usuario(
                req.nome(),
                req.email(),
                req.email(),
                passwordEncoder.encode(rawSenha),
                PerfilUsuario.ROLE_PROFESSOR
        );
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        ProfessorDetalhes detalhes = new ProfessorDetalhes();
        detalhes.setUsuarioId(usuarioSalvo.getId());
        detalhes.setCpf(req.cpf());
        detalhes.setTelefone(req.telefone());
        detalhes.setFormacao(req.formacao());
        detalhes.setInstituicao(req.instituicao());
        detalhes.setDisciplinasAtuacao(req.disciplinasAtuacao());
        detalhes.setExperiencia(req.experiencia());
        detalhes.setRegistroProfissional(req.registroProfissional());
        detalhes.setExperienciaDetalhada(req.experienciaDetalhada());

        ProfessorDetalhes detalhesSalvo = professorDetalhesRepository.save(detalhes);

        return toProfessorResponse(usuarioSalvo, detalhesSalvo);
    }

    @Transactional(readOnly = true)
    public List<ProfessorResponse> listarProfessores() {
        List<Usuario> profs = usuarioRepository.findByPerfilIn(List.of(
                PerfilUsuario.ROLE_PROFESSOR,
                PerfilUsuario.PROFESSOR
        ));

        List<ProfessorResponse> result = new ArrayList<>();
        for (Usuario u : profs) {
            ProfessorDetalhes det = professorDetalhesRepository.findByUsuarioId(u.getId()).orElse(null);
            result.add(toProfessorResponse(u, det));
        }
        return result;
    }

    private ProfessorResponse toProfessorResponse(Usuario u, ProfessorDetalhes d) {
        return new ProfessorResponse(
                d != null ? d.getId() : u.getId(),
                u.getId(),
                u.getNome(),
                u.getEmail(),
                d != null ? d.getCpf() : null,
                d != null ? d.getTelefone() : null,
                d != null ? d.getFormacao() : null,
                d != null ? d.getInstituicao() : null,
                d != null ? d.getDisciplinasAtuacao() : null,
                d != null ? d.getExperiencia() : null,
                u.getAtivo(),
                u.getCriadoEm()
        );
    }

    // --- Alunos ---

    @Transactional
    public AlunoResponse cadastrarAluno(AlunoRequest req) {
        if (usuarioRepository.existsByEmail(req.email())) {
            throw new EntidadeJaExisteException("Já existe um usuário cadastrado com este e-mail: " + req.email());
        }

        String rawSenha = (req.senha() != null && !req.senha().isBlank()) ? req.senha() : "123456";
        Usuario usuario = new Usuario(
                req.nome(),
                req.email(),
                req.email(),
                passwordEncoder.encode(rawSenha),
                PerfilUsuario.ROLE_ALUNO
        );
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        String matCodigo = (req.matriculaCodigo() != null && !req.matriculaCodigo().isBlank())
                ? req.matriculaCodigo()
                : "MAT-" + System.currentTimeMillis();

        if (matriculaRepository.findByMatriculaCodigo(matCodigo).isPresent()) {
            matCodigo = "MAT-" + System.currentTimeMillis();
        }

        Turma turma = null;
        if (req.turmaId() != null) {
            turma = turmaRepository.findById(req.turmaId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Turma não encontrada para o ID: " + req.turmaId()));

            if (turma.getVagasOcupadas() >= turma.getVagas()) {
                throw new RegraDeNegocioException("A turma selecionada já atingiu o limite de vagas disponíveis.");
            }
            turma.setVagasOcupadas(turma.getVagasOcupadas() + 1);
            turmaRepository.save(turma);
        }

        Matricula matricula = new Matricula();
        matricula.setMatriculaCodigo(matCodigo);
        matricula.setAlunoNome(usuarioSalvo.getNome());
        matricula.setUsuarioId(usuarioSalvo.getId());
        matricula.setCurso(req.curso() != null ? req.curso() : "Pré-Vestibular Geral");
        matricula.setSemestre(req.semestre() != null ? req.semestre() : "2026.1");
        matricula.setStatus("ativo");
        matricula.setTurmaId(turma != null ? turma.getId() : null);

        Matricula matriculaSalva = matriculaRepository.save(matricula);

        return toAlunoResponse(usuarioSalvo, matriculaSalva, turma != null ? turma.getNome() : null);
    }

    @Transactional(readOnly = true)
    public List<AlunoResponse> listarAlunos() {
        List<Usuario> alunos = usuarioRepository.findByPerfilIn(List.of(
                PerfilUsuario.ROLE_ALUNO,
                PerfilUsuario.ALUNO
        ));

        Map<Long, Turma> turmaMap = new HashMap<>();
        turmaRepository.findAll().forEach(t -> turmaMap.put(t.getId(), t));

        List<AlunoResponse> result = new ArrayList<>();
        for (Usuario u : alunos) {
            List<Matricula> mats = matriculaRepository.findByUsuarioId(u.getId());
            Matricula m = mats.isEmpty() ? null : mats.get(0);
            String turmaNome = null;
            if (m != null && m.getTurmaId() != null && turmaMap.containsKey(m.getTurmaId())) {
                turmaNome = turmaMap.get(m.getTurmaId()).getNome();
            }
            result.add(toAlunoResponse(u, m, turmaNome));
        }
        return result;
    }

    private AlunoResponse toAlunoResponse(Usuario u, Matricula m, String turmaNome) {
        return new AlunoResponse(
                m != null ? m.getId() : u.getId(),
                u.getId(),
                u.getNome(),
                u.getEmail(),
                m != null ? m.getMatriculaCodigo() : null,
                m != null ? m.getCurso() : "Pré-Vestibular Geral",
                m != null ? m.getSemestre() : "2026.1",
                m != null ? m.getStatus() : "ativo",
                m != null ? m.getTurmaId() : null,
                turmaNome,
                u.getCriadoEm()
        );
    }

    // --- Turmas ---

    @Transactional
    public TurmaResponse cadastrarTurma(TurmaRequest req) {
        if (turmaRepository.existsByCodigo(req.codigo())) {
            throw new EntidadeJaExisteException("Já existe uma turma cadastrada com este código: " + req.codigo());
        }

        String discNome = req.disciplinaNome();
        if (req.disciplinaId() != null) {
            Disciplina d = disciplinaRepository.findById(req.disciplinaId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Disciplina não encontrada para o ID: " + req.disciplinaId()));
            discNome = d.getNome();
        }

        Turma turma = new Turma();
        turma.setNome(req.nome());
        turma.setCodigo(req.codigo());
        turma.setDisciplinaId(req.disciplinaId());
        turma.setDisciplinaNome(discNome);
        turma.setProfessorResponsavel(req.professorResponsavel());
        turma.setPeriodo(req.periodo());
        turma.setVagas(req.vagas());
        turma.setVagasOcupadas(0);
        turma.setStatus("ATIVA");
        turma.setHorario(req.horario());
        turma.setSala(req.sala());
        turma.setDataInicio(req.dataInicio());
        turma.setDataFim(req.dataFim());
        turma.setObservacoes(req.observacoes());

        Turma salva = turmaRepository.save(turma);
        return toTurmaResponse(salva);
    }

    @Transactional(readOnly = true)
    public List<TurmaResponse> listarTurmas() {
        return turmaRepository.findAll().stream()
                .map(this::toTurmaResponse)
                .toList();
    }

    public TurmaResponse toTurmaResponse(Turma t) {
        return new TurmaResponse(
                t.getId(),
                t.getNome(),
                t.getCodigo(),
                t.getDisciplinaId(),
                t.getDisciplinaNome(),
                t.getProfessorResponsavel(),
                t.getPeriodo(),
                t.getVagas(),
                t.getVagasOcupadas(),
                t.getStatus(),
                t.getHorario(),
                t.getSala(),
                t.getDataInicio(),
                t.getDataFim(),
                t.getObservacoes(),
                t.getCriadoEm()
        );
    }

    // --- Disciplinas ---

    @Transactional
    public DisciplinaResponse cadastrarDisciplina(DisciplinaRequest req) {
        if (disciplinaRepository.existsByCodigo(req.codigo())) {
            throw new EntidadeJaExisteException("Já existe uma disciplina cadastrada com este código: " + req.codigo());
        }

        Disciplina d = new Disciplina();
        d.setNome(req.nome());
        d.setCodigo(req.codigo());
        d.setCargaHoraria(req.cargaHoraria());
        d.setCreditos(req.creditos() != null ? req.creditos() : (req.cargaHoraria() / 15));
        d.setPeriodo(req.periodo() != null ? req.periodo() : "2026.1");
        d.setProfessorResponsavel(req.professorResponsavel());
        d.setDepartamento(req.departamento());
        d.setEmenta(req.ementa());

        Disciplina salva = disciplinaRepository.save(d);
        return toDisciplinaResponse(salva);
    }

    @Transactional(readOnly = true)
    public List<DisciplinaResponse> listarDisciplinas() {
        return disciplinaRepository.findAll().stream()
                .map(this::toDisciplinaResponse)
                .toList();
    }

    public DisciplinaResponse toDisciplinaResponse(Disciplina d) {
        return new DisciplinaResponse(
                d.getId(),
                d.getNome(),
                d.getCodigo(),
                d.getCargaHoraria(),
                d.getCreditos(),
                d.getPeriodo(),
                d.getProfessorResponsavel(),
                d.getDepartamento(),
                d.getEmenta(),
                d.getCriadoEm()
        );
    }

    // --- Matrículas ---

    @Transactional
    public MatriculaResponse realizarMatricula(MatriculaRequest req) {
        Turma turma = turmaRepository.findById(req.turmaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Turma não encontrada para o ID: " + req.turmaId()));

        if (turma.getVagasOcupadas() >= turma.getVagas()) {
            throw new RegraDeNegocioException("Não há vagas disponíveis na turma: " + turma.getNome());
        }

        String matCodigo = (req.matriculaCodigo() != null && !req.matriculaCodigo().isBlank())
                ? req.matriculaCodigo()
                : "MAT-" + System.currentTimeMillis();

        if (matriculaRepository.findByMatriculaCodigo(matCodigo).isPresent()) {
            throw new EntidadeJaExisteException("Já existe uma matrícula cadastrada com este código: " + matCodigo);
        }

        Matricula m = new Matricula();
        m.setMatriculaCodigo(matCodigo);
        m.setAlunoNome(req.alunoNome());
        m.setUsuarioId(req.usuarioId());
        m.setCurso(req.curso());
        m.setSemestre(req.semestre());
        m.setStatus(req.status() != null ? req.status() : "ativo");
        m.setTurmaId(turma.getId());

        Matricula salva = matriculaRepository.save(m);

        turma.setVagasOcupadas(turma.getVagasOcupadas() + 1);
        turmaRepository.save(turma);

        return toMatriculaResponse(salva, turma.getNome());
    }

    @Transactional(readOnly = true)
    public List<MatriculaResponse> listarMatriculas() {
        Map<Long, Turma> turmaMap = new HashMap<>();
        turmaRepository.findAll().forEach(t -> turmaMap.put(t.getId(), t));

        return matriculaRepository.findAll().stream()
                .map(m -> {
                    String tNome = (m.getTurmaId() != null && turmaMap.containsKey(m.getTurmaId()))
                            ? turmaMap.get(m.getTurmaId()).getNome()
                            : null;
                    return toMatriculaResponse(m, tNome);
                })
                .toList();
    }

    public MatriculaResponse toMatriculaResponse(Matricula m, String turmaNome) {
        return new MatriculaResponse(
                m.getId(),
                m.getMatriculaCodigo(),
                m.getAlunoNome(),
                m.getUsuarioId(),
                m.getCurso(),
                m.getSemestre(),
                m.getStatus(),
                m.getTurmaId(),
                turmaNome,
                m.getCriadoEm()
        );
    }

    // --- Estatísticas & Alertas de Evasão (US07, US08) ---

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long alunos = usuarioRepository.findByPerfilIn(List.of(PerfilUsuario.ROLE_ALUNO, PerfilUsuario.ALUNO)).size();
        long profs = usuarioRepository.findByPerfilIn(List.of(PerfilUsuario.ROLE_PROFESSOR, PerfilUsuario.PROFESSOR)).size();
        long turmas = turmaRepository.count();
        long disciplinas = disciplinaRepository.count();

        List<ChamadaRegistro> registros = chamadaRegistroRepository.findAll();
        double mediaFrequencia = 100.0;
        if (!registros.isEmpty()) {
            long presentes = registros.stream().filter(r -> Boolean.TRUE.equals(r.getPresente())).count();
            mediaFrequencia = Math.round((presentes * 100.0 / registros.size()) * 10.0) / 10.0;
        }

        List<AlertaEvasaoResponse> alertas = getAlertasEvasao();

        return new DashboardStatsResponse(
                alunos,
                profs,
                turmas,
                disciplinas,
                mediaFrequencia,
                alertas.size()
        );
    }

    @Transactional(readOnly = true)
    public List<AlertaEvasaoResponse> getAlertasEvasao() {
        List<Usuario> alunos = usuarioRepository.findByPerfilIn(List.of(PerfilUsuario.ROLE_ALUNO, PerfilUsuario.ALUNO));
        Map<Long, Turma> turmaMap = new HashMap<>();
        turmaRepository.findAll().forEach(t -> turmaMap.put(t.getId(), t));

        List<AlertaEvasaoResponse> alertas = new ArrayList<>();

        for (Usuario aluno : alunos) {
            List<ChamadaRegistro> regs = chamadaRegistroRepository.findByAlunoId(aluno.getId());
            if (regs.isEmpty()) continue;

            long total = regs.size();
            long faltas = regs.stream().filter(r -> Boolean.FALSE.equals(r.getPresente())).count();
            double pct = Math.round(((total - faltas) * 100.0 / total) * 10.0) / 10.0;

            if (pct < 75.0 || faltas >= 3) {
                String tNome = "Sem turma";
                List<Matricula> mats = matriculaRepository.findByUsuarioId(aluno.getId());
                if (!mats.isEmpty() && mats.get(0).getTurmaId() != null && turmaMap.containsKey(mats.get(0).getTurmaId())) {
                    tNome = turmaMap.get(mats.get(0).getTurmaId()).getNome();
                }

                String risco = pct < 60.0 ? "CRÍTICO" : "ALTO";
                String rec = pct < 60.0
                        ? "Entrar em contato imediatamente via telefone/responsável para reagendamento e apoio pedagógico."
                        : "Enviar notificação de advertência e propor tutoria de recuperação.";

                alertas.add(new AlertaEvasaoResponse(
                        aluno.getId(),
                        aluno.getNome(),
                        aluno.getEmail(),
                        tNome,
                        faltas,
                        pct,
                        risco,
                        rec
                ));
            }
        }

        alertas.sort((a, b) -> Double.compare(a.percentualFrequencia(), b.percentualFrequencia()));
        return alertas;
    }
}
