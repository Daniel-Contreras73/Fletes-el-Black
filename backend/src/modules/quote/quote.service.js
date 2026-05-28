const axios = require('axios')
const AppError = require('../../utils/AppError')

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'openai/gpt-4.1'

const parseJSON = (raw) => {
  const text = raw.trim()
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new AppError('No se pudo procesar la respuesta de la IA', 500, 'AI_PARSE_ERROR')
  }
}

const getHeaders = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new AppError('API key de IA no configurada en el servidor', 500, 'NO_API_KEY')
  }
  return {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
  }
}

const analyzeImages = async (images, zone) => {
  const headers = getHeaders()

  const imageContent = images.map(img => ({
    type: 'image_url',
    image_url: { url: `data:${img.mime};base64,${img.base64}` }
  }))

  const prompt = `Eres el sistema de cotización de fletes de una empresa en México.
Analiza estas imágenes y detecta TODOS los objetos que se van a transportar.
Clasifica cada objeto en una categoría de tamaño y evalúa su dificultad de manejo.

Responde SOLO con este JSON (sin texto adicional, sin backticks):

{
  "mensaje": "Mensaje corto y amigable sobre lo que viste (máx 2 oraciones)",
  "objetos": [
    {
      "nombre": "Nombre del objeto",
      "emoji": "emoji representativo",
      "estimacion_automatica": true,
      "tamano_categoria": "pequeño" | "mediano" | "grande" | "extra_grande",
      "largo_cm": número estimado o null,
      "ancho_cm": número estimado o null,
      "alto_cm": número estimado o null,
      "peso_kg": número estimado o null,
      "es_irregular": true o false,
      "dificultad": "normal" | "moderada" | "alta",
      "razon_dificultad": "Explicación breve si dificultad no es normal, sino null",
      "confianza": número del 1 al 100,
      "razon_manual": "Si estimacion_automatica es false, explica qué datos necesitas, sino null",
      "guia_foto": "Si necesita más fotos qué foto tomar, sino null"
    }
  ]
}

Reglas de tamaño:
- "pequeño": cajas, sillas, lámparas, TV pequeñas, artículos <20kg
- "mediano": mesas, lavadoras, frigobar, camas individuales, muebles 20-60kg
- "grande": refrigerador mediano, sofá, cama matrimonial, ropero, 60-120kg
- "extra_grande": refrigerador enorme, piano, maquinaria, >120kg o >200cm

Reglas de dificultad:
- "normal": objeto estándar fácil de cargar
- "moderada": objeto voluminoso, frágil, o requiere cuidado especial
- "alta": objeto muy pesado, forma muy irregular, o difícil de maniobrar

Solo marca estimacion_automatica = false si el objeto es MUY inusual o el ángulo impide clasificarlo.
Responde SOLO el JSON sin texto ni backticks.`

  const { data } = await axios.post(OPENROUTER_URL, {
    model: MODEL,
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: [...imageContent, { type: 'text', text: prompt }]
    }]
  }, { headers })

  return parseJSON(data.choices[0].message.content)
}

const calculateQuote = async (objetos, zone, tipo, proteccion = [], dificultades = []) => {
  const headers = getHeaders()

  const tipoLabel = tipo === 'belice' ? 'Internacional — Belice'
    : tipo === 'foraneo_qroo' ? 'Foráneo — Dentro de Quintana Roo'
    : tipo === 'foraneo_nacional' ? 'Foráneo — Fuera de Quintana Roo'
    : 'Local — Chetumal'

  const objsStr = objetos.map(o =>
    `- ${o.nombre}: categoria=${o.tamano_categoria}, peso=${o.peso_kg ?? '?'}kg, dificultad=${o.dificultad}${o.es_irregular ? ', IRREGULAR' : ''}${o.largo_cm ? `, dims=${o.largo_cm}x${o.ancho_cm}x${o.alto_cm}cm` : ''}`
  ).join('\n')

  const extrasLines = []
  if (proteccion.length > 0) extrasLines.push(`Protección solicitada: ${proteccion.join(', ')} — suma $${proteccion.length * 80} MXN`)
  if (dificultades.length > 0) extrasLines.push(`Dificultades adicionales: ${dificultades.join(', ')} — suma $${dificultades.length * 100} MXN`)

  const prompt = `Eres el cotizador de una empresa de fletes en México.
Cotiza cada objeto individualmente.

PRECIOS BASE (por objeto):
- pequeño (<20kg): $50 - $100 MXN
- mediano (20-60kg): $80 - $150 MXN
- grande (60-120kg): $120 - $200 MXN
- extra_grande (>120kg): $180 - $280 MXN

RECARGOS POR OBJETO:
- dificultad "moderada": +$50 MXN
- dificultad "alta": +$100 MXN
- objeto IRREGULAR: +$80 MXN

RANGOS DE PRECIO TOTAL OBLIGATORIOS SEGÚN TIPO DE RUTA:
${tipo === 'local' ? '- LOCAL Chetumal: total MÁXIMO $500 MXN. Si el subtotal supera $500, ajusta los precios base proporcionalmente hacia abajo para que el total (con extras) no pase de $500.' : ''}
${tipo === 'foraneo_qroo' ? '- FORÁNEO dentro de Quintana Roo: total debe estar entre $3,000 y $9,000 MXN. Calcula el recargo_ruta necesario para que el total quede dentro de ese rango según la cantidad y tipo de carga.' : ''}
${tipo === 'foraneo_nacional' ? '- FORÁNEO fuera de Quintana Roo (otros estados de México): total debe estar entre $8,000 y $16,000 MXN. Calcula el recargo_ruta necesario según distancia estimada y tipo de carga. A mayor distancia o volumen, más cercano al límite superior.' : ''}
${tipo === 'belice' ? '- INTERNACIONAL Belice: total MÍNIMO $5,000 MXN. Incluye gestión aduanal. Calcula el recargo_ruta para alcanzar ese mínimo y ajusta según volumen y complejidad.' : ''}

REGLA: "recargo_ruta" es el valor que, sumado a subtotal_objetos y recargo_extras, hace que "total" caiga dentro del rango obligatorio. Si subtotal_objetos ya cubre el rango mínimo, recargo_ruta puede ser 0.

${extrasLines.length > 0 ? 'EXTRAS ADICIONALES:\n' + extrasLines.join('\n') : ''}

Objetos detectados:
${objsStr}

Tipo: ${tipoLabel}
Zona: ${zone}

Responde SOLO con este JSON (sin texto extra, sin backticks):
{
  "desglose": [
    {
      "nombre": "nombre del objeto",
      "precio_base": número MXN,
      "recargo_dificultad": número MXN,
      "recargo_irregular": número MXN,
      "subtotal": número MXN,
      "nota": "justificación breve"
    }
  ],
  "subtotal_objetos": número MXN,
  "recargo_ruta": número MXN,
  "recargo_extras": número MXN,
  "total": número MXN,
  "comentario": "2 oraciones profesionales sobre el servicio para el cliente"
}`

  const { data } = await axios.post(OPENROUTER_URL, {
    model: MODEL,
    max_tokens: 900,
    messages: [{ role: 'user', content: prompt }]
  }, { headers })

  return parseJSON(data.choices[0].message.content)
}

module.exports = { analyzeImages, calculateQuote }
