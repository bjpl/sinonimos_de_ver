'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import ResourceLibrary from '@/components/ResourceLibrary'
import WhatsAppCTA from '@/components/WhatsAppCTA'
import OfflineNotice from '@/components/OfflineNotice'

export default function Home() {
  const [isOnline, setIsOnline] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'repartidor' | 'conductor'>('all')
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'basico' | 'intermedio'>('all')

  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <main id="main-content" className="min-h-screen" role="main">
      {!isOnline && <OfflineNotice />}

      <Hero />
      
      <section className="px-4 py-8 max-w-6xl mx-auto" aria-labelledby="community-heading">
        <div className="mb-8">
          <h2 id="community-heading" className="text-2xl font-bold mb-4">Únete a Nuestra Comunidad</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <WhatsAppCTA 
              title="Grupo Principiantes"
              description="Para quienes están empezando con el inglés"
              members="523 miembros"
              link="https://chat.whatsapp.com/example1"
            />
            <WhatsAppCTA 
              title="Práctica Diaria"
              description="Practica con otros conductores y repartidores"
              members="341 miembros"
              link="https://chat.whatsapp.com/example2"
            />
          </div>
        </div>

        <div className="mb-6" role="region" aria-label="Filtros de recursos">
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-labelledby="category-filter-label">
            <span id="category-filter-label" className="text-sm font-medium">Filtrar por trabajo:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              aria-pressed={selectedCategory === 'all'}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-accent-blue text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCategory('repartidor')}
              aria-pressed={selectedCategory === 'repartidor'}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === 'repartidor'
                  ? 'bg-rappi text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Repartidor
            </button>
            <button
              onClick={() => setSelectedCategory('conductor')}
              aria-pressed={selectedCategory === 'conductor'}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === 'conductor'
                  ? 'bg-uber text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Conductor
            </button>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="level-filter-label">
            <span id="level-filter-label" className="text-sm font-medium">Nivel:</span>
            <button
              onClick={() => setSelectedLevel('all')}
              aria-pressed={selectedLevel === 'all'}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedLevel === 'all'
                  ? 'bg-accent-green text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedLevel('basico')}
              aria-pressed={selectedLevel === 'basico'}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedLevel === 'basico'
                  ? 'bg-accent-green text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Básico
            </button>
            <button
              onClick={() => setSelectedLevel('intermedio')}
              aria-pressed={selectedLevel === 'intermedio'}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedLevel === 'intermedio'
                  ? 'bg-accent-green text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Intermedio
            </button>
          </div>
        </div>

        <ResourceLibrary 
          category={selectedCategory}
          level={selectedLevel}
        />
      </section>

      <footer className="bg-gray-100 px-4 py-8 mt-12">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
          <p className="mb-2">Hablas.co - Recursos gratuitos para trabajadores colombianos</p>
          <p>Hecho con ❤️ en Medellín para toda Colombia</p>
        </div>
      </footer>
    </main>
  )
}