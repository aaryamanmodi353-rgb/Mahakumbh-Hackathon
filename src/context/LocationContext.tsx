'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';

type LocationKey = 'prayagraj' | 'haridwar' | 'ujjain' | 'nashik';

interface LocationData {
  name: string;
  coords: [number, number];
  zoom: number;
  stats: { footfall: number; vehicles: number; alerts: number; footfallTrend: string };
  insights: { type: string; text: string }[];
  hotspots: { coords: [number, number]; radius: number; color: string; label: string }[];
  parkingLots: { id: string; name: string; capacity: number; filled: number; status: string }[];
  crowdTrend: { time: string; yesterday: number; today: number | null }[];
  zoneDensity: { zone: string; density: number; color: string }[];
  logs: { id: number; type: string; message: string; time: string; status: string }[];
  riverData: { waterLevel: number; warningLevel: number; speed: number; safe: boolean };
}

const initialLocationsData: Record<LocationKey, LocationData> = {
  prayagraj: {
    name: 'Prayagraj (Allahabad)',
    coords: [25.4358, 81.8463],
    zoom: 14,
    stats: { footfall: 2400000, vehicles: 14230, alerts: 3, footfallTrend: '+12% vs yesterday' },
    insights: [
      { type: 'danger', text: 'Stampede risk at Sangam Approach Road in 45 mins. Reroute advised.' },
      { type: 'warning', text: 'Parking Lot B will reach capacity in 15 mins. Diverting to Lot C.' },
      { type: 'success', text: 'Traffic flow normalized on Bridge 2.' }
    ],
    hotspots: [
      { coords: [25.4358, 81.8463], radius: 400, color: 'var(--accent-danger)', label: 'High Crowd Density: Triveni Sangam' },
      { coords: [25.4484, 81.8333], radius: 300, color: 'var(--accent-warning)', label: 'Moderate Crowd: Railway Station' }
    ],
    parkingLots: [
      { id: 'A', name: 'Zone A (Main Ghat)', capacity: 5000, filled: 4250, status: 'warning' },
      { id: 'B', name: 'Zone B (Transit Hub)', capacity: 3000, filled: 1200, status: 'good' },
      { id: 'C', name: 'Zone C (North Approach)', capacity: 4000, filled: 3900, status: 'danger' },
      { id: 'VIP', name: 'VIP Parking', capacity: 500, filled: 150, status: 'good' },
    ],
    crowdTrend: [
      { time: '06:00', yesterday: 4000, today: 4200 },
      { time: '08:00', yesterday: 5000, today: 5800 },
      { time: '10:00', yesterday: 6500, today: 7800 },
      { time: '12:00', yesterday: 8000, today: 9500 },
      { time: '14:00', yesterday: 8200, today: 9200 },
      { time: '16:00', yesterday: 7500, today: 8500 },
      { time: '18:00', yesterday: 6000, today: null },
    ],
    zoneDensity: [
      { zone: 'Sangam Ghat', density: 95, color: 'var(--accent-danger)' },
      { zone: 'Main Transit Hub', density: 75, color: 'var(--accent-warning)' },
      { zone: 'Food Court 1', density: 45, color: 'var(--accent-success)' },
    ],
    logs: [
      { id: 1, type: 'danger', message: 'Stampede risk at Sangam Approach Road.', time: '10:45 AM', status: 'Active' },
      { id: 2, type: 'warning', message: 'Parking Lot B will reach capacity in 15 mins.', time: '10:30 AM', status: 'Active' },
    ],
    riverData: { waterLevel: 78.5, warningLevel: 80.0, speed: 2.3, safe: true }
  },
  ujjain: {
    name: 'Ujjain',
    coords: [23.1793, 75.7849],
    zoom: 14,
    stats: { footfall: 1200000, vehicles: 8400, alerts: 1, footfallTrend: '+5% vs yesterday' },
    insights: [
      { type: 'warning', text: 'Mahakaleshwar Temple queue exceeding 2 hours.' },
      { type: 'success', text: 'Ram Ghat area clear and moving smoothly.' }
    ],
    hotspots: [
      { coords: [23.1827, 75.7682], radius: 350, color: 'var(--accent-danger)', label: 'Mahakaleshwar Temple: Heavy Queue' },
      { coords: [23.1882, 75.7725], radius: 250, color: 'var(--accent-warning)', label: 'Ram Ghat: Moderate' }
    ],
    parkingLots: [
      { id: 'U1', name: 'Nanakheda Parking', capacity: 3000, filled: 2800, status: 'danger' },
      { id: 'U2', name: 'Hari Phatak', capacity: 2000, filled: 800, status: 'good' },
    ],
    crowdTrend: [
      { time: '06:00', yesterday: 2000, today: 2100 },
      { time: '08:00', yesterday: 3000, today: 3400 },
      { time: '10:00', yesterday: 4000, today: 4200 },
      { time: '12:00', yesterday: 4500, today: 4800 },
      { time: '14:00', yesterday: 4200, today: 4500 },
      { time: '16:00', yesterday: 4000, today: 4300 },
      { time: '18:00', yesterday: 3500, today: null },
    ],
    zoneDensity: [
      { zone: 'Temple Complex', density: 88, color: 'var(--accent-danger)' },
      { zone: 'Ram Ghat', density: 60, color: 'var(--accent-warning)' },
    ],
    logs: [
      { id: 1, type: 'warning', message: 'Temple queue exceeding 2 hours.', time: '11:00 AM', status: 'Active' },
    ],
    riverData: { waterLevel: 45.2, warningLevel: 48.0, speed: 1.5, safe: true }
  },
  haridwar: {
    name: 'Haridwar',
    coords: [29.9457, 78.1642],
    zoom: 14,
    stats: { footfall: 1800000, vehicles: 11000, alerts: 2, footfallTrend: '+8% vs yesterday' },
    insights: [
      { type: 'danger', text: 'Har Ki Pauri nearing maximum capacity.' },
      { type: 'warning', text: 'Traffic diversion active on Highway 58.' }
    ],
    hotspots: [
      { coords: [29.9566, 78.1700], radius: 400, color: 'var(--accent-danger)', label: 'Har Ki Pauri: Max Capacity' },
      { coords: [29.9320, 78.1550], radius: 300, color: 'var(--accent-warning)', label: 'Chandi Ghat Bridge: Slow Traffic' }
    ],
    parkingLots: [
      { id: 'H1', name: 'Bairagi Camp', capacity: 6000, filled: 5500, status: 'warning' },
      { id: 'H2', name: 'Rishikul Ground', capacity: 2500, filled: 1000, status: 'good' },
    ],
    crowdTrend: [
      { time: '06:00', yesterday: 3000, today: 3500 },
      { time: '08:00', yesterday: 4500, today: 5000 },
      { time: '10:00', yesterday: 5500, today: 6200 },
      { time: '12:00', yesterday: 6000, today: 7000 },
      { time: '14:00', yesterday: 5800, today: 6500 },
      { time: '16:00', yesterday: 5000, today: 5500 },
      { time: '18:00', yesterday: 4500, today: null },
    ],
    zoneDensity: [
      { zone: 'Har Ki Pauri', density: 92, color: 'var(--accent-danger)' },
      { zone: 'Chandi Ghat', density: 65, color: 'var(--accent-warning)' },
    ],
    logs: [
      { id: 1, type: 'danger', message: 'Har Ki Pauri nearing maximum capacity.', time: '09:00 AM', status: 'Active' },
      { id: 2, type: 'warning', message: 'Traffic diversion active on Highway 58.', time: '08:30 AM', status: 'Active' },
    ],
    riverData: { waterLevel: 288.0, warningLevel: 289.5, speed: 4.1, safe: false }
  },
  nashik: {
    name: 'Nashik',
    coords: [19.9975, 73.7898],
    zoom: 14,
    stats: { footfall: 900000, vehicles: 6500, alerts: 0, footfallTrend: '-2% vs yesterday' },
    insights: [
      { type: 'success', text: 'Ramkund area operating normally.' },
      { type: 'success', text: 'All parking lots have available space.' }
    ],
    hotspots: [
      { coords: [20.0055, 73.7938], radius: 200, color: 'var(--accent-success)', label: 'Ramkund: Normal Flow' },
      { coords: [20.0100, 73.7850], radius: 250, color: 'var(--accent-success)', label: 'Tapovan: Normal Flow' }
    ],
    parkingLots: [
      { id: 'N1', name: 'Panchavati Parking', capacity: 2000, filled: 1200, status: 'good' },
      { id: 'N2', name: 'Tapovan Ground', capacity: 3000, filled: 1500, status: 'good' },
    ],
    crowdTrend: [
      { time: '06:00', yesterday: 1500, today: 1400 },
      { time: '08:00', yesterday: 2500, today: 2400 },
      { time: '10:00', yesterday: 3500, today: 3200 },
      { time: '12:00', yesterday: 4000, today: 3800 },
      { time: '14:00', yesterday: 3800, today: 3600 },
      { time: '16:00', yesterday: 3500, today: 3300 },
      { time: '18:00', yesterday: 3000, today: null },
    ],
    zoneDensity: [
      { zone: 'Ramkund', density: 55, color: 'var(--accent-success)' },
      { zone: 'Tapovan', density: 40, color: 'var(--accent-success)' },
    ],
    logs: [
      { id: 1, type: 'success', message: 'All systems normal.', time: '12:00 PM', status: 'Resolved' }
    ],
    riverData: { waterLevel: 56.4, warningLevel: 59.0, speed: 1.2, safe: true }
  }
};

