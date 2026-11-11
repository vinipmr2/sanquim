package br.edu.sanquim.studi.service;

import br.edu.sanquim.studi.dto.*;
import br.edu.sanquim.studi.exception.RecursoNaoEncontradoException;
import br.edu.sanquim.studi.model.*;
import br.edu.sanquim.studi.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AlunoService {

    private final UsuarioRepository usuarioRepository;
    private final MatriculaRepository matriculaRepository;
    private final TurmaRepository turmaRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final NotaRepository notaRepository;
    private final ChamadaRepository chamadaRepository;
    private final ChamadaRegistroRepository chamadaRegistroRepository;
    private final PlanoAulaRepository planoAulaRepository;

    public AlunoService(
            UsuarioRepository usuarioRepository,
            MatriculaRepository matriculaRepository,
            TurmaRepository turmaRepository,
            DisciplinaRepository disciplinaRepository,
            AvaliacaoRepository avaliacaoRepository,
            NotaRepository notaRepository,
            ChamadaRepository chamadaRepository,
            ChamadaRegistroRepository chamadaRegistroRepository,
            PlanoAulaRepository planoAulaRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.matriculaRepository = matriculaRepository;
        this.turmaRepository = turmaRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.notaRepository = notaRepository;
        this.chamadaRepository = chamadaRepository;
        this.chamadaRegistroRepository = chamadaRegistroRepository;
        this.planoAulaRepository = planoAulaRepository;
    }

    @Transactional(readOnly = true)
    public BoletimResponse getBoletim(String email) {
        Usuario aluno = getAlunoByEmail(email);
        Matricula matricula = getMatriculaByAluno(aluno);

        Turma turma = (matricula != null && matricula.getTurmaId() != null)
                ? turmaRepository.findById(matricula.getTurmaId()).orElse(null)
                : null;

        String turmaNome = turma != null ? turma.getNome() : "Sem turma atribuída";

        List<Disciplina> disciplinas = disciplinaRepository.findAll();
        List<DisciplinaBoletimDTO> discDtos = new ArrayList<>();
        double somaMedias = 0.0;
        int totalDisciplinasComNotas = 0;

        for (Disciplina d : disciplinas) {
            List<Avaliacao> avaliacoes = (turma != null)
                    ? avaliacaoRepository.findByTurmaIdAndDisciplinaId(turma.getId(), d.getId())
                    : avaliacaoRepository.findByDisciplinaId(d.getId());

            List<AvaliacaoNotaDTO> avDtos = new ArrayList<>();
            double somaPonderada = 0.0;
            double somaPesos = 0.0;

            for (Avaliacao av : avaliacoes) {
                Optional<Nota> notaOpt = notaRepository.findByAvaliacaoIdAndAlunoId(av.getId(), aluno.getId());
                Double valor = notaOpt.map(Nota::getValor).orElse(null);
                String obs = notaOpt.map(Nota::getObservacao).orElse(null);

                avDtos.add(new AvaliacaoNotaDTO(
                        av.getId(),
                        av.getTitulo(),
                        av.getTipo(),
                        av.getPeso(),
                        av.getNotaMaxima(),
                        valor,
                        obs,
                        av.getDataEntrega()
                ));

                if (valor != null) {
                    double p = (av.getPeso() != null && av.getPeso() > 0) ? av.getPeso() : 1.0;
                    somaPonderada += valor * p;
                    somaPesos += p;
                }
            }

            Double mediaParcial = null;
            String situacao = "SEM NOTAS";

            if (somaPesos > 0) {
                mediaParcial = Math.round((somaPonderada / somaPesos) * 10.0) / 10.0;
                situacao = mediaParcial >= 6.0 ? "APROVADO" : "RECUPERAÇÃO";
                somaMedias += mediaParcial;
                totalDisciplinasComNotas++;
            }

            discDtos.add(new DisciplinaBoletimDTO(
                    d.getId(),
                    d.getNome(),
                    d.getProfessorResponsavel(),
                    avDtos,
                    mediaParcial,
                    situacao
            ));
        }

        Double mediaGeral = totalDisciplinasComNotas > 0
                ? Math.round((somaMedias / totalDisciplinasComNotas) * 10.0) / 10.0
                : null;

        return new BoletimResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                matricula != null ? matricula.getMatriculaCodigo() : null,
                turmaNome,
                discDtos,
                mediaGeral
        );
    }

    @Transactional(readOnly = true)
    public FrequenciaResponse getFrequencia(String email) {
        Usuario aluno = getAlunoByEmail(email);

        List<ChamadaRegistro> registros = chamadaRegistroRepository.findByAlunoId(aluno.getId());
        List<Disciplina> disciplinas = disciplinaRepository.findAll();

        Map<Long, Chamada> chamadaMap = new HashMap<>();
        chamadaRepository.findAll().forEach(c -> chamadaMap.put(c.getId(), c));

        List<DisciplinaFrequenciaDTO> discDtos = new ArrayList<>();
        int totalGlobalAulas = registros.size();
        int totalGlobalPresencas = 0;
        int totalGlobalFaltas = 0;

        for (Disciplina d : disciplinas) {
            List<ChamadaRegistro> regsDisciplina = registros.stream()
                    .filter(r -> {
                        Chamada c = chamadaMap.get(r.getChamadaId());
                        return c != null && Objects.equals(c.getDisciplinaId(), d.getId());
                    })
                    .toList();

            int totalAulas = regsDisciplina.size();
            int pres = (int) regsDisciplina.stream().filter(r -> Boolean.TRUE.equals(r.getPresente())).count();
            int faltas = totalAulas - pres;

            totalGlobalPresencas += pres;
            totalGlobalFaltas += faltas;

            double pct = totalAulas > 0
                    ? Math.round((pres * 100.0 / totalAulas) * 10.0) / 10.0
                    : 100.0;

            String situacao = totalAulas == 0 ? "SEM REGISTROS" : (pct >= 75.0 ? "REGULAR" : "ATENÇÃO: RISCO DE REPROVAÇÃO");

            discDtos.add(new DisciplinaFrequenciaDTO(
                    d.getId(),
                    d.getNome(),
                    d.getProfessorResponsavel(),
                    totalAulas,
                    pres,
                    faltas,
                    pct,
                    situacao
            ));
        }

        double pctGlobal = totalGlobalAulas > 0
                ? Math.round((totalGlobalPresencas * 100.0 / totalGlobalAulas) * 10.0) / 10.0
                : 100.0;

        return new FrequenciaResponse(
                aluno.getId(),
                aluno.getNome(),
                pctGlobal,
                totalGlobalAulas,
                totalGlobalPresencas,
                totalGlobalFaltas,
                discDtos
        );
    }

    @Transactional(readOnly = true)
    public List<AulaTimelineResponse> getLinhaDoTempoAulas(String email) {
        Usuario aluno = getAlunoByEmail(email);
        Matricula matricula = getMatriculaByAluno(aluno);

        List<PlanoAula> planos;
        if (matricula != null && matricula.getTurmaId() != null) {
            planos = planoAulaRepository.findByTurmaId(matricula.getTurmaId());
        } else {
            planos = planoAulaRepository.findAllByOrderByDataAulaDesc();
        }

        Map<Long, Turma> turmas = new HashMap<>();
        turmaRepository.findAll().forEach(t -> turmas.put(t.getId(), t));

        Map<Long, Disciplina> disciplinas = new HashMap<>();
        disciplinaRepository.findAll().forEach(d -> disciplinas.put(d.getId(), d));

        return planos.stream()
                .sorted((a, b) -> b.getDataAula().compareTo(a.getDataAula()))
                .map(p -> {
                    String tNome = turmas.containsKey(p.getTurmaId()) ? turmas.get(p.getTurmaId()).getNome() : "Turma " + p.getTurmaId();
                    Disciplina d = disciplinas.get(p.getDisciplinaId());
                    String dNome = d != null ? d.getNome() : "Disciplina " + p.getDisciplinaId();
                    String prof = d != null ? d.getProfessorResponsavel() : "Corpo Docente";

                    return new AulaTimelineResponse(
                            p.getId(),
                            p.getTurmaId(),
                            tNome,
                            p.getDisciplinaId(),
                            dNome,
                            prof,
                            p.getDataAula(),
                            p.getTitulo(),
                            p.getTopicos(),
                            p.getObjetivos(),
                            p.getMateriaisApoio(),
                            p.getObservacoes()
                    );
                })
                .toList();
    }

    private Usuario getAlunoByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Aluno não encontrado para o e-mail: " + email));
    }

    private Matricula getMatriculaByAluno(Usuario aluno) {
        List<Matricula> mats = matriculaRepository.findByUsuarioId(aluno.getId());
        return mats.isEmpty() ? null : mats.get(0);
    }
}
