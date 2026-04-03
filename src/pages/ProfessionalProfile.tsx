import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Globe, Clock, Award, ArrowRight, User, CheckCircle, MessageCircle, Send, Share2 } from 'lucide-react';
import { CURSOS } from '../constants';
import React, { useEffect, useState } from 'react';
import { Profissional } from '../types';
import { db, doc, getDoc, handleFirestoreError, OperationType, collection, addDoc, query, where, orderBy, onSnapshot } from '../firebase';

export default function ProfessionalProfile() {
  const { id } = useParams();
  const [prof, setProf] = useState<Profissional | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [alunoNome, setAlunoNome] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProf = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'profissionais', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProf({ id: docSnap.id, ...docSnap.data() } as Profissional);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `profissionais/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProf();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, 'mensagens'),
      where('profissionalId', '==', id),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'mensagens');
    });

    return () => unsubscribe();
  }, [id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !alunoNome.trim() || !id) return;

    setSending(true);
    try {
      await addDoc(collection(db, 'mensagens'), {
        profissionalId: id,
        alunoNome,
        conteudo: newMessage,
        createdAt: new Date().toISOString(),
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'mensagens');
    } finally {
      setSending(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Hab.com - ${prof?.nomeCompleto}`,
      text: `Confira o perfil de ${prof?.nomeCompleto} na Hab.com!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar link:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!prof) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-2">Profissional não encontrado</h2>
          <Link to="/cursos" className="text-red-600 font-bold">Ver todos os cursos</Link>
        </div>
      </div>
    );
  }

  const curso = CURSOS.find(c => c.id === prof.cursoId);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/profissionais?curso=${prof.cursoId}`} className="text-red-600 font-bold flex items-center gap-2 mb-8 hover:gap-3 transition-all">
          <ArrowRight className="w-4 h-4 rotate-180" /> Voltar à lista
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          {/* Header */}
          <div className="bg-black p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 blur-[100px] opacity-30 rounded-full"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl">
                <img 
                  src={prof.fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(prof.nomeCompleto)}&background=random`} 
                  alt={prof.nomeCompleto} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-4xl font-extrabold tracking-tighter">{prof.nomeCompleto}</h1>
                  {prof.verificado && (
                    <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-50" />
                  )}
                </div>
                <p className="text-yellow-400 text-xl font-bold mb-4">{curso?.nome}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium opacity-80">
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {prof.cidade}</div>
                  <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {prof.experiencia} de exp.</div>
                  {prof.certificado && <div className="flex items-center gap-1 text-yellow-400"><Award className="w-4 h-4" /> Certificado</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-12">
                <section>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-red-600" /> Biografia
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {prof.biografia}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-red-600" /> O que vais aprender
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-gray-700 text-lg font-medium">
                      {prof.oQueEnsina}
                    </p>
                  </div>
                </section>

                {/* Chat Section */}
                <section className="mt-12 border-t pt-12">
                  <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-red-600" /> Chat com o Profissional
                  </h2>
                  
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="h-80 overflow-y-auto p-6 space-y-4 bg-gray-50">
                      {messages.length === 0 ? (
                        <p className="text-center text-gray-400 mt-10">Nenhuma mensagem ainda. Seja o primeiro a perguntar!</p>
                      ) : (
                        messages.map((msg) => (
                          <div key={msg.id} className="flex flex-col">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-sm text-red-600">{msg.alunoNome}</span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(msg.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm mt-1">
                              <p className="text-gray-700">{msg.conteudo}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                          <input
                            type="text"
                            placeholder="Teu nome"
                            value={alunoNome}
                            onChange={(e) => setAlunoNome(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none text-sm"
                            required
                          />
                        </div>
                        <div className="md:col-span-3 flex gap-2">
                          <input
                            type="text"
                            placeholder="Escreve uma mensagem..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none text-sm"
                            required
                          />
                          <button
                            type="submit"
                            disabled={sending}
                            className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <p className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-2">Investimento</p>
                  <p className="text-4xl font-black text-black mb-6">{prof.preco.toLocaleString()} Kz <span className="text-sm font-normal text-gray-500">/sessão</span></p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Modalidade</span>
                      <span className="font-bold text-black capitalize">{prof.modalidade}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Cidade</span>
                      <span className="font-bold text-black">{prof.cidade}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link 
                      to={`/inscricao?prof=${prof.id}&curso=${prof.cursoId}`}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                    >
                      Quero aprender <ArrowRight className="w-5 h-5" />
                    </Link>

                    <button 
                      onClick={handleShare}
                      className="w-full bg-white border-2 border-gray-200 hover:border-red-600 text-black py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
                    >
                      <Share2 className="w-5 h-5 group-hover:text-red-600" /> 
                      {copied ? 'Link copiado!' : 'Partilhar perfil'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Resposta em menos de 24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
