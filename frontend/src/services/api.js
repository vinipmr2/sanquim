// Serviço central de comunicação com a API REST do Studi+ / Colégio Sanquim

const TOKEN_KEY = 'studi_jwt_token';
const USER_KEY = 'studi_user_data';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setAuth: (data) => {
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
    if (data.usuario) localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
  },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: () => {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  getRole: () => {
    const u = authStorage.getUser();
    return u?.perfil || null;
  },
  isAuthenticated: () => !!authStorage.getToken()
};

export async function apiFetch(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  try {
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      // Se não autenticado e rota restrita, limpa auth se não for rota de login
      if (!endpoint.includes('/api/auth/login')) {
        console.warn('Sessão expirada ou não autorizada.');
      }
    }

    const contentType = res.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = text ? { mensagem: text } : {};
    }

    if (!res.ok) {
      const errorMsg = data?.mensagem || data?.erro || `Erro HTTP ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`Erro na requisição ${url}:`, error);
    throw error;
  }
}

// 1. Módulo de Autenticação
export const authApi = {
  login: async (email, senha) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });
    authStorage.setAuth(data);
    return data;
  },
  getMe: () => apiFetch('/api/auth/me'),
  esqueciSenha: (email) => apiFetch('/api/auth/esqueci-senha', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  logout: () => authStorage.clearAuth()
};

// 2. Módulo de Gestão Administrativa (/api/admin) - ROLE_GESTAO
export const adminApi = {
  getStats: () => apiFetch('/api/admin/stats'),
  getAlertasEvasao: () => apiFetch('/api/admin/alertas-evasao'),
  getProfessores: () => apiFetch('/api/admin/professores'),
  cadastrarProfessor: (data) => apiFetch('/api/admin/professores', { method: 'POST', body: JSON.stringify(data) }),
  getAlunos: () => apiFetch('/api/admin/alunos'),
  cadastrarAluno: (data) => apiFetch('/api/admin/alunos', { method: 'POST', body: JSON.stringify(data) }),
  getTurmas: () => apiFetch('/api/admin/turmas'),
  cadastrarTurma: (data) => apiFetch('/api/admin/turmas', { method: 'POST', body: JSON.stringify(data) }),
  getDisciplinas: () => apiFetch('/api/admin/disciplinas'),
  cadastrarDisciplina: (data) => apiFetch('/api/admin/disciplinas', { method: 'POST', body: JSON.stringify(data) }),
  getMatriculas: () => apiFetch('/api/admin/matriculas'),
  realizarMatricula: (data) => apiFetch('/api/admin/matriculas', { method: 'POST', body: JSON.stringify(data) })
};

// 3. Módulo Pedagógico e Diário de Classe (/api/diario) - ROLE_PROFESSOR / ROLE_GESTAO
export const diarioApi = {
  getMinhasTurmas: () => apiFetch('/api/diario/minhas-turmas'),
  registrarChamada: (data) => apiFetch('/api/diario/chamada', { method: 'POST', body: JSON.stringify(data) }),
  getChamadas: (turmaId, disciplinaId) => {
    const params = new URLSearchParams();
    if (turmaId) params.append('turmaId', turmaId);
    if (disciplinaId) params.append('disciplinaId', disciplinaId);
    return apiFetch(`/api/diario/chamadas?${params.toString()}`);
  },
  cadastrarAvaliacao: (data) => apiFetch('/api/diario/avaliacoes', { method: 'POST', body: JSON.stringify(data) }),
  getAvaliacoes: (turmaId, disciplinaId) => {
    const params = new URLSearchParams();
    if (turmaId) params.append('turmaId', turmaId);
    if (disciplinaId) params.append('disciplinaId', disciplinaId);
    return apiFetch(`/api/diario/avaliacoes?${params.toString()}`);
  },
  lancarNotas: (avaliacaoId, notas) => apiFetch(`/api/diario/avaliacoes/${avaliacaoId}/notas`, {
    method: 'POST',
    body: JSON.stringify({ notas })
  }),
  getNotas: (avaliacaoId) => apiFetch(`/api/diario/avaliacoes/${avaliacaoId}/notas`),
  registrarPlanoAula: (data) => apiFetch('/api/diario/planos-aula', { method: 'POST', body: JSON.stringify(data) }),
  getPlanosAula: (turmaId, disciplinaId) => {
    const params = new URLSearchParams();
    if (turmaId) params.append('turmaId', turmaId);
    if (disciplinaId) params.append('disciplinaId', disciplinaId);
    return apiFetch(`/api/diario/planos-aula?${params.toString()}`);
  }
};

// 4. Módulo do Aluno (/api/aluno) - ROLE_ALUNO
export const alunoApi = {
  getBoletim: () => apiFetch('/api/aluno/boletim'),
  getFrequencia: () => apiFetch('/api/aluno/frequencia'),
  getAulas: () => apiFetch('/api/aluno/aulas')
};
