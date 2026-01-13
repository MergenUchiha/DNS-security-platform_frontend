import { Shield, Github, Linkedin, Mail, Code, Database, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '../../i18n';

const About = () => {
  const { t } = useI18n();

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
        <h1 className="text-4xl font-bold text-gradient mb-4">{t.about.title}</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          {t.about.subtitle}
        </p>
      </motion.div>

      {/* Project Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">{t.about.aboutProject}</h2>
        <div className="space-y-4 text-gray-300">
          <p>{t.about.projectDesc1}</p>
          <p>{t.about.projectDesc2}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <Code className="w-10 h-10 text-cyber-blue mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{t.about.attackSimulation}</h3>
            <p className="text-sm text-gray-400">
              {t.about.attackSimulationDesc}
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <Database className="w-10 h-10 text-cyber-purple mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{t.about.realtimeMonitoring}</h3>
            <p className="text-sm text-gray-400">
              {t.about.realtimeMonitoringDesc}
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <Globe className="w-10 h-10 text-cyber-green mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{t.about.protectionMechanisms}</h3>
            <p className="text-sm text-gray-400">
              {t.about.protectionMechanismsDesc}
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
        <h2 className="text-2xl font-bold text-white mb-6">{t.about.techStack}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Frontend */}
          <div>
            <h3 className="text-lg font-semibold text-cyber-blue mb-4 flex items-center">
              <span className="w-8 h-8 bg-cyber-blue/20 rounded-lg flex items-center justify-center mr-3">
                ⚛️
              </span>
              {t.about.frontend}
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
              {t.about.backend}
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
        <h2 className="text-2xl font-bold text-white mb-6">{t.about.keyFeatures}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t.about.features.map((feature, idx) => (
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

      
      {/* License */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center text-gray-500 text-sm"
      >
        <p>{t.about.footer}</p>
        <p className="mt-2">{t.about.footerWarning}</p>
      </motion.div>
    </div>
  );
};

export default About;