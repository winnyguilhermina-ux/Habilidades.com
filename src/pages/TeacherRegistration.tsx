import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Phone, MapPin, BookOpen, Clock, MessageSquare, ArrowRight, CheckCircle, Award, DollarSign, Link as LinkIcon, Globe, Camera, Upload, Sparkles } from 'lucide-react';
import { CURSOS } from '../constants';
import React, { useState, useRef } from 'react';
import { db, collection, addDoc, handleFirestoreError, OperationType, storage, ref, uploadBytes, getDownloadURL } from '../firebase';
import { GoogleGenAI } from "@google/genai";

export default function TeacherRegistration() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    whatsapp: '',
    cidade: 'Luanda',
    cursoId: '',
    experiencia: '',
    certificado: false,
    biografia: '',
    oQueEnsina: '',
    modalidade: 'online',
    preco: '',
    portfolioUrl: ''
  });

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleAIGenerate = async (field: 'biografia' | 'oQueEnsina') => {
    if (!formData.nomeCompleto || !formData.cursoId) {
      alert('Por favor, preenche o teu nome e seleciona um curso primeiro para a IA ter contexto.');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const curso = CURSOS.find(c => c.id === formData.cursoId)?.nome;
      
      let prompt = "";
      if (field === 'biografia') {
        prompt = `Escreve uma biografia profissional curta e cativante (máximo 300 caracteres) para um professor chamado ${formData.nomeCompleto} que ensina ${curso}. Ele tem ${formData.experiencia} de experiência. O tom deve ser profissional, mas amigável e focado em resultados. Escreve em Português de Angola.`;
      } else {
        prompt = `Lista 5 a 8 tópicos principais que um professor de ${curso} deve ensinar. O professor chama-se ${formData.nomeCompleto}. Escreve apenas a lista separada por vírgulas. Exemplo: Tópico 1, Tópico 2, Tópico 3.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text?.trim() || "";
      setFormData(prev => ({ ...prev, [field]: text }));
    } catch (error) {
      console.error("Erro ao gerar com IA:", error);
      alert("Não foi possível gerar o texto com IA neste momento.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A foto deve ter no máximo 2MB');
        return;
      }
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let fotoUrl = '';
      if (fotoFile) {
        const storageRef = ref(storage, `profissionais/${Date.now()}_${fotoFile.name}`);
        const snapshot = await uploadBytes(storageRef, fotoFile);
        fotoUrl = await getDownloadURL(snapshot.ref);
      }

      const path = 'profissionais';
      await addDoc(collection(db, path), {
        ...formData,
        fotoUrl,
        preco: Number(formData.preco),
        createdAt: new Date().toISOString()
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.CREATE, 'profissionais');
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
          <h2 className="text-3xl font-bold text-black mb-4">Candidatura Recebida!</h2>
          <p className="text-gray-600 mb-8">A nossa equipa irá analisar o teu perfil e entrará em contacto via WhatsApp em breve. Bem-vindo à Hab.com!</p>
          <Link to="/" className="text-red-600 font-bold flex items-center justify-center gap-2">
            Voltar à Home <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-black tracking-tighter mb-4">Quero Ensinar</h1>
          <p className="text-lg text-gray-600">Transforma o teu conhecimento numa fonte de renda e ajuda outros a crescerem.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            {/* Foto de Perfil */}
            <div className="flex flex-col items-center gap-4 pb-8 border-b border-gray-100">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative">
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-red-600 text-white p-3 rounded-2xl shadow-xl hover:bg-red-700 transition-all transform hover:scale-110"
                >
                  <Camera className="w-5 h-5" />
                </button>
                {fotoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setFotoFile(null);
                      setFotoPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute -top-2 -right-2 bg-gray-800 text-white p-2 rounded-xl shadow-lg hover:bg-black transition-all transform hover:scale-110"
                  >
                    <span className="text-xs font-bold px-1">X</span>
                  </button>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-700">Foto de Perfil</p>
                <p className="text-xs text-gray-500">Recomendado: Quadrada, máx 2MB</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

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
                  placeholder="Ex: António Manuel"
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
                  <BookOpen className="w-4 h-4 text-red-600" /> Curso que Ensinas
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

              {/* Experiência */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-600" /> Anos de Experiência
                </label>
                <input 
                  required
                  type="text"
                  value={formData.experiencia}
                  onChange={(e) => setFormData({...formData, experiencia: e.target.value})}
                  placeholder="Ex: 5 anos"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Preço */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-red-600" /> Preço por Sessão (Kz)
                </label>
                <input 
                  required
                  type="number"
                  value={formData.preco}
                  onChange={(e) => setFormData({...formData, preco: e.target.value})}
                  placeholder="Ex: 5000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                />
                {formData.preco && Number(formData.preco) > 0 && (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tu recebes (80%):</span>
                      <span className="font-bold text-red-600">{(Number(formData.preco) * 0.8).toLocaleString()} Kz</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>Taxa Hab.com (20%):</span>
                      <span>{(Number(formData.preco) * 0.2).toLocaleString()} Kz</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 italic">* A taxa cobre a manutenção da plataforma e marketing do teu perfil.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Certificado */}
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input 
                type="checkbox"
                id="certificado"
                checked={formData.certificado}
                onChange={(e) => setFormData({...formData, certificado: e.target.checked})}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-600"
              />
              <label htmlFor="certificado" className="text-sm font-bold text-gray-700 flex items-center gap-2 cursor-pointer">
                <Award className="w-4 h-4 text-yellow-400" /> Tenho certificado profissional
              </label>
            </div>

            {/* Biografia */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-red-600" /> Biografia Profissional
                </label>
                <button
                  type="button"
                  onClick={() => handleAIGenerate('biografia')}
                  disabled={isGeneratingAI}
                  className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" /> {isGeneratingAI ? 'A gerar...' : 'Gerar com IA'}
                </button>
              </div>
              <textarea 
                required
                rows={4}
                value={formData.biografia}
                onChange={(e) => setFormData({...formData, biografia: e.target.value})}
                placeholder="Fala-nos sobre a tua trajetória..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>

            {/* O que ensina */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-600" /> O que ensinas (Tópicos)
                </label>
                <button
                  type="button"
                  onClick={() => handleAIGenerate('oQueEnsina')}
                  disabled={isGeneratingAI}
                  className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" /> {isGeneratingAI ? 'A gerar...' : 'Gerar com IA'}
                </button>
              </div>
              <textarea 
                required
                rows={3}
                value={formData.oQueEnsina}
                onChange={(e) => setFormData({...formData, oQueEnsina: e.target.value})}
                placeholder="Ex: Photoshop, Illustrator, Teoria das Cores..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>

            {/* Portfólio */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-red-600" /> Link do Portfólio (Opcional)
              </label>
              <input 
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                placeholder="Ex: Behance, Instagram, Website..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Planos de Visibilidade */}
            <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-200 space-y-4">
              <h3 className="text-lg font-bold text-black flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" /> Queres mais alunos?
              </h3>
              <p className="text-sm text-gray-700">
                Os profissionais em <strong>Destaque</strong> aparecem no topo da lista e recebem 5x mais cliques.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-yellow-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-500 uppercase">Plano Grátis</p>
                  <p className="text-xl font-black text-black">0 Kz</p>
                  <ul className="text-xs text-gray-600 mt-2 space-y-1">
                    <li>• Perfil visível na lista</li>
                    <li>• Chat direto com alunos</li>
                    <li>• Comissão: 10% por sessão</li>
                  </ul>
                </div>
                <div className="bg-black p-4 rounded-2xl border border-gray-800 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[8px] font-bold px-2 py-1 rounded-bl-lg">RECOMENDADO</div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Plano Destaque</p>
                  <p className="text-xl font-black text-white">5.000 Kz <span className="text-[10px] font-normal text-gray-400">/mês</span></p>
                  <ul className="text-xs text-gray-300 mt-2 space-y-1">
                    <li>• Topo da lista (Prioridade)</li>
                    <li>• Selo de Verificado</li>
                    <li>• Comissão: 0% (Fica com tudo)</li>
                  </ul>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 italic">
                * Após o cadastro, a nossa equipa entrará em contacto para ativar o plano escolhido.
              </p>
            </div>

            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-black hover:bg-red-600 disabled:bg-gray-400 text-white py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'A processar...' : 'Cadastrar como Profissional'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
