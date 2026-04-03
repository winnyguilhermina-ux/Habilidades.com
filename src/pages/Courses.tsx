import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Palette, Video, Megaphone, ArrowRight } from 'lucide-react';
import { CURSOS } from '../constants';

const icons: Record<string, any> = {
  Palette,
  Video,
  Megaphone
};

export default function Courses() {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-black tracking-tighter mb-4"
          >
            Nossos Cursos
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Escolhe a tua jornada e começa a desenvolver as habilidades que o mercado procura.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CURSOS.map((curso, index) => {
            const Icon = icons[curso.icone];
            return (
              <motion.div
                key={curso.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all group flex flex-col h-full"
              >
                <div className="h-48 bg-black relative overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/${curso.id}/800/400`} 
                    alt={curso.nome} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-black mb-4">{curso.nome}</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed flex-grow">{curso.descricao}</p>
                  
                  <Link 
                    to={`/profissionais?curso=${curso.id}`}
                    className="w-full bg-black hover:bg-red-600 text-white py-4 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    Ver Profissionais <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