export const translations = {
  en: {
    commandCenter: "Command Center",
    subtitle: "Real-time Mobility & Crowd Insights",
    liveUpdates: "Live Updates Active",
    hostBadge: "📍 2026 Mahakumbh Host",
    exportReport: "Export Report",
    totalFootfall: "Total Footfall",
    activeVehicles: "Active Vehicles",
    criticalAlerts: "Critical Alerts",
    parkingCapacity: "Parking Capacity",
    allClear: "All clear",
    dataUnavailable: "Data Unavailable",
    aiInsights: "AI Predictive Insights",
    viewAllInsights: "View All Insights",
    riverSafety: "River Safety Monitor",
    waterLevel: "Water Level",
    currentSpeed: "Current Speed",
    safeBathing: "Safe for Bathing",
    unsafeBathing: "Dangerous Currents",
    clearPin: "✕ Clear Custom Pin",
    pinHint: "💡 Click anywhere on the map to drop a surveillance pin.",
    
    // Parking Page
    smartParkingTitle: "Smart Parking Management",
    smartParkingSub: "Real-time allocation and diversion controls.",
    globalDiversion: "Global Traffic Diversion",
    noParking: "No parking lots monitored in this region.",
    spaces: "spaces",
    full: "Full",
    viewMap: "View Map",
    closeLot: "Close Lot",
    divertTraffic: "Divert Traffic Here",
    
    // Crowd Page
    crowdAnalysisTitle: "Crowd Flow Analysis",
    crowdAnalysisSub: "Predictive heatmaps and pedestrian density.",
    footfallTrendTitle: "Footfall Trend (Thousands)",
    currentZoneDensity: "Current Zone Density",
    deployTeams: "Deploy Volunteer Teams",
    
    // Alerts Page
    alertsTitle: "Alerts & Logs",
    alertsSub: "Historical logs, notification triggers, and emergency protocols.",
    severity: "Severity",
    message: "Message",
    time: "Time",
    status: "Status",
    noLogs: "No recent logs for this location."
  },
  hi: {
    commandCenter: "कमांड सेंटर",
    subtitle: "रीयल-टाइम गतिशीलता और भीड़ अंतर्दृष्टि",
    liveUpdates: "लाइव अपडेट सक्रिय",
    hostBadge: "📍 २०२६ महाकुंभ आयोजक",
    exportReport: "रिपोर्ट निर्यात करें",
    totalFootfall: "कुल तीर्थयात्री",
    activeVehicles: "सक्रिय वाहन",
    criticalAlerts: "गंभीर अलर्ट",
    parkingCapacity: "पार्किंग क्षमता",
    allClear: "सब सुरक्षित है",
    dataUnavailable: "डेटा अनुपलब्ध",
    aiInsights: "एआई भविष्यवाणियां",
    viewAllInsights: "सभी अलर्ट देखें",
    riverSafety: "नदी सुरक्षा मॉनिटर",
    waterLevel: "जल स्तर",
    currentSpeed: "जल प्रवाह गति",
    safeBathing: "स्नान के लिए सुरक्षित",
    unsafeBathing: "खतरनाक धाराएं",
    clearPin: "✕ पिन हटाएं",
    pinHint: "💡 सर्विलांस पिन ड्रॉप करने के लिए मैप पर कहीं भी क्लिक करें।",
    
    // Parking Page
    smartParkingTitle: "स्मार्ट पार्किंग प्रबंधन",
    smartParkingSub: "रीयल-टाइम आवंटन और मार्ग परिवर्तन नियंत्रण।",
    globalDiversion: "वैश्विक यातायात परिवर्तन",
    noParking: "इस क्षेत्र में कोई पार्किंग निगरानी नहीं है।",
    spaces: "स्थान",
    full: "पूर्ण",
    viewMap: "मैप देखें",
    closeLot: "पार्किंग बंद करें",
    divertTraffic: "यातायात यहाँ मोड़ें",
    
    // Crowd Page
    crowdAnalysisTitle: "भीड़ प्रवाह विश्लेषण",
    crowdAnalysisSub: "पूर्वानुमान हीटमैप और पैदल यात्री घनत्व।",
    footfallTrendTitle: "तीर्थयात्री प्रवृत्ति (हजारों में)",
    currentZoneDensity: "वर्तमान क्षेत्र घनत्व",
    deployTeams: "स्वयंसेवक टीमें तैनात करें",
    
    // Alerts Page
    alertsTitle: "अलर्ट और लॉग",
    alertsSub: "ऐतिहासिक लॉग, अधिसूचना ट्रिगर, और आपातकालीन प्रोटोकॉल।",
    severity: "गंभीरता",
    message: "संदेश",
    time: "समय",
    status: "स्थिति",
    noLogs: "इस क्षेत्र के लिए कोई हालिया लॉग नहीं है।"
  },
  es: {
    commandCenter: "Centro de Comando",
    subtitle: "Movilidad en tiempo real y flujo de multitudes",
    liveUpdates: "Actualizaciones en vivo",
    hostBadge: "📍 Sede Mahakumbh 2026",
    exportReport: "Exportar Reporte",
    totalFootfall: "Afluencia Total",
    activeVehicles: "Vehículos Activos",
    criticalAlerts: "Alertas Críticas",
    parkingCapacity: "Capacidad Estacionamiento",
    allClear: "Todo despejado",
    dataUnavailable: "Sin Datos",
    aiInsights: "Predicciones IA",
    viewAllInsights: "Ver todas las alertas",
    riverSafety: "Monitor del Río",
    waterLevel: "Nivel de Agua",
    currentSpeed: "Velocidad de Corriente",
    safeBathing: "Baño Seguro",
    unsafeBathing: "Corrientes Peligrosas",
    clearPin: "✕ Borrar Pin",
    pinHint: "💡 Haz clic en el mapa para colocar un pin de vigilancia.",
    
    // Parking Page
    smartParkingTitle: "Gestión Inteligente de Estacionamiento",
    smartParkingSub: "Asignación y desvíos en tiempo real.",
    globalDiversion: "Desvío Global de Tráfico",
    noParking: "No hay estacionamientos monitoreados aquí.",
    spaces: "espacios",
    full: "Lleno",
    viewMap: "Ver Mapa",
    closeLot: "Cerrar Estacionamiento",
    divertTraffic: "Desviar Tráfico Aquí",
    
    // Crowd Page
    crowdAnalysisTitle: "Análisis de Flujo de Multitudes",
    crowdAnalysisSub: "Mapas de calor predictivos y densidad.",
    footfallTrendTitle: "Tendencia de Afluencia (Miles)",
    currentZoneDensity: "Densidad de Zona Actual",
    deployTeams: "Desplegar Voluntarios",
    
    // Alerts Page
    alertsTitle: "Alertas y Registros",
    alertsSub: "Registros históricos y protocolos de emergencia.",
    severity: "Severidad",
    message: "Mensaje",
    time: "Hora",
    status: "Estado",
    noLogs: "No hay registros recientes para esta ubicación."
  },
  fr: {
    commandCenter: "Centre de Commandement",
    subtitle: "Mobilité en temps réel et flux de foule",
    liveUpdates: "Mises à jour en direct",
    hostBadge: "📍 Hôte Mahakumbh 2026",
    exportReport: "Exporter le Rapport",
    totalFootfall: "Affluence Totale",
    activeVehicles: "Véhicules Actifs",
    criticalAlerts: "Alertes Critiques",
    parkingCapacity: "Capacité Parking",
    allClear: "Tout va bien",
    dataUnavailable: "Données Indisponibles",
    aiInsights: "Prédictions IA",
    viewAllInsights: "Voir toutes les alertes",
    riverSafety: "Moniteur du Fleuve",
    waterLevel: "Niveau d'Eau",
    currentSpeed: "Vitesse du Courant",
    safeBathing: "Baignade Sûre",
    unsafeBathing: "Courants Dangereux",
    clearPin: "✕ Effacer le marqueur",
    pinHint: "💡 Cliquez sur la carte pour déposer un marqueur de surveillance.",
    
    // Parking Page
    smartParkingTitle: "Gestion Intelligente du Stationnement",
    smartParkingSub: "Allocation et déviations en temps réel.",
    globalDiversion: "Déviation Globale du Trafic",
    noParking: "Aucun parking surveillé ici.",
    spaces: "places",
    full: "Complet",
    viewMap: "Voir la Carte",
    closeLot: "Fermer le Parking",
    divertTraffic: "Dévier le Trafic Ici",
    
    // Crowd Page
    crowdAnalysisTitle: "Analyse des Flux de Foule",
    crowdAnalysisSub: "Cartes thermiques prédictives et densité.",
    footfallTrendTitle: "Tendance d'Affluence (Milliers)",
    currentZoneDensity: "Densité de Zone Actuelle",
    deployTeams: "Déployer des Volontaires",
    
    // Alerts Page
    alertsTitle: "Alertes et Journaux",
    alertsSub: "Journaux historiques et protocoles d'urgence.",
    severity: "Sévérité",
    message: "Message",
    time: "Heure",
    status: "Statut",
    noLogs: "Aucun journal récent pour cet emplacement."
  }
};

