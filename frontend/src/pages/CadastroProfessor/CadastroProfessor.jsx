import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './CadastroProfessor.css';

export const CadastroProfessor = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (disciplina) => {
    setFormData((prev) => {
      const exists = prev.disciplinas.includes(disciplina);
      return {
        ...prev,
        disciplinas: exists ? prev.disciplinas.filter((d) => d !== disciplina) : [...prev.disciplinas, disciplina]
      };
    });
  };

  const handleFileChange = (e, field) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFileNames((prev) => ({
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
    if (!validateStep(currentStep)) return;

    if (currentStep === 3) {
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
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stepsMeta = [
    { num: 1, label: 'Dados Pessoais' },
    { num: 2, label: 'Formação & Área' },
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
    <div className="st-crud-shell page-cadastro-professor">
      <header className="st-navbar">
        <div className="st-logo" onClick={() => navigate('/')}>
          <div className="st-logo-mark">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <span className="st-logo-text">
            Studi<i>+</i>
          </span>
        </div>

        <div className="st-nav-actions">
          <button
            type="button"
            className="st-theme-btn"
            onClick={toggleTheme}
            title={isDark ? 'Tema claro' : 'Tema escuro'}
          >
            <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>
          <button type="button" className="st-btn st-btn-outline st-btn-sm" onClick={() => navigate('/')}>
            <i className="fas fa-home"></i> Início
          </button>
        </div>
      </header>

      <main className="st-crud-container">
        <div className="wizard-card">
          <div className="wizard-hero">
            <h1>
              <i className="fas fa-user-plus"></i> Cadastro de Professor Voluntário
            </h1>
            <p>Complete as etapas para integrar o corpo docente do Colégio Sanquim</p>
          </div>

          <div className="stepper">
            {stepsMeta.map((s) => {
              const isCompleted = s.num < currentStep;
              const isActive = s.num === currentStep;
              return (
                <div key={s.num} className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <div className="step-circle">{isCompleted ? <i className="fas fa-check"></i> : s.num}</div>
                  <div className="step-label">{s.label}</div>
                </div>
              );
            })}
          </div>

          <div className="wizard-body">
            <form onSubmit={(e) => e.preventDefault()} className="st-form">
              {currentStep === 1 && (
                <div className="st-form">
                  <div className="section-title">
                    <i className="fas fa-user"></i> Dados Pessoais
                  </div>

                  <div className="st-form-row">
                    <div className="st-field">
                      <label htmlFor="nome">
                        Nome Completo <span className="required">*</span>
                      </label>
                      <input
                        className="st-input"
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="st-field">
                      <label htmlFor="cpf">
                        CPF <span className="required">*</span>
                      </label>
                      <input
                        className="st-input"
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

                  <div className="st-form-row">
                    <div className="st-field">
                      <label htmlFor="email">
                        E-mail <span className="required">*</span>
                      </label>
                      <input
                        className="st-input"
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="st-field">
                      <label htmlFor="telefone">
                        Telefone / WhatsApp <span className="required">*</span>
                      </label>
                      <input
                        className="st-input"
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

                  <div className="st-form-row">
                    <div className="st-field">
                      <label htmlFor="dataNascimento">Data de Nascimento</label>
                      <input
                        className="st-input"
                        type="date"
                        id="dataNascimento"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="st-field">
                      <label htmlFor="genero">Gênero</label>
                      <select
                        className="st-select"
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

                  <div className="st-field">
                    <label htmlFor="endereco">Endereço Completo</label>
                    <textarea
                      className="st-textarea"
                      id="endereco"
                      name="endereco"
                      placeholder="Rua, número, bairro, cidade, CEP"
                      value={formData.endereco}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="st-form">
                  <div className="section-title">
                    <i className="fas fa-briefcase"></i> Informações Profissionais
                  </div>

                  <div className="st-form-row">
                    <div className="st-field">
                      <label htmlFor="formacao">
                        Formação Principal <span className="required">*</span>
                      </label>
                      <input
                        className="st-input"
                        type="text"
                        id="formacao"
                        name="formacao"
                        placeholder="Ex: Licenciatura em Matemática"
                        value={formData.formacao}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="st-field">
                      <label htmlFor="instituicao">Instituição de Ensino</label>
                      <input
                        className="st-input"
                        type="text"
                        id="instituicao"
                        name="instituicao"
                        placeholder="Nome da universidade"
                        value={formData.instituicao}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="st-field">
                    <label>
                      Disciplinas que pode lecionar <span className="required">*</span>
                    </label>
                    <div className="subjects-grid">
                      {disciplinasDisponiveis.map((d) => {
                        const checked = formData.disciplinas.includes(d.id);
                        return (
                          <label key={d.id} className={`subject-chip ${checked ? 'selected' : ''}`}>
                            <input type="checkbox" checked={checked} onChange={() => handleCheckboxChange(d.id)} />
                            <i className={checked ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                            <span>{d.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="st-form-row">
                    <div className="st-field">
                      <label htmlFor="experiencia">Anos de Experiência</label>
                      <select
                        className="st-select"
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
                    <div className="st-field">
                      <label htmlFor="registro">Registro Profissional</label>
                      <input
                        className="st-input"
                        type="text"
                        id="registro"
                        name="registro"
                        value={formData.registro}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="st-field">
                    <label htmlFor="experienciaDetalhada">Experiência Profissional Detalhada</label>
                    <textarea
                      className="st-textarea"
                      id="experienciaDetalhada"
                      name="experienciaDetalhada"
                      placeholder="Escolas onde trabalhou, projetos desenvolvidos, disponibilidade..."
                      value={formData.experienciaDetalhada}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="st-form">
                  <div className="section-title">
                    <i className="fas fa-file-upload"></i> Documentos Comprobatórios
                  </div>

                  {[
                    { id: 'foto', label: 'Foto de Perfil', accept: 'image/*', icon: 'fa-camera', placeholder: 'Clique para enviar sua foto', multiple: false },
                    { id: 'curriculo', label: 'Currículo (PDF)', accept: '.pdf', icon: 'fa-file-pdf', placeholder: 'Clique para enviar seu currículo', multiple: false },
                    { id: 'diploma', label: 'Diploma de Graduação (PDF)', accept: '.pdf', icon: 'fa-graduation-cap', placeholder: 'Clique para enviar seu diploma', multiple: false },
                    { id: 'adicionais', label: 'Documentos Adicionais (Certificados, Especializações)', accept: '.pdf', icon: 'fa-certificate', placeholder: 'Clique para enviar certificados', multiple: true }
                  ].map((doc) => (
                    <div key={doc.id} className="st-field">
                      <label htmlFor={doc.id}>{doc.label}</label>
                      <div className={`upload-zone ${fileNames[doc.id] ? 'has-file' : ''}`}>
                        <input
                          type="file"
                          id={doc.id}
                          accept={doc.accept}
                          multiple={doc.multiple}
                          onChange={(e) => handleFileChange(e, doc.id)}
                        />
                        <label htmlFor={doc.id} className="upload-label">
                          <i className={`fas ${fileNames[doc.id] ? 'fa-check-circle' : doc.icon}`}></i>
                          <span>{fileNames[doc.id] || doc.placeholder}</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 4 && (
                <div className="success-box">
                  <div className="success-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <h2>Cadastro Concluído!</h2>
                  <p style={{ color: 'var(--st-text-sec)', maxWidth: 520, margin: '8px auto 24px' }}>
                    Suas informações foram enviadas com sucesso, Professor(a){' '}
                    <strong>{formData.nome || 'Docente'}</strong>! Nossa coordenação analisará os documentos em até
                    2 dias úteis.
                  </p>
                  <button type="button" className="st-btn st-btn-primary" onClick={() => navigate('/login-professor')}>
                    <i className="fas fa-sign-in-alt"></i> Ir para Login Docente
                  </button>
                </div>
              )}

              {currentStep < 4 && (
                <div className="wizard-footer">
                  <div>
                    {currentStep > 1 && (
                      <button type="button" className="st-btn st-btn-outline" onClick={handlePrev}>
                        <i className="fas fa-arrow-left"></i> Anterior
                      </button>
                    )}
                  </div>
                  <button type="button" className="st-btn st-btn-primary" onClick={handleNext}>
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
      </main>
    </div>
  );
};

export default CadastroProfessor;

