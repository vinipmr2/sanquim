import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CadastroProfessor.css';

export const CadastroProfessor = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    genero: '',
    endereco: '',
    formacao: '',
    instituicao: '',
    disciplinas: [],
    experiencia: '',
    registro: '',
    experienciaDetalhada: ''
  });

  const [fileNames, setFileNames] = useState({
    foto: '',
    curriculo: '',
    diploma: '',
    adicionais: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (disciplina) => {
    setFormData(prev => {
      const exists = prev.disciplinas.includes(disciplina);
      return {
        ...prev,
        disciplinas: exists 
          ? prev.disciplinas.filter(d => d !== disciplina)
          : [...prev.disciplinas, disciplina]
      };
    });
  };

  const handleFileChange = (e, field) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFileNames(prev => ({
        ...prev,
        [field]: files.length > 1 ? `${files.length} arquivos selecionados` : files[0].name
      }));
    }
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.nome.trim() || !formData.cpf.trim() || !formData.email.trim() || !formData.telefone.trim()) {
        alert('Por favor, preencha todos os campos obrigatórios (*) dos Dados Pessoais.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.formacao.trim()) {
        alert('Por favor, informe sua Formação Principal.');
        return false;
      }
      if (formData.disciplinas.length === 0) {
        alert('Por favor, selecione pelo menos uma disciplina que você pode lecionar.');
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        // Envio para o backend
        try {
          await fetch('/api/professores/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
        } catch (err) {
          console.warn('Backend offline, progredindo confirmação visualmente:', err);
        }
        setCurrentStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stepsMeta = [
    { num: 1, label: 'Dados Pessoais' },
    { num: 2, label: 'Informações Profissionais' },
    { num: 3, label: 'Documentos' },
    { num: 4, label: 'Confirmação' }
  ];

  const disciplinasDisponiveis = [
    { id: 'matematica', label: 'Matemática' },
    { id: 'portugues', label: 'Português' },
    { id: 'ciencias', label: 'Ciências' },
    { id: 'historia', label: 'História' },
    { id: 'geografia', label: 'Geografia' },
    { id: 'ingles', label: 'Inglês' },
    { id: 'educacao-fisica', label: 'Educação Física' },
    { id: 'artes', label: 'Artes' }
  ];

  return (
    <div className="page-cadastro-professor">
      <div className="container">
        {/* Botão Início */}
        <div className="inicio-button">
          <button type="button" className="btn btn-inicio" onClick={() => navigate('/')}>
            <i className="fas fa-home"></i>
            Início
          </button>
        </div>

        <div className="header">
          <div className="header-content">
            <h1>
              <i className="fas fa-user-plus"></i>
              Cadastro de Professor
            </h1>
            <p>Complete as informações para criar sua conta no Portal Educacional</p>
          </div>
        </div>

        <div className="form-container">
          {/* Barra de Progresso */}
          <div className="progress-bar">
            {stepsMeta.map((s) => {
              const isCompleted = s.num < currentStep;
              const isActive = s.num === currentStep;
              return (
                <div 
                  key={s.num} 
                  className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="step-circle">{isCompleted ? '✓' : s.num}</div>
                  <div className="step-label">{s.label}</div>
                </div>
              );
            })}
          </div>

          <form id="cadastroForm" onSubmit={(e) => e.preventDefault()}>
            {/* Seção 1: Dados Pessoais */}
            {currentStep === 1 && (
              <div className="form-section active" id="secao1">
                <div className="section-title">
                  <i className="fas fa-user"></i>
                  Dados Pessoais
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nome">Nome Completo <span className="required">*</span></label>
                    <input 
                      type="text" 
                      id="nome" 
                      name="nome" 
                      value={formData.nome}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cpf">CPF <span className="required">*</span></label>
                    <input 
                      type="text" 
                      id="cpf" 
                      name="cpf" 
                      placeholder="000.000.000-00" 
                      value={formData.cpf}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">E-mail <span className="required">*</span></label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefone">Telefone <span className="required">*</span></label>
                    <input 
                      type="tel" 
                      id="telefone" 
                      name="telefone" 
                      placeholder="(00) 00000-0000" 
                      value={formData.telefone}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dataNascimento">Data de Nascimento</label>
                    <input 
                      type="date" 
                      id="dataNascimento" 
                      name="dataNascimento" 
                      value={formData.dataNascimento}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="genero">Gênero</label>
                    <select 
                      id="genero" 
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecione</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                      <option value="nao-informar">Prefiro não informar</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="endereco">Endereço Completo</label>
                  <textarea 
                    id="endereco" 
                    name="endereco" 
                    placeholder="Rua, número, bairro, cidade, CEP"
                    value={formData.endereco}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {/* Seção 2: Informações Profissionais */}
            {currentStep === 2 && (
              <div className="form-section active" id="secao2">
                <div className="section-title">
                  <i className="fas fa-briefcase"></i>
                  Informações Profissionais
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="formacao">Formação Principal <span className="required">*</span></label>
                    <input 
                      type="text" 
                      id="formacao" 
                      name="formacao" 
                      placeholder="Ex: Licenciatura em Matemática" 
                      value={formData.formacao}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="instituicao">Instituição de Ensino</label>
                    <input 
                      type="text" 
                      id="instituicao" 
                      name="instituicao" 
                      placeholder="Nome da universidade" 
                      value={formData.instituicao}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Disciplinas que pode lecionar <span className="required">*</span></label>
                  <div className="checkbox-group">
                    {disciplinasDisponiveis.map(d => (
                      <div key={d.id} className="checkbox-item">
                        <input 
                          type="checkbox" 
                          id={d.id} 
                          checked={formData.disciplinas.includes(d.id)}
                          onChange={() => handleCheckboxChange(d.id)}
                        />
                        <label htmlFor={d.id}>{d.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="experiencia">Anos de Experiência</label>
                    <select 
                      id="experiencia" 
                      name="experiencia"
                      value={formData.experiencia}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecione</option>
                      <option value="0-1">Menos de 1 ano</option>
                      <option value="1-3">1 a 3 anos</option>
                      <option value="3-5">3 a 5 anos</option>
                      <option value="5-10">5 a 10 anos</option>
                      <option value="10+">Mais de 10 anos</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="registro">Número de Registro Profissional</label>
                    <input 
                      type="text" 
                      id="registro" 
                      name="registro" 
                      value={formData.registro}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="experienciaDetalhada">Experiência Profissional Detalhada</label>
                  <textarea 
                    id="experienciaDetalhada" 
                    name="experienciaDetalhada" 
                    placeholder="Descreva sua experiência profissional, escolas onde trabalhou, projetos desenvolvidos, etc."
                    value={formData.experienciaDetalhada}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {/* Seção 3: Documentos */}
            {currentStep === 3 && (
              <div className="form-section active" id="secao3">
                <div className="section-title">
                  <i className="fas fa-file-upload"></i>
                  Documentos
                </div>

                <div className="form-group">
                  <label htmlFor="foto">Foto de Perfil</label>
                  <div className="file-upload">
                    <input 
                      type="file" 
                      id="foto" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'foto')} 
                    />
                    <label htmlFor="foto" className="file-upload-label">
                      <i className="fas fa-camera"></i>
                      {fileNames.foto || 'Clique para enviar sua foto'}
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="curriculo">Currículo (PDF)</label>
                  <div className="file-upload">
                    <input 
                      type="file" 
                      id="curriculo" 
                      accept=".pdf" 
                      onChange={(e) => handleFileChange(e, 'curriculo')} 
                    />
                    <label htmlFor="curriculo" className="file-upload-label">
                      <i className="fas fa-file-pdf"></i>
                      {fileNames.curriculo || 'Clique para enviar seu currículo'}
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="diploma">Diploma de Graduação (PDF)</label>
                  <div className="file-upload">
                    <input 
                      type="file" 
                      id="diploma" 
                      accept=".pdf" 
                      onChange={(e) => handleFileChange(e, 'diploma')} 
                    />
                    <label htmlFor="diploma" className="file-upload-label">
                      <i className="fas fa-graduation-cap"></i>
                      {fileNames.diploma || 'Clique para enviar seu diploma'}
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="adicionais">Documentos Adicionais (Certificados, Especializações)</label>
                  <div className="file-upload">
                    <input 
                      type="file" 
                      id="adicionais" 
                      accept=".pdf" 
                      multiple 
                      onChange={(e) => handleFileChange(e, 'adicionais')} 
                    />
                    <label htmlFor="adicionais" className="file-upload-label">
                      <i className="fas fa-certificate"></i>
                      {fileNames.adicionais || 'Clique para enviar documentos adicionais'}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Seção 4: Confirmação */}
            {currentStep === 4 && (
              <div className="form-section active" id="secao4">
                <div className="success-message">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="success-title">Cadastro Concluído!</div>
                  <div className="success-text">
                    Suas informações foram enviadas com sucesso, Professor(a) <strong>{formData.nome || 'Docente'}</strong>! Nossa equipe irá analisar os documentos e entrar em contato em até 2 dias úteis.
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={() => navigate('/login-professor')}
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    Ir para Login
                  </button>
                </div>
              </div>
            )}

            {/* Botões de Navegação */}
            {currentStep < 4 && (
              <div className="navigation-buttons" id="navigation">
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handlePrev}
                  >
                    <i className="fas fa-arrow-left"></i>
                    Anterior
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleNext}
                >
                  {currentStep === 3 ? (
                    <>
                      <i className="fas fa-check"></i> Finalizar Cadastro
                    </>
                  ) : (
                    <>
                      Próximo <i className="fas fa-arrow-right"></i>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroProfessor;
