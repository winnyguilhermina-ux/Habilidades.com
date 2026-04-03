import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Phone, MapPin, BookOpen, Clock, MessageSquare, ArrowRight, CheckCircle, Globe, Sparkles } from 'lucide-react';
import { CURSOS } from '../constants';
import React, { useState } from 'react';
import { db, collection, addDoc, handleFirestoreError, OperationType } from '../firebase';
import { GoogleGenAI } from "@google/genai";

export default function EnrollmentForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const profId = searchParams.get('prof');
  const cursoId = searchParams.get('curso');

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    whatsapp: '',
    cidade: 'Luanda',
    cursoId: cursoId || '',
    profissionalId: profId || '',
    modalidade: 'online',
    disponibilidade: 'manha',
    observacao: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleFillTestData = () => {
    setFormData({
      nomeCompleto: 'João Aluno de Teste',
      whatsapp: '923000000',
      cidade: 'Luanda',
      cursoId: cursoId || CURSOS[0].id,
      profissionalId: profId || '',
      modalidade: 'online',
      disponibilidade: 'tarde',
      observacao: 'Gostaria de aprender o básico para começar a trabalhar na área.'
    });
  };

  const handleAIGenerate = async () => {
    if (!formData.cursoId) {
      alert('Por favor, seleciona um curso primeiro.');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const curso = CURSOS.find(c => c.id === formData.cursoId)?.nome;
      
      const prompt = `Escreve uma observação curta (máximo 150 caracteres) de um aluno interessado em aprender ${curso}. O aluno quer explicar os seus objetivos de forma simples. Escreve em Português de Angola.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text?.trim() || "";
      setFormData(prev => ({ ...prev, observacao: text }));
    } catch (error) {
      console.error("Erro ao gerar com IA:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const path = 'inscricoes';
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.CREATE, 'inscricoes');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-black mb-4">Pedido Enviado!</h2>
          <p className="text-gray-600 mb-8">O profissional entrará em contacto contigo via WhatsApp em breve. Prepara-te para aprender!</p>
          <Link to="/" className="text-red-600 font-bold flex items-center justify-center gap-2">
            Voltar à Home <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-black tracking-tighter mb-4">Inscrição de Aluno</h1>
          <p className="text-lg text-gray-600 mb-6">Preenche os dados abaixo para começares a tua jornada.</p>
          <button 
            type="button"
            onClick={handleFillTestData}
            className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors border border-gray-200 px-4 py-2 rounded-full"
          >
            Preencher com dados de teste
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nome Completo */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-red-600" /> Nome Completo
                </label>
                <input 
                  required
                  type="text"
                  autoComplete="name"
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})}
                  placeholder="Ex: João Manuel"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-600" /> WhatsApp
                </label>
                <input 
                  required
                  type="tel"
                  autoComplete="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  placeholder="Ex: 948 000 000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Cidade */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" /> Cidade
                </label>
                <select 
                  value={formData.cidade}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                >
                  <option value="Luanda">Luanda</option>
                  <option value="Benguela">Benguela</option>
                  <option value="Huambo">Huambo</option>
                  <option value="Lubango">Lubango</option>
                  <option value="Outra">Outra</option>
                </select>
              </div>

              {/* Curso */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-600" /> Curso Escolhido
                </label>
                <select 
                  required
                  value={formData.cursoId}
                  onChange={(e) => setFormData({...formData, cursoId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Seleciona um curso</option>
                  {CURSOS.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              {/* Modalidade */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-red-600" /> Modalidade
                </label>
                <select 
                  value={formData.modalidade}
                  onChange={(e) => setFormData({...formData, modalidade: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                >
                  <option value="online">Online</option>
                  <option value="presencial">Presencial</option>
                  <option value="ambos">Ambos</option>
                </select>
              </div>

              {/* Disponibilidade */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-600" /> Disponibilidade
                </label>
                <select 
                  value={formData.disponibilidade}
                  onChange={(e) => setFormData({...formData, disponibilidade: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                >
                  <option value="manha">Manhã</option>
                  <option value="tarde">Tarde</option>
                  <option value="pos-laboral">Pós-Laboral</option>
                  <option value="fim-de-semana">Fim de Semana</option>
                </select>
              </div>
            </div>

            {/* Observação */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-red-600" /> Observação (Opcional)
                </label>
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={isGeneratingAI}
                  className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" /> {isGeneratingAI ? 'A gerar...' : 'Gerar com IA'}
                </button>
              </div>
              <textarea 
                rows={4}
                value={formData.observacao}
                onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                placeholder="Diz-nos mais sobre os teus objetivos..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                Ao enviar este pedido, o profissional será notificado. A Hab.com garante a segurança do teu contacto. O pagamento da sessão é feito diretamente ao profissional após o primeiro contacto.
              </p>
            </div>

            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'A enviar...' : 'Enviar Pedido'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
