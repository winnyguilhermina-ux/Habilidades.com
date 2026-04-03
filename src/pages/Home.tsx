import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Palette, Video, Megaphone, ArrowRight, CheckCircle } from 'lucide-react';
import { CURSOS } from '../constants';

const icons: Record<string, any> = {
  Palette,
  Video,
  Megaphone
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-black overflow-hidden">
              {/* Background Accents */}
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-400 blur-[120px] rounded-full"></div>
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-yellow-400 text-sm font-bold mb-8 border border-white/20">
                  <CheckCircle className="w-4 h-4" /> Profissionais Verificados e Qualificados
                </div>
                <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter mb-6"
          >
            Aprenda de forma prática e rápida<br />
            <span className="text-yellow-400">habilidades que te dará dinheiro.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Aprende com profissionais reais e desenvolve habilidades digitais na prática. O teu futuro começa aqui.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/cursos" 
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
            >
              Quero Aprender <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/ensinar" 
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl"
            >
              Quero Ensinar
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Courses - Reduced */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-black tracking-tight">Cursos em Destaque</h2>
              <p className="text-sm text-gray-600">As habilidades mais procuradas em Luanda.</p>
            </div>
            <Link to="/cursos" className="text-red-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Ver todos os cursos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CURSOS.map((curso, index) => {
              const Icon = icons[curso.icone];
              return (
                <motion.div
                  key={curso.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-red-200 transition-all group"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                    <Icon className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2 leading-tight">{curso.nome}</h3>
                  <Link 
                    to={`/profissionais?curso=${curso.id}`}
                    className="inline-flex items-center text-xs text-red-600 font-bold hover:underline"
                  >
                    Mentores <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prominent Teacher CTA */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
              <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-red-600 blur-[100px] rounded-full"></div>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-6">
                  Oportunidade
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-none">
                  És um profissional?<br />
                  <span className="text-yellow-400">Começa a ensinar hoje.</span>
                </h2>
                <p className="text-gray-400 text-lg mb-10 max-w-md">
                  Junta-te à maior rede de mentores de Angola. Partilha o teu conhecimento e cria uma nova fonte de rendimento.
                </p>
                <Link 
                  to="/ensinar" 
                  className="inline-flex items-center bg-white text-black px-10 py-4 rounded-full text-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-xl gap-2"
                >
                  Cadastrar como Professor <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                    <p className="text-2xl font-black text-white mb-1">80%</p>
                    <p className="text-xs text-gray-400 uppercase font-bold">Ganhos Diretos</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                    <p className="text-2xl font-black text-white mb-1">+500</p>
                    <p className="text-xs text-gray-400 uppercase font-bold">Alunos Ativos</p>
                  </div>
                </div>
                <div className="pt-8 space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                    <p className="text-2xl font-black text-white mb-1">0 Kz</p>
                    <p className="text-xs text-gray-400 uppercase font-bold">Custo Inicial</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                    <p className="text-2xl font-black text-white mb-1">24h</p>
                    <p className="text-xs text-gray-400 uppercase font-bold">Aprovação Rápida</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Como funciona?</h2>
            <p className="text-lg text-gray-400">Três passos simples para transformares a tua carreira.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Escolhe o teu Curso",
                desc: "Navega pelos nossos cursos digitais e escolhe o que mais se adapta aos teus objetivos."
              },
              {
                step: "02",
                title: "Conecta-te com um Mentor",
                desc: "Vê os perfis dos profissionais certificados e escolhe com quem queres aprender."
              },
              {
                step: "03",
                title: "Começa a Praticar",
                desc: "Aulas dinâmicas e práticas para que possas começar a ganhar dinheiro rapidamente."
              }
            ].map((item, i) => (
              <div key={i} className="relative p-8 bg-gray-800 rounded-3xl border border-gray-700">
                <span className="text-6xl font-black text-red-600/20 absolute top-4 right-8">{item.step}</span>
                <h3 className="text-2xl font-bold mb-4 relative z-10">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Hab.com */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black tracking-tight mb-8">Porquê escolher a Hab.com?</h2>
              <div className="space-y-6">
                {[
                  "Aprende com quem já faz acontecer no mercado.",
                  "Foco 100% prático e orientado a resultados.",
                  "Conexão direta com mentores certificados.",
                  "Flexibilidade de horários e modalidades."
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 bg-yellow-400 rounded-full p-1">
                      <CheckCircle className="w-5 h-5 text-black" />
                    </div>
                    <p className="text-lg text-gray-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/angola-tech/800/800" 
                  alt="Aprendizagem Prática" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-red-600 text-white p-8 rounded-3xl shadow-xl hidden md:block">
                <p className="text-3xl font-bold">+500</p>
                <p className="text-sm uppercase tracking-widest font-bold opacity-80">Alunos Formados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-8">Pronto para transformar a tua carreira?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/cursos" className="w-full sm:w-auto bg-white text-red-600 px-10 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-all shadow-2xl">
              Começar Agora
            </Link>
            <Link to="/ensinar" className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-gray-900 transition-all shadow-2xl">
              Quero Ensinar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