type Language = 'en' | 'hi' | 'es' | 'fr';

export const dynamicDict: Record<string, Record<Language, string>> = {
  // Parking
  'Zone A (Main Ghat)': { en: 'Zone A (Main Ghat)', hi: 'ज़ोन ए (मुख्य घाट)', es: 'Zona A (Ghat Principal)', fr: 'Zone A (Ghat Principal)' },
  'Zone B (Transit Hub)': { en: 'Zone B (Transit Hub)', hi: 'ज़ोन बी (ट्रांजिट हब)', es: 'Zona B (Centro de Tránsito)', fr: 'Zone B (Centre de Transit)' },
  'Zone C (North Approach)': { en: 'Zone C (North Approach)', hi: 'ज़ोन सी (उत्तरी मार्ग)', es: 'Zona C (Acceso Norte)', fr: 'Zone C (Accès Nord)' },
  'VIP Parking': { en: 'VIP Parking', hi: 'वीआईपी पार्किंग', es: 'Estacionamiento VIP', fr: 'Parking VIP' },
  // Zones / Heatmaps
  'Sangam Ghat': { en: 'Sangam Ghat', hi: 'संगम घाट', es: 'Sangam Ghat', fr: 'Sangam Ghat' },
  'Main Transit Hub': { en: 'Main Transit Hub', hi: 'मुख्य ट्रांजिट हब', es: 'Centro de Tránsito', fr: 'Centre de Transit' },
  'Food Court 1': { en: 'Food Court 1', hi: 'फूड कोर्ट 1', es: 'Patio de Comidas 1', fr: 'Aire de Restauration 1' },
  // Trends
  '+12% vs yesterday': { en: '+12% vs yesterday', hi: 'कल की तुलना में +12%', es: '+12% vs ayer', fr: '+12% par rapport à hier' },
  // Insights
  'Stampede risk at Sangam Approach Road in 45 mins. Reroute advised.': { 
    en: 'Stampede risk at Sangam Approach Road in 45 mins. Reroute advised.', 
    hi: '45 मिनट में संगम पहुंच मार्ग पर भगदड़ का जोखिम। मार्ग बदलने की सलाह।', 
    es: 'Riesgo de estampida en 45 min. Se aconseja desvío.', 
    fr: 'Risque de bousculade dans 45 min. Déviation conseillée.' 
  },
  'Parking Lot B will reach capacity in 15 mins. Diverting to Lot C.': {
    en: 'Parking Lot B will reach capacity in 15 mins. Diverting to Lot C.',
    hi: 'पार्किंग बी 15 मिनट में भर जाएगी। सी की ओर मोड़ें।',
    es: 'Lote B lleno en 15 min. Desviando al Lote C.',
    fr: 'Parking B plein dans 15 min. Déviation vers Parking C.'
  },
  'Traffic flow normalized on Bridge 2.': {
    en: 'Traffic flow normalized on Bridge 2.',
    hi: 'पुल 2 पर यातायात सामान्य हुआ।',
    es: 'Tráfico normalizado en Puente 2.',
    fr: 'Trafic normalisé sur le Pont 2.'
  },
  // Hotspots
  'High Crowd Density: Triveni Sangam': { en: 'High Crowd Density: Triveni Sangam', hi: 'अधिक भीड़: त्रिवेणी संगम', es: 'Alta Densidad: Triveni Sangam', fr: 'Haute Densité: Triveni Sangam' },
  'Moderate Crowd: Railway Station': { en: 'Moderate Crowd: Railway Station', hi: 'मध्यम भीड़: रेलवे स्टेशन', es: 'Multitud Moderada: Estación', fr: 'Foule Modérée: Gare' },
  // Logs
  'Stampede risk at Sangam Approach Road.': { en: 'Stampede risk at Sangam Approach Road.', hi: 'संगम मार्ग पर भगदड़ का जोखिम।', es: 'Riesgo de estampida en el acceso.', fr: 'Risque de bousculade sur la route.' },
  // Types
  'Active': { en: 'Active', hi: 'सक्रिय', es: 'Activo', fr: 'Actif' },
  'Resolved': { en: 'Resolved', hi: 'हल हो गया', es: 'Resuelto', fr: 'Résolu' }
};

