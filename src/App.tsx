import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import ProfessionalsList from './pages/ProfessionalsList';
import ProfessionalProfile from './pages/ProfessionalProfile';
import EnrollmentForm from './pages/EnrollmentForm';
import TeacherRegistration from './pages/TeacherRegistration';
import Contact from './pages/Contact';
import { useEffect, useState } from 'react';
import { Smartphone } from 'lucide-react';

export default function App() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone || 
                               document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans selection:bg-red-200 selection:text-red-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cursos" element={<Courses />} />
            <Route path="/profissionais" element={<ProfessionalsList />} />
            <Route path="/perfil/:id" element={<ProfessionalProfile />} />
            <Route path="/inscricao" element={<EnrollmentForm />} />
            <Route path="/ensinar" element={<TeacherRegistration />} />
            <Route path="/contacto" element={<Contact />} />
          </Routes>
        </main>

        {!isStandalone && (
          <div className="md:hidden bg-red-600 text-white p-3 text-center text-xs font-bold flex items-center justify-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span>Dica: Adiciona ao Ecrã Principal para usares como App!</span>
          </div>
        )}
        
        <footer className="bg-black text-white py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-2xl font-bold tracking-tighter">
                Hab<span className="text-red-600">.</span>com
              </div>
              <div className="flex gap-8 text-sm font-medium text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                <a href="#" className="hover:text-white transition-colors">Contacto</a>
              </div>
              <div className="text-sm text-gray-500">
                © 2026 Hab.com. Feito com ❤️ em Luanda.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
