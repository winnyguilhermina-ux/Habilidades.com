import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Globe, Clock, Award, ArrowRight, User, CheckCircle } from 'lucide-react';
import { CURSOS } from '../constants';
import React, { useEffect, useState } from 'react';
import { Profissional } from '../types';
import { db, collection, getDocs, query, where, handleFirestoreError, OperationType } from '../firebase';

export default function ProfessionalsList() {
  const [searchParams] = useSearchParams();
  const cursoId = searchParams.get('curso');
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfissionais = async () => {
      setLoading(true);
      try {
        const path = 'profissionais';
        const profRef = collection(db, path);
        const q = cursoId 
          ? query(profRef, where('cursoId', '==', cursoId))
          : profRef;
        
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Profissional[];
        
        // Sort by destaque first
        const sorted = fetched.sort((a, b) => {
          if (a.destaque && !b.destaque) return -1;
          if (!a.destaque && b.destaque) return 1;
          return 0;
        });
        
        setProfissionais(sorted);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'profissionais');
      } finally {
        setLoading(false);
      }
    };

    fetchProfissionais();
  }, [cursoId]);

  const selectedCurso = CURSOS.find(c => c.id === cursoId);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link to="/cursos" className="text-red-600 font-bold flex items-center gap-2 mb-4 hover:gap-3 transition-all">
            <ArrowRight className="w-4 h-4 rotate-180" /> Voltar aos Cursos
          </Link>
          <h1 className="text-4xl font-extrabold text-black tracking-tighter">
            {selectedCurso ? `Profissionais de ${selectedCurso.nome}` : 'Todos os Profissionais'}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Encontra o mentor ideal para a tua jornada de aprendizagem.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : profissionais.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-2">Nenhum profissional encontrado</h2>
            <p className="text-gray-600">Seja o primeiro a ensinar este curso!</p>
            <Link to="/ensinar" className="mt-6 inline-block bg-red-600 text-white px-8 py-3 rounded-full font-bold">
              Quero Ensinar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profissionais.map((prof, index) => (
              <motion.div
                key={prof.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-3xl overflow-hidden shadow-sm border ${prof.destaque ? 'border-yellow-400 ring-2 ring-yellow-400/20' : 'border-gray-100'} hover:shadow-xl transition-all group relative`}
              >
                {prof.destaque && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg z-10">
                    Destaque
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 ${prof.verificado ? 'border-blue-500' : 'border-yellow-400'}`}>
                      <img 
                        src={prof.fotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(prof.nomeCompleto)}&background=random`} 
                        alt={prof.nomeCompleto} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="text-xl font-bold text-black">{prof.nomeCompleto}</h3>
                        {prof.verificado && (
                          <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-50" />
                        )}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm gap-1">
                        <MapPin className="w-3 h-3" /> {prof.cidade}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Globe className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium capitalize">Modalidade: {prof.modalidade}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">Experiência: {prof.experiencia}</span>
                    </div>
                    {prof.certificado && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Award className="w-4 h-4" />
                        <span className="text-sm font-bold">Certificado</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">A partir de</p>
                      <p className="text-2xl font-black text-black">{prof.preco.toLocaleString()} Kz</p>
                    </div>
                    <Link 
                      to={`/perfil/${prof.id}`}
                      className="bg-black hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                    >
                      Ver Perfil
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