interface LocationContextType {
  activeLocation: LocationKey;
  setActiveLocation: (loc: LocationKey) => void;
  locationData: LocationData;
  locationsList: { key: LocationKey; name: string }[];
  customPin: [number, number] | null;
  setCustomPin: (pin: [number, number] | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  t_dynamic: (text: string) => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [activeLocation, setActiveLocation] = useState<LocationKey>('prayagraj');
  const [db, setDb] = useState<Record<LocationKey, LocationData>>(initialLocationsData);
  const [customPin, setCustomPin] = useState<[number, number] | null>(null);
  const [pinLocationName, setPinLocationName] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  // Reverse geocoding for custom pin
  useEffect(() => {
    if (customPin) {
      setPinLocationName("Fetching location...");
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${customPin[0]}&lon=${customPin[1]}&format=json`)
        .then(res => res.json())
        .then(data => {
          if (data && data.address) {
            // Pick the most specific geographic name available
            const name = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || "Pinned Area";
            setPinLocationName(name);
          } else {
            setPinLocationName("Custom Pinned Area");
          }
        })
        .catch(() => setPinLocationName("Custom Pinned Area"));
    } else {
      setPinLocationName(null);
    }
  }, [customPin]);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDb(prevDb => {
        const newDb = { ...prevDb };
        // Randomly fluctuate data for all locations
        (Object.keys(newDb) as LocationKey[]).forEach(key => {
          const loc = { ...newDb[key] };
          
          // Fluctuate footfall by +/- 100
          loc.stats.footfall += Math.floor(Math.random() * 200) - 100;
          
          // Fluctuate vehicles by +/- 10
          loc.stats.vehicles += Math.floor(Math.random() * 20) - 10;
          
          // Fluctuate parking
          loc.parkingLots = loc.parkingLots.map(lot => {
            let change = Math.floor(Math.random() * 20) - 10;
            let newFilled = Math.min(Math.max(lot.filled + change, 0), lot.capacity);
            let pct = newFilled / lot.capacity;
            return {
              ...lot,
              filled: newFilled,
              status: pct > 0.9 ? 'danger' : pct > 0.8 ? 'warning' : 'good'
            };
          });
          
          // Fluctuate zone density
          loc.zoneDensity = loc.zoneDensity.map(z => {
            let change = Math.floor(Math.random() * 5) - 2;
            let newDensity = Math.min(Math.max(z.density + change, 10), 100);
            return {
              ...z,
              density: newDensity,
              color: newDensity > 85 ? 'var(--accent-danger)' : newDensity > 70 ? 'var(--accent-warning)' : 'var(--accent-success)'
            };
          });

          // Fluctuate river data safely
          let riverLevelChange = (Math.random() * 0.1) - 0.05;
          let riverSpeedChange = (Math.random() * 0.2) - 0.1;
          
          loc.riverData.waterLevel = Number(Math.max(loc.riverData.waterLevel + riverLevelChange, 0).toFixed(2));
          loc.riverData.speed = Number(Math.max(loc.riverData.speed + riverSpeedChange, 0).toFixed(2));
          
          // Re-evaluate safety based on river limits
          loc.riverData.safe = loc.riverData.waterLevel < loc.riverData.warningLevel && loc.riverData.speed < 3.5;

          newDb[key] = loc;
        });
        return newDb;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const locationData = useMemo(() => {
    let data = db[activeLocation];
    const locName = pinLocationName && pinLocationName !== "Fetching location..." ? pinLocationName : data.name; 
    
    // If a custom pin is dropped, we generate a highly localized mini-dataset
    if (customPin) {
      // Create a deterministic hash based on lat/long to generate consistent mock data for that pin
      const hash = Math.floor((customPin[0] + customPin[1]) * 10000);
      const isHighTraffic = hash % 2 === 0;
      
      // Use the global db data to add real-time noise (fluctuates every 3s)
      const dynamicNoise = data.stats.footfall % 500;
      const pinFootfall = 50000 + (hash % 150000) + dynamicNoise; // 50k to 200k + noise
      const pinVehicles = Math.floor(pinFootfall * 0.05);
      const parkingPct = (hash % 60) + 40 + (dynamicNoise % 5); // 40% to 100%
      
      const dynamicRiverNoise = (data.riverData.waterLevel % 1);
      const riverWaterLevel = Number((30 + (hash % 50) + dynamicRiverNoise).toFixed(2)); 
      const riverSpeed = Number((1 + ((hash % 40) / 10) + (dynamicRiverNoise * 0.5)).toFixed(2));
      const isRiverSafe = riverWaterLevel < 70 && riverSpeed < 3.5;
      
      return {
        ...data, // Keep name, coords, zoom the same
        stats: {
          footfall: pinFootfall,
          vehicles: pinVehicles,
          alerts: isHighTraffic ? 1 : 0,
          footfallTrend: isHighTraffic ? '+25% vs yesterday (Surge)' : '-5% vs yesterday'
        },
        insights: [
          { 
            type: isHighTraffic ? 'warning' : 'success', 
            text: isHighTraffic ? `Sudden crowd surge detected near pinned area in ${locName}.` : `Normal pedestrian flow near pinned area in ${locName}.` 
          }
        ],
        hotspots: [
          { coords: customPin, radius: 250, color: isHighTraffic ? 'var(--accent-danger)' : 'var(--accent-success)', label: `Surveillance Point — ${locName}` }
        ],
        parkingLots: [
          { 
            id: 'CP1', 
            name: `Nearby Transit — ${locName}`, 
            capacity: 1000, 
            filled: Math.floor(1000 * (parkingPct / 100)), 
            status: parkingPct > 90 ? 'danger' : parkingPct > 75 ? 'warning' : 'good' 
          }
        ],
        zoneDensity: [
          { 
            zone: `Pin Radius — ${locName}`, 
            density: isHighTraffic ? 90 : 45, 
            color: isHighTraffic ? 'var(--accent-danger)' : 'var(--accent-success)' 
          }
        ],
        logs: isHighTraffic ? [
          { id: 999, type: 'warning', message: `${locName}: Elevated pedestrian count near pinned area.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: 'Active' }
        ] : [
          { id: 999, type: 'info', message: `${locName}: Surveillance active at pinned area.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), status: 'Resolved' }
        ],
        riverData: {
          waterLevel: riverWaterLevel,
          warningLevel: 70,
          speed: riverSpeed,
          safe: isRiverSafe
        }
      };
    }

    return data;
  }, [activeLocation, db, customPin]);

  const locationsList = Object.entries(db).map(([key, data]) => ({
    key: key as LocationKey,
    name: data.name
  }));

  // Clear pin when changing location
  const handleLocationChange = (loc: LocationKey) => {
    setActiveLocation(loc);
    setCustomPin(null);
  }

  const t = translations[language];
  
  // Helper to translate dynamic database strings, falling back to English if not found
  const t_dynamic = (text: string) => {
    if (dynamicDict[text] && dynamicDict[text][language]) {
      return dynamicDict[text][language];
    }
    // Handle parameterized dynamic strings gracefully if needed
    if (text.startsWith('Normal pedestrian flow near pinned area')) {
      if (language === 'hi') return `पिन किए गए क्षेत्र के पास सामान्य पैदल यात्री प्रवाह (${text.split('in ')[1] || 'Pinned Area'})`;
      if (language === 'es') return `Flujo peatonal normal cerca de la zona fijada en ${text.split('in ')[1] || 'Pinned Area'}`;
      if (language === 'fr') return `Flux piéton normal près de la zone épinglée à ${text.split('in ')[1] || 'Pinned Area'}`;
    }
    if (text.startsWith('Sudden crowd surge detected near pinned area')) {
      if (language === 'hi') return `पिन किए गए क्षेत्र के पास अचानक भीड़ वृद्धि (${text.split('in ')[1] || 'Pinned Area'})`;
      if (language === 'es') return `Aumento repentino de multitudes cerca de la zona fijada en ${text.split('in ')[1] || 'Pinned Area'}`;
      if (language === 'fr') return `Forte augmentation de foule détectée près de la zone épinglée à ${text.split('in ')[1] || 'Pinned Area'}`;
    }
    return text;
  };

  return (
    <LocationContext.Provider value={{ activeLocation, setActiveLocation: handleLocationChange, locationData, locationsList, customPin, setCustomPin, language, setLanguage, t, t_dynamic }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
