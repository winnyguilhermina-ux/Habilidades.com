import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-black tracking-tighter mb-4"
          >
            Fala Connosco
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Tens alguma dúvida ou sugestão? Estamos aqui para ajudar.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-black mb-8">Informações de Contacto</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-50 p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-black">Telefone / WhatsApp</p>
                    <p className="text-gray-600">+244 948 793 923</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-red-50 p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-black">Email</p>
                    <p className="text-gray-600">carlosngolacr@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-red-50 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-black">Escritório</p>
                    <p className="text-gray-600">Talatona, Luanda, Angola</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black p-8 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 blur-[60px] opacity-30 rounded-full"></div>
              <h3 className="text-xl font-bold mb-4 relative z-10">Horário de Atendimento</h3>
              <p className="text-gray-400 relative z-10">Segunda a Sexta: 08:00 - 18:00</p>
              <p className="text-gray-400 relative z-10">Sábado: 09:00 - 13:00</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-black mb-4">Mensagem Enviada!</h2>
                <p className="text-gray-600 mb-8">Obrigado pelo teu contacto. Responderemos o mais breve possível.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-red-600 font-bold"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nome</label>
                    <input 
                      required
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Assunto</label>
                  <input 
                    required
                    type="text"
                    value={formData.assunto}
                    onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Mensagem</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.mensagem}
                    onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none transition-all resize-none"
                  ></textarea>
                </div>
                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'A enviar...' : 'Enviar Mensagem'} <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
