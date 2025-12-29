import { Shield, Github, Linkedin, Mail, Code, Database, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const technologies = {
    frontend: [
      { name: 'React 18', icon: '⚛️' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'Vite', icon: '⚡' },
      { name: 'Tailwind CSS', icon: '🎨' },
      { name: 'Three.js', icon: '🎲' },
      { name: 'Recharts', icon: '📊' },
    ],
    backend: [
      { name: 'NestJS', icon: '🐱' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'Prisma ORM', icon: '🔷' },
      { name: 'Socket.io', icon: '🔌' },
      { name: 'Zod', icon: '✅' },
      { name: 'Swagger', icon: '📚' },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gradient mb-4">DNS Security Platform</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Образовательная платформа для изучения и симуляции DNS Spoofing атак с демонстрацией эффективных методов защиты
        </p>
      </motion.div>

      {/* Project Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">О проекте</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            Данная работа посвящена моделированию и изучению атак подмены DNS-записей (DNS Spoofing) 
            с последующей разработкой эффективных методов защиты от подобных угроз.
          </p>
          <p>
            В рамках проекта создана платформа, которая позволяет воспроизводить сценарии атаки 
            и тестировать механизмы обнаружения и предотвращения, включая DNSSEC, фильтрацию трафика и другие меры.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <Code className="w-10 h-10 text-cyber-blue mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Симуляция атак</h3>
            <p className="text-sm text-gray-400">
              4 типа DNS атак с настраиваемой интенсивностью и длительностью
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <Database className="w-10 h-10 text-cyber-purple mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Real-time мониторинг</h3>
            <p className="text-sm text-gray-400">
              Визуализация процессов и метрик в реальном времени через WebSocket
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <Globe className="w-10 h-10 text-cyber-green mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Защитные механизмы</h3>
            <p className="text-sm text-gray-400">
              DNSSEC валидация, Firewall правила, Rate limiting
            </p>
          </div>
        </div>
      </motion.div>

      {/* Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Технологический стек</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Frontend */}
          <div>
            <h3 className="text-lg font-semibold text-cyber-blue mb-4 flex items-center">
              <span className="w-8 h-8 bg-cyber-blue/20 rounded-lg flex items-center justify-center mr-3">
                ⚛️
              </span>
              Frontend
            </h3>
            <div className="space-y-2">
              {technologies.frontend.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyber-blue/50 transition-colors"
                >
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="text-white">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div>
            <h3 className="text-lg font-semibold text-cyber-purple mb-4 flex items-center">
              <span className="w-8 h-8 bg-cyber-purple/20 rounded-lg flex items-center justify-center mr-3">
                🐱
              </span>
              Backend
            </h3>
            <div className="space-y-2">
              {technologies.backend.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyber-purple/50 transition-colors"
                >
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="text-white">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Ключевые возможности</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            '3D визуализация сетевого трафика (Three.js)',
            'Real-time обновления через WebSocket',
            '4 типа DNS Spoofing атак',
            'DNSSEC криптографическая защита',
            'Настраиваемые Firewall правила',
            'Интерактивные графики и аналитика',
            'Экспорт отчётов в PDF/CSV',
            'Адаптивный дизайн для всех устройств',
            'REST API с Swagger документацией',
            'PostgreSQL с Prisma ORM',
            'TypeScript для типобезопасности',
            'Zod валидация всех данных',
          ].map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <span className="text-cyber-green mt-1">✅</span>
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Author */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Автор</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center text-3xl font-bold text-white">
            U
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-2">Uchiha</h3>
            <p className="text-gray-400 mb-4">
              Студент, специализация: Кибербезопасность
            </p>
            <p className="text-gray-300 mb-6">
              Дипломный проект: "DNS Spoofing Attack Simulation and Mitigation"
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a
                href="mailto:your.email@example.com"
                className="flex items-center space-x-2 px-4 py-2 bg-cyber-blue/20 text-cyber-blue rounded-lg hover:bg-cyber-blue/30 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-cyber-purple/20 text-cyber-purple rounded-lg hover:bg-cyber-purple/30 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* License */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center text-gray-500 text-sm"
      >
        <p>© 2025 DNS Security Platform. Дипломный проект.</p>
        <p className="mt-2">
          Создано для образовательных целей. Не использовать для реальных атак.
        </p>
      </motion.div>
    </div>
  );
};

export default About;