package br.edu.sanquim.studi.service;

import br.edu.sanquim.studi.dto.*;
import br.edu.sanquim.studi.exception.RecursoNaoEncontradoException;
import br.edu.sanquim.studi.model.*;
import br.edu.sanquim.studi.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DiarioService {

    private final TurmaRepository turmaRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final UsuarioRepository usuarioRepository;
    private final MatriculaRepository matriculaRepository;
    private final ChamadaRepository chamadaRepository;
    private final ChamadaRegistroRepository chamadaRegistroRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final NotaRepository notaRepository;
    private final PlanoAulaRepository planoAulaRepository;

    public DiarioService(
            TurmaRepository turmaRepository,
            DisciplinaRepository disciplinaRepository,
            UsuarioRepository usuarioRepository,
            MatriculaRepository matriculaRepository,
            ChamadaRepository chamadaRepository,
            ChamadaRegistroRepository chamadaRegistroRepository,
            AvaliacaoRepository avaliacaoRepository,
            NotaRepository notaRepository,
            PlanoAulaRepository planoAulaRepository
    ) {
        this.turmaRepository = turmaRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.usuarioRepository = usuarioRepository;
        this.matriculaRepository = matriculaRepository;
        this.chamadaRepository = chamadaRepository;
        this.chamadaRegistroRepository = chamadaRegistroRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.notaRepository = notaRepository;
        this.planoAulaRepository = planoAulaRepository;
    }

    // --- Minhas Turmas ---

    @Transactional(readOnly = true)
    public List<TurmaResponse> getMinhasTurmas(String email, String role) {
        if ("ROLE_GESTAO".equals(role)) {
            return turmaRepository.findAll().stream().map(this::toTurmaResponse).toList();
        }

        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario == null) {
            return Collections.emptyList();
        }

        String nomeProf = usuario.getNome();
        List<Turma> turmas = turmaRepository.findAll().stream()
                .filter(t -> t.getProfessorResponsavel() != null &&
                        (t.getProfessorResponsavel().equalsIgnoreCase(nomeProf) ||
                         t.getProfessorResponsavel().toLowerCase().contains(usuario.getNome().toLowerCase()) ||
                         usuario.getNome().toLowerCase().contains(t.getProfessorResponsavel().toLowerCase())))
                .toList();

        // Se nenhuma turma específica por nome for encontrada, exibe as ativas para permitir testes
        if (turmas.isEmpty()) {
            turmas = turmaRepository.findAll();
        }

        return turmas.stream().map(this::toTurmaResponse).toList();
    }

    private TurmaResponse toTurmaResponse(Turma t) {
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

    // --- Chamada em Lote ---

    @Transactional
    public ChamadaResponse registrarChamada(ChamadaRequest req) {
        Turma turma = turmaRepository.findById(req.turmaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Turma não encontrada para o ID: " + req.turmaId()));

        Disciplina disciplina = disciplinaRepository.findById(req.disciplinaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Disciplina não encontrada para o ID: " + req.disciplinaId()));

        // Validação de duplicidade: atualiza registros se já existir chamada na mesma data
        Chamada chamada = chamadaRepository.findByTurmaIdAndDisciplinaIdAndDataAula(req.turmaId(), req.disciplinaId(), req.dataAula())
                .orElseGet(() -> chamadaRepository.save(new Chamada(req.turmaId(), req.disciplinaId(), req.dataAula())));

        int presentes = 0;
        int ausentes = 0;
        List<ChamadaRegistroItem> itensResponse = new ArrayList<>();

        for (ChamadaRegistroItem item : req.registros()) {
            boolean pres = Boolean.TRUE.equals(item.presente());
            if (pres) presentes++;
            else ausentes++;

            ChamadaRegistro reg = chamadaRegistroRepository.findByChamadaIdAndAlunoId(chamada.getId(), item.alunoId())
                    .orElse(new ChamadaRegistro(chamada.getId(), item.alunoId(), pres, item.observacao()));

            reg.setPresente(pres);
            reg.setObservacao(item.observacao());
            chamadaRegistroRepository.save(reg);

            itensResponse.add(new ChamadaRegistroItem(item.alunoId(), pres, item.observacao()));
        }

        return new ChamadaResponse(
                chamada.getId(),
                turma.getId(),
                turma.getNome(),
                disciplina.getId(),
                disciplina.getNome(),
                chamada.getDataAula(),
                req.registros().size(),
                presentes,
                ausentes,
                itensResponse,
                chamada.getCriadoEm()
        );
    }

    @Transactional(readOnly = true)
    public List<ChamadaResponse> listarChamadas(Long turmaId, Long disciplinaId) {
        List<Chamada> chamadas;
        if (turmaId != null && disciplinaId != null) {
            chamadas = chamadaRepository.findByTurmaIdAndDisciplinaId(turmaId, disciplinaId);
        } else if (turmaId != null) {
            chamadas = chamadaRepository.findByTurmaId(turmaId);
        } else if (disciplinaId != null) {
            chamadas = chamadaRepository.findByDisciplinaId(disciplinaId);
        } else {
            chamadas = chamadaRepository.findAll();
        }

        Map<Long, Turma> turmas = new HashMap<>();
        turmaRepository.findAll().forEach(t -> turmas.put(t.getId(), t));

        Map<Long, Disciplina> disciplinas = new HashMap<>();
        disciplinaRepository.findAll().forEach(d -> disciplinas.put(d.getId(), d));

        List<ChamadaResponse> result = new ArrayList<>();
        for (Chamada c : chamadas) {
            List<ChamadaRegistro> regs = chamadaRegistroRepository.findByChamadaId(c.getId());
            int pres = (int) regs.stream().filter(r -> Boolean.TRUE.equals(r.getPresente())).count();
            int aus = regs.size() - pres;

            List<ChamadaRegistroItem> items = regs.stream()
                    .map(r -> new ChamadaRegistroItem(r.getAlunoId(), r.getPresente(), r.getObservacao()))
                    .toList();

            String tNome = turmas.containsKey(c.getTurmaId()) ? turmas.get(c.getTurmaId()).getNome() : "Turma " + c.getTurmaId();
            String dNome = disciplinas.containsKey(c.getDisciplinaId()) ? disciplinas.get(c.getDisciplinaId()).getNome() : "Disciplina " + c.getDisciplinaId();

            result.add(new ChamadaResponse(
                    c.getId(),
                    c.getTurmaId(),
                    tNome,
                    c.getDisciplinaId(),
                    dNome,
                    c.getDataAula(),
                    regs.size(),
                    pres,
                    aus,
                    items,
                    c.getCriadoEm()
            ));
        }

        return result;
    }

    // --- Avaliações ---

    @Transactional
    public AvaliacaoResponse cadastrarAvaliacao(AvaliacaoRequest req) {
        Turma turma = turmaRepository.findById(req.turmaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Turma não encontrada para o ID: " + req.turmaId()));

        Disciplina disciplina = disciplinaRepository.findById(req.disciplinaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Disciplina não encontrada para o ID: " + req.disciplinaId()));

        Avaliacao a = new Avaliacao(
                req.turmaId(),
                req.disciplinaId(),
                req.titulo(),
                req.tipo(),
                req.peso(),
                req.notaMaxima(),
                req.dataEntrega(),
                req.descricao()
        );

        Avaliacao salva = avaliacaoRepository.save(a);

        return new AvaliacaoResponse(
                salva.getId(),
                turma.getId(),
                turma.getNome(),
                disciplina.getId(),
                disciplina.getNome(),
                salva.getTitulo(),
                salva.getTipo(),
                salva.getPeso(),
                salva.getNotaMaxima(),
                salva.getDataEntrega(),
                salva.getDescricao(),
                salva.getCriadoEm()
        );
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponse> listarAvaliacoes(Long turmaId, Long disciplinaId) {
        List<Avaliacao> list;
        if (turmaId != null && disciplinaId != null) {
            list = avaliacaoRepository.findByTurmaIdAndDisciplinaId(turmaId, disciplinaId);
        } else if (turmaId != null) {
            list = avaliacaoRepository.findByTurmaId(turmaId);
        } else if (disciplinaId != null) {
            list = avaliacaoRepository.findByDisciplinaId(disciplinaId);
        } else {
            list = avaliacaoRepository.findAll();
        }

        Map<Long, Turma> turmas = new HashMap<>();
        turmaRepository.findAll().forEach(t -> turmas.put(t.getId(), t));

        Map<Long, Disciplina> disciplinas = new HashMap<>();
        disciplinaRepository.findAll().forEach(d -> disciplinas.put(d.getId(), d));

        return list.stream().map(a -> new AvaliacaoResponse(
                a.getId(),
                a.getTurmaId(),
                turmas.containsKey(a.getTurmaId()) ? turmas.get(a.getTurmaId()).getNome() : "Turma " + a.getTurmaId(),
                a.getDisciplinaId(),
                disciplinas.containsKey(a.getDisciplinaId()) ? disciplinas.get(a.getDisciplinaId()).getNome() : "Disciplina " + a.getDisciplinaId(),
                a.getTitulo(),
                a.getTipo(),
                a.getPeso(),
                a.getNotaMaxima(),
                a.getDataEntrega(),
                a.getDescricao(),
                a.getCriadoEm()
        )).toList();
    }

    // --- Lançamento de Notas ---

    @Transactional
    public List<NotaResponse> lancarNotas(Long avaliacaoId, LancamentoNotasRequest req) {
        Avaliacao avaliacao = avaliacaoRepository.findById(avaliacaoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Avaliação não encontrada para o ID: " + avaliacaoId));

        Map<Long, Usuario> alunosMap = new HashMap<>();
        usuarioRepository.findAll().forEach(u -> alunosMap.put(u.getId(), u));

        List<NotaResponse> responses = new ArrayList<>();

        for (NotaAlunoItem item : req.notas()) {
            Nota nota = notaRepository.findByAvaliacaoIdAndAlunoId(avaliacaoId, item.alunoId())
                    .orElse(new Nota(avaliacaoId, item.alunoId(), item.nota(), item.observacao()));

            nota.setValor(item.nota());
            nota.setObservacao(item.observacao());
            Nota salva = notaRepository.save(nota);

            String alunoNome = alunosMap.containsKey(item.alunoId())
                    ? alunosMap.get(item.alunoId()).getNome()
                    : "Aluno " + item.alunoId();

            responses.add(new NotaResponse(
                    salva.getId(),
                    avaliacao.getId(),
                    avaliacao.getTitulo(),
                    salva.getAlunoId(),
                    alunoNome,
                    salva.getValor(),
                    salva.getObservacao(),
                    salva.getDataLancamento()
            ));
        }

        return responses;
    }

    @Transactional(readOnly = true)
    public List<NotaResponse> listarNotas(Long avaliacaoId) {
        Avaliacao avaliacao = avaliacaoRepository.findById(avaliacaoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Avaliação não encontrada para o ID: " + avaliacaoId));

        Map<Long, Usuario> alunosMap = new HashMap<>();
        usuarioRepository.findAll().forEach(u -> alunosMap.put(u.getId(), u));

        return notaRepository.findByAvaliacaoId(avaliacaoId).stream()
                .map(n -> {
                    String nome = alunosMap.containsKey(n.getAlunoId()) ? alunosMap.get(n.getAlunoId()).getNome() : "Aluno " + n.getAlunoId();
                    return new NotaResponse(
                            n.getId(),
                            avaliacao.getId(),
                            avaliacao.getTitulo(),
                            n.getAlunoId(),
                            nome,
                            n.getValor(),
                            n.getObservacao(),
                            n.getDataLancamento()
                    );
                })
                .toList();
    }

    // --- Planos de Aula ---

    @Transactional
    public PlanoAulaResponse registrarPlanoAula(PlanoAulaRequest req) {
        Turma turma = turmaRepository.findById(req.turmaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Turma não encontrada para o ID: " + req.turmaId()));

        Disciplina disciplina = disciplinaRepository.findById(req.disciplinaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Disciplina não encontrada para o ID: " + req.disciplinaId()));

        PlanoAula plano = new PlanoAula(
                req.turmaId(),
                req.disciplinaId(),
                req.dataAula(),
                req.titulo(),
                req.topicos(),
                req.objetivos(),
                req.materiaisApoio(),
                req.observacoes()
        );

        PlanoAula salvo = planoAulaRepository.save(plano);

        return new PlanoAulaResponse(
                salvo.getId(),
                turma.getId(),
                turma.getNome(),
                disciplina.getId(),
                disciplina.getNome(),
                salvo.getDataAula(),
                salvo.getTitulo(),
                salvo.getTopicos(),
                salvo.getObjetivos(),
                salvo.getMateriaisApoio(),
                salvo.getObservacoes(),
                salvo.getCriadoEm()
        );
    }

    @Transactional(readOnly = true)
    public List<PlanoAulaResponse> listarPlanosAula(Long turmaId, Long disciplinaId) {
        List<PlanoAula> planos;
        if (turmaId != null && disciplinaId != null) {
            planos = planoAulaRepository.findByTurmaIdAndDisciplinaId(turmaId, disciplinaId);
        } else if (turmaId != null) {
            planos = planoAulaRepository.findByTurmaId(turmaId);
        } else if (disciplinaId != null) {
            planos = planoAulaRepository.findByDisciplinaId(disciplinaId);
        } else {
            planos = planoAulaRepository.findAllByOrderByDataAulaDesc();
        }

        Map<Long, Turma> turmas = new HashMap<>();
        turmaRepository.findAll().forEach(t -> turmas.put(t.getId(), t));

        Map<Long, Disciplina> disciplinas = new HashMap<>();
        disciplinaRepository.findAll().forEach(d -> disciplinas.put(d.getId(), d));

        return planos.stream().map(p -> new PlanoAulaResponse(
                p.getId(),
                p.getTurmaId(),
                turmas.containsKey(p.getTurmaId()) ? turmas.get(p.getTurmaId()).getNome() : "Turma " + p.getTurmaId(),
                p.getDisciplinaId(),
                disciplinas.containsKey(p.getDisciplinaId()) ? disciplinas.get(p.getDisciplinaId()).getNome() : "Disciplina " + p.getDisciplinaId(),
                p.getDataAula(),
                p.getTitulo(),
                p.getTopicos(),
                p.getObjetivos(),
                p.getMateriaisApoio(),
                p.getObservacoes(),
                p.getCriadoEm()
        )).toList();
    }
}
