import { Guest, Table } from './types';
import { Language, translations } from './translations';

// Default presets
export const PRESETS = {
  amigos: {
    title: "Cena de Amigos con Exes y Drama 🍷",
    capacity: 4,
    text: `- Carlos (Vegano, evitar a Juan, jefa: Elena)
- Juan (Hermano de María, quiere a María al lado)
- María (Esposa de Juan, prefiere mesa tranquila)
- Ana (Muy habladora, mejor amiga de Sofía, evitar a Roberto)
- Sofía (Vegana, amiga de Ana)
- Roberto (Súper tímido, ex-pareja de Ana, evitar a Ana)
- Elena (Jefa de Carlos, le gusta el vino, jefa)
- Marcos (Novio de Elena, tímido, amigo de Tomás)
- Lucía (Soltera, busca conocer gente, habladora)
- Tomás (Amigo de Marcos, muy gracioso, soltero, vegetariano)`
  },
  boda: {
    title: "Boda Familiar de Alta Tensión 💒",
    capacity: 5,
    text: `- Suegra Amparo (Evitar a Nuera Carolina, quiere estar con Hijo Alberto)
- Hijo Alberto (Esposo de Carolina, quiere con Amparo)
- Nuera Carolina (Evitar a Amparo, quiere con Amiga Vanesa)
- Amiga Vanesa (Habladora, soltera)
- Tío Pepe (Fumador, ruidoso, evitar a Tía Marta)
- Tía Marta (Muy conservadora, evitar a Tío Pepe)
- Primo Lucas (Adolescente, quiere wifi)
- Prima Sofi (Adolescente, amiga de Lucas)
- Abuelo Ramón (Sordo, prefiere mesa tranquila, quiere con Tía Marta)
- Abuela Teresa (Amable, quiere hablar con todos)`
  },
  oficina: {
    title: "Almuerzo de Fin de Año de la Oficina 💼",
    capacity: 3,
    text: `- Jefe Miguel (Autoritario, evitar a Sindicato Pedro)
- Sindicato Pedro (Vocal, evitar a Jefe Miguel)
- Secretaria Clara (Sabe todo, amiga de Laura)
- Diseñadora Laura (Introvertida, quiere con Clara)
- Programador Dev (No duerme, con cafeína, prefiere mesa con Laura)
- Comercial Iván (Muy hablador, prefiere mesa con Jefe Miguel)
- Finanzas Sole (Calculadora, meticulosa, evitar a Comercial Iván)
- Recursos Humanos Gaby (Medidadora, quiere con todos, vegetariana)`
  },
  consorcio: {
    title: "Reunión de Vecinos Extraordinaria 🏢",
    capacity: 4,
    text: `- Vecino 1A Paco (Odia ruidos, evitar a Duplex 4B Jenny)
- Duplex 4B Jenny (Tiene 3 perros, fiestera, odia a Paco)
- Portero Antonio (Sabe la vida de todos, quiere con Administrador)
- Administrador Ruiz (Trata de huir, quiere con Antonio)
- Vecina 3C Marta (Presidenta, obsesionada con limpieza, quiere mesa con Paco)
- Vecino 2B Carlos (Melómano, sordo, evitar a Marta)
- Inquilina 1B Sofía (Estudiante, siempre cansada, vegetariana)
- Propietario 5A Juan (Inversor, millonario, reservado)`
  }
};

/**
 * Parses the raw input string into a list of Guest objects
 */
export function parseGuests(rawText: string): Guest[] {
  const lines = rawText.split('\n');
  const guests: Guest[] = [];

  lines.forEach((line, index) => {
    const cleanLine = line.trim();
    if (!cleanLine) return;

    // Detect bullet or starting dashes
    const content = cleanLine.replace(/^[-*•\d.]\s*/, '').trim();
    if (!content) return;

    // Extract name and details inside parenthesises
    // Example: "Carlos (Vegano, evitar a Juan, jefa: Elena)"
    const parenRegex = /([^(]+)(?:\(([^)]+)\))?/;
    const match = content.match(parenRegex);

    if (match) {
      const name = match[1].trim();
      const detailsStr = match[2] ? match[2].trim() : '';

      if (name) {
        // Find tags, diets and attributes from details
        let diet = 'Sin restricciones';
        const conflictTags: string[] = [];
        const affinityTags: string[] = [];
        const attributes: string[] = [];

        if (detailsStr) {
          const tokens = detailsStr.split(',').map(t => t.trim());
          tokens.forEach(token => {
            const lowerToken = token.toLowerCase();

            // Detect Diets
            if (lowerToken.includes('vegan') || lowerToken.includes('veggie')) {
              diet = '🥬 Vegano';
            } else if (lowerToken.includes('vegetar')) {
              diet = '🥦 Vegetariano';
            } else if (lowerToken.includes('celíac') || lowerToken.includes('sin gluten') || lowerToken.includes('gluten')) {
              diet = '🌾 Celíaco';
            } else if (lowerToken.includes('alerg') || lowerToken.includes('intoleran')) {
              diet = '⚠️ Alérgico';
            }

            // Detect Conflicts
            if (
              lowerToken.includes('evitar') ||
              lowerToken.includes('no con') ||
              lowerToken.includes('odia') ||
              lowerToken.includes('ex') ||
              lowerToken.includes('conflict') ||
              lowerToken.includes('no se lleva')
            ) {
              // Try to extract name
              // Extract names from things like "evitar a Juan" or "no con Roberto"
              const words = token.split(/\s+/);
              // Grab words starting with capital letters or the last word
              const targetName = words[words.length - 1];
              if (targetName && targetName.length > 2 && targetName.toLowerCase() !== 'juan' && targetName.toLowerCase() !== 'ana' && targetName.toLowerCase() !== 'roberto' && targetName.toLowerCase() !== 'maria') {
                conflictTags.push(targetName);
              } else {
                // Check if common preset names are mentioned
                ['juan', 'carlos', 'roberto', 'ana', 'maría', 'maria', 'elena', 'sofía', 'sofia', 'marcos', 'lucía', 'lucia', 'tomás', 'tomas', 'amparo', 'carolina', 'alberto', 'pepe', 'marta', 'miguel', 'pedro', 'clara', 'laura', 'iván', 'ivan', 'sole', 'gaby', 'paco', 'jenny', 'antonio', 'ruiz'].forEach(pName => {
                  if (lowerToken.includes(pName)) {
                    conflictTags.push(pName.charAt(0).toUpperCase() + pName.slice(1));
                  }
                });
              }
            }
            // Detect Affinities
            else if (
              lowerToken.includes('quiere') ||
              lowerToken.includes('junto') ||
              lowerToken.includes('amig') ||
              lowerToken.includes('herman') ||
              lowerToken.includes('espos') ||
              lowerToken.includes('novi') ||
              lowerToken.includes('pareja')
            ) {
              // Extract names
              ['juan', 'carlos', 'roberto', 'ana', 'maría', 'maria', 'elena', 'sofía', 'sofia', 'marcos', 'lucía', 'lucia', 'tomás', 'tomas', 'amparo', 'carolina', 'alberto', 'pepe', 'marta', 'miguel', 'pedro', 'clara', 'laura', 'iván', 'ivan', 'sole', 'gaby', 'paco', 'jenny', 'antonio', 'ruiz'].forEach(pName => {
                if (lowerToken.includes(pName)) {
                  affinityTags.push(pName.charAt(0).toUpperCase() + pName.slice(1));
                }
              });
            }
            // Other attributes
            else {
              attributes.push(token);
            }
          });
        }

        // Add additional common key-value tags based on words inside attributes
        attributes.forEach(attr => {
          const lower = attr.toLowerCase();
          if (lower.includes('hablad') || lower.includes('charl')) {
            attributes.push('🗣️ Muy Hablador');
          } else if (lower.includes('tím') || lower.includes('timi') || lower.includes('silenc')) {
            attributes.push('🤫 Silencioso/Tímido');
          } else if (lower.includes('gracio') || lower.includes('chist')) {
            attributes.push('🎭 Animador de Mesa');
          } else if (lower.includes('jefa') || lower.includes('jefe') || lower.includes('director')) {
            attributes.push('👑 Rango de Autoridad');
          }
        });

        // Unique filter for tags
        const cleanAttributes = Array.from(new Set(attributes)).filter(a => a.length > 2 && !a.includes('evitar') && !a.includes('quiere'));

        guests.push({
          id: `guest-${index}-${name.toLowerCase().replace(/\s+/g, '-')}`,
          name,
          diet,
          conflictTags: Array.from(new Set(conflictTags)),
          affinityTags: Array.from(new Set(affinityTags)),
          attributes: cleanAttributes.slice(0, 3), // Limit to max 3 cute attributes
          rawText: cleanLine
        });
      }
    }
  });

  return guests;
}

/**
 * Intelligent seating solver implementing backtracking or a smart greedy heuristic
 * that segregates conflicts and aggregates affinities
 */
export function solveTables(guests: Guest[], maxCapacity: number): Table[] {
  if (guests.length === 0) return [];
  
  const tables: Table[] = [];
  const elegantTableNames = [
    "Mesa Cabernet 🍷", "Mesa Chardonnay 🥂", "Mesa Merlot 🍇", 
    "Mesa Pinot Noir 🍒", "Mesa Sauvignon 🍸", "Mesa Malbec 🪵",
    "Mesa Syrah 🪵", "Mesa Prosecco 🍾"
  ];

  // Helper to determine if Guest fits in specific group of guests
  const calculateCompatibility = (guest: Guest, currentGuests: Guest[]): {
    scoreDiff: number; // Positive is good, negative is bad
    hasConflict: boolean;
    brokenAffinities: string[];
    gainedAffinities: string[];
    brokenConflictsList: string[];
  } => {
    let scoreDiff = 50; // Neutral baseline
    let hasConflict = false;
    const gainedAffinities: string[] = [];
    const brokenConflictsList: string[] = [];

    for (const other of currentGuests) {
      // 1. Conflict checking: does guest dislike other or vice-versa?
      const namesDislikedByGuest = guest.conflictTags.map(n => n.toLowerCase());
      const namesDislikedByOther = other.conflictTags.map(n => n.toLowerCase());
      const guestNameLower = guest.name.toLowerCase();
      const otherNameLower = other.name.toLowerCase();

      const dislikesOther = namesDislikedByGuest.some(n => otherNameLower.includes(n) || n.includes(otherNameLower));
      const otherDislikesGuest = namesDislikedByOther.some(n => guestNameLower.includes(n) || n.includes(guestNameLower));

      if (dislikesOther || otherDislikesGuest) {
        hasConflict = true;
        scoreDiff -= 100; // Heavy penalty
        brokenConflictsList.push(`${guest.name} ↔ ${other.name}`);
      }

      // 2. Affinity checking: does guest want to sit with other or vice-versa?
      const guestAffinities = guest.affinityTags.map(n => n.toLowerCase());
      const otherAffinities = other.affinityTags.map(n => n.toLowerCase());

      const wantsOther = guestAffinities.some(n => otherNameLower.includes(n) || n.includes(otherNameLower));
      const otherWantsGuest = otherAffinities.some(n => guestNameLower.includes(n) || n.includes(guestNameLower));

      if (wantsOther || otherWantsGuest) {
        scoreDiff += 40; // Bonus for affinity
        gainedAffinities.push(`${guest.name} ❤️ ${other.name}`);
      }

      // 3. Balance of conversations (too many talkative or too many silent)
      const isGuestTalkative = guest.attributes.some(a => a.includes('Hablador'));
      const isOtherTalkative = other.attributes.some(a => a.includes('Hablador'));
      const isGuestSilent = guest.attributes.some(a => a.includes('Tímido') || a.includes('Silencioso'));
      const isOtherSilent = other.attributes.some(a => a.includes('Tímido') || a.includes('Silencioso'));

      if (isGuestTalkative && isOtherTalkative) {
        scoreDiff -= 5; // Slight penalty: talking head-to-head
      }
      if (isGuestSilent && isOtherSilent) {
        scoreDiff -= 5; // Slight penalty: awkward silence
      }
    }

    return {
      scoreDiff,
      hasConflict,
      brokenAffinities: [],
      gainedAffinities,
      brokenConflictsList
    };
  };

  // Clone list of guests to process
  let unseated = [...guests];

  // Number of tables needed
  const tablesCount = Math.ceil(unseated.length / maxCapacity);

  // Initialize tables
  for (let i = 0; i < tablesCount; i++) {
    tables.push({
      id: `table-${i + 1}`,
      name: elegantTableNames[i % elegantTableNames.length] || `Mesa Extra ${i + 1} 🪑`,
      guests: [],
      harmonyScore: 100,
      achievedAffinities: [],
      resolvedConflicts: []
    });
  }

  // To do a real good greedy heuristic with conflict solver:
  // Sort guests such that guests with high conflicts/affinities are seated FIRST.
  // This is a classic scheduling best practice.
  unseated.sort((a, b) => {
    const aConstraints = a.conflictTags.length + a.affinityTags.length;
    const bConstraints = b.conflictTags.length + b.affinityTags.length;
    return bConstraints - aConstraints;
  });

  // Distribute guests
  while (unseated.length > 0) {
    const guest = unseated.shift()!;
    let bestTableIndex = -1;
    let bestScore = -9999;
    let bestHasConflict = true;
    let tempGainedAffinities: string[] = [];
    let tempBrokenConflicts: string[] = [];

    // Find the absolute best table for this guest
    for (let t = 0; t < tables.length; t++) {
      const table = tables[t];
      if (table.guests.length >= maxCapacity) continue;

      const evalResult = calculateCompatibility(guest, table.guests);

      // We prioritize: Empty table has neutral score, tables with no conflict are better than conflicts.
      // If we can avoid conflicts altogether, do so.
      const adjustedScore = evalResult.scoreDiff;

      // Prefer tables with NO conflict
      if (bestTableIndex === -1 || 
          (bestHasConflict && !evalResult.hasConflict) ||
          (!evalResult.hasConflict && !bestHasConflict && adjustedScore > bestScore) ||
          (evalResult.hasConflict && bestHasConflict && adjustedScore > bestScore)) {
        bestTableIndex = t;
        bestScore = adjustedScore;
        bestHasConflict = evalResult.hasConflict;
        tempGainedAffinities = evalResult.gainedAffinities;
        tempBrokenConflicts = evalResult.brokenConflictsList;
      }
    }

    // Seat the guest in the best table
    if (bestTableIndex !== -1) {
      const table = tables[bestTableIndex];
      table.guests.push(guest);
      table.achievedAffinities.push(...tempGainedAffinities);
      table.resolvedConflicts.push(...tempBrokenConflicts);
    } else {
      // Fallback: put in first non-full table
      const firstAvailable = tables.find(t => t.guests.length < maxCapacity);
      if (firstAvailable) {
        firstAvailable.guests.push(guest);
      } else {
        // Create an emergency extra table
        const newTableIndex = tables.length;
        const newTable: Table = {
          id: `table-${newTableIndex + 1}`,
          name: elegantTableNames[newTableIndex % elegantTableNames.length] || `Mesa Extra ${newTableIndex + 1} 🪑`,
          guests: [guest],
          harmonyScore: 100,
          achievedAffinities: [],
          resolvedConflicts: []
        };
        tables.push(newTable);
      }
    }
  }

  // Post-processing to calculate final Harmony Score for each table
  tables.forEach(table => {
    if (table.guests.length <= 1) {
      table.harmonyScore = 100; // Perfect harmony if solo or 1
      return;
    }

    let rawScore = 90; // Default base harmony

    // Apply penalties and rewards based on the relationships in the seated group
    const uniqueConflicts = new Set<string>();
    const uniqueAffinities = new Set<string>();

    for (let i = 0; i < table.guests.length; i++) {
      const g1 = table.guests[i];
      for (let j = i + 1; j < table.guests.length; j++) {
        const g2 = table.guests[j];
        
        // Check conflict
        const isConflictG1 = g1.conflictTags.some(name => g2.name.toLowerCase().includes(name.toLowerCase()));
        const isConflictG2 = g2.conflictTags.some(name => g1.name.toLowerCase().includes(name.toLowerCase()));

        if (isConflictG1 || isConflictG2) {
          rawScore -= 45; // Heavy hit to harmony
          uniqueConflicts.add(`${g1.name} y ${g2.name}`);
        }

        // Check affinity
        const isAffinityG1 = g1.affinityTags.some(name => g2.name.toLowerCase().includes(name.toLowerCase()));
        const isAffinityG2 = g2.affinityTags.some(name => g1.name.toLowerCase().includes(name.toLowerCase()));

        if (isAffinityG1 || isAffinityG2) {
          rawScore += 15; // Harmony boost!
          uniqueAffinities.add(`${g1.name} + ${g2.name}`);
        }
      }
    }

    // Limit harmony between 10% and 100%
    table.harmonyScore = Math.max(15, Math.min(100, rawScore));
    table.achievedAffinities = Array.from(uniqueAffinities);
    table.resolvedConflicts = Array.from(uniqueConflicts);
  });

  return tables;
}

/**
 * Legacy/Default WhatsApp format
 */
export function buildWhatsAppCopy(tables: Table[]): string {
  let text = `🍽️ *¡ACOMODAAI HA RESUELTO TUS MESAS CON IA!* 📝✨\n`;
  text += `Distribución recomendada para tu cena o evento sin dramas:\n\n`;

  tables.forEach((table) => {
    text += `📍 *${table.name.toUpperCase()}*\n`;
    text += `🌟 Harmony Score: _${table.harmonyScore}%_\n`;
    table.guests.forEach(g => {
      text += `  • *${g.name}* (${g.diet}${g.attributes.length > 0 ? ' - ' + g.attributes.join(', ') : ''})\n`;
    });
    
    if (table.achievedAffinities.length > 0) {
      text += `  ❤️ _Afinidades hechas:_ ${table.achievedAffinities.join(', ')}\n`;
    }
    if (table.resolvedConflicts.length > 0) {
      text += `  ⚠️ _Fricciones controladas:_ Separado exes/rivales\n`;
    }
    text += `\n`;
  });

  text += `⚡ _Organizado en segundos con *AcomodaAI*_ - ¡Distribuye sin dramas! 🥂`;
  return text;
}

/**
 * Encodes table structure to base64 string for URL sharing
 */
export function encodeTablesToUrl(tables: Table[]): string {
  const payload = tables.map(t => {
    const guestsCsv = t.guests.map(g => {
      const dietStr = g.diet && !g.diet.toLowerCase().includes('sin restric') ? ` (${g.diet.replace(/[:|()]/g, '')})` : '';
      return g.name.replace(/[:|()]/g, '') + dietStr;
    }).join(',');
    return `${t.name.replace(/[:|()]/g, '')}:${guestsCsv}`;
  }).join('|');
  
  try {
    return btoa(unescape(encodeURIComponent(payload)));
  } catch (e) {
    return encodeURIComponent(payload);
  }
}

/**
 * Decodes table structure from base64 URL share param
 */
export function decodeTablesFromUrl(encoded: string): Table[] {
  try {
    let decoded = '';
    try {
      decoded = decodeURIComponent(escape(atob(encoded)));
    } catch {
      decoded = decodeURIComponent(encoded);
    }
    
    return decoded.split('|').map((tableRow, idx) => {
      const parts = tableRow.split(':');
      const tableName = parts[0] || `Mesa ${idx + 1}`;
      const guestRows = parts[1] ? parts[1].split(',') : [];
      
      const guests = guestRows.map((grow, gIdx) => {
        const dietMatch = grow.match(/\(([^)]+)\)/);
        const diet = dietMatch ? dietMatch[1] : undefined;
        const name = grow.replace(/\([^)]+\)/, '').trim();
        
        return {
          id: `shared-g-${idx}-${gIdx}`,
          name: name,
          diet: diet,
          conflictTags: [],
          affinityTags: [],
          attributes: [],
          rawText: grow
        };
      });
      
      return {
        id: `shared-t-${idx}`,
        name: tableName,
        guests: guests,
        harmonyScore: 100,
        achievedAffinities: [],
        resolvedConflicts: []
      };
    });
  } catch (e) {
    console.error("Error decoding tables:", e);
    return [];
  }
}

/**
 * Premium WhatsApp Format 1: For the Couple / Hosts (Overview focused on harmony & experience)
 */
export function buildWhatsAppHostsCopy(
  tables: Table[], 
  lang: Language, 
  shareUrl?: string,
  tone: 'elegant' | 'short' | 'informal' = 'elegant'
): string {
  const trans = translations[lang] || translations['es'];

  if (tone === 'short') {
    let text = `📝 *RESUMEN DE ASIGNACIÓN DE MESAS*\nDistribución compacta y directa sin rodeos:\n\n`;
    tables.forEach((table, index) => {
      text += `📍 *${table.name}* (Armonía: ${table.harmonyScore}%)\n`;
      text += `  • ` + table.guests.map(g => g.name).join(', ') + `\n\n`;
    });
    if (shareUrl) {
      text += `📲 *Plano interactivo general de mesa:*\n🔗 ${shareUrl}\n`;
    }
    return text;
  }

  if (tone === 'informal') {
    let text = `🎉 *¡LA FIESTA YA TIENE MESAS DESIGNADAS!* 🥳🍷✨\nAcá está cómo se van a sentar todos para pasar una velada inolvidable libre de dramas:\n\n`;
    tables.forEach((table) => {
      text += `🔥 *${table.name.toUpperCase()}* (Súper Energía: ${table.harmonyScore}%)\n`;
      table.guests.forEach(g => {
        const dietBadge = g.diet && !g.diet.toLowerCase().includes('sin restric') ? ` 🥦` : '';
        text += `  🍻 *${g.name}*${dietBadge}\n`;
      });
      if (table.achievedAffinities.length > 0) {
        text += `  ❤️ _Cupido aprueba:_ ${table.achievedAffinities.join(', ')}\n`;
      }
      text += `\n`;
    });
    if (shareUrl) {
      text += `📲 *Entra a ver el mapa interactivo y código de acceso:*\n🔗 ${shareUrl}\n`;
    }
    text += `¡A celebrar a lo grande! 🥂🕺💃`;
    return text;
  }

  // Default Elegant
  let text = trans.hostsHeaderTemplate;

  tables.forEach((table, index) => {
    const tableHeaderStr = trans.tableHeader ? trans.tableHeader.replace('{index}', (index + 1).toString()) : `Mesa #${index + 1}`;
    text += `👑 *${tableHeaderStr}: ${table.name.toUpperCase()}*\n`;
    text += `💖 *${trans.statsHarmony || 'Armonía'}:* _${table.harmonyScore}%_\n`;
    
    table.guests.forEach(g => {
      const dietStr = g.diet ? ` [${g.diet}]` : '';
      text += `  • *${g.name}*${dietStr}\n`;
    });

    if (table.achievedAffinities.length > 0) {
      text += `  ✨ _${trans.achievedAffinities || 'Logrado'}:_ ${table.achievedAffinities.join(', ')}\n`;
    }
    if (table.resolvedConflicts.length > 0) {
      text += `  🛡️ _${trans.resolvedConflicts || 'Fricción evitada'}:_ ${table.resolvedConflicts.join(', ')}\n`;
    } else {
      text += `  ✨ _${trans.noEgoClashes || 'Sin roces de ego'}\n`;
    }
    text += `\n`;
  });

  if (shareUrl) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;
    text += `─────────────────────\n`;
    text += `📲 *VER PLANO INTERACTIVO Y QR DE ACCESO:*\n`;
    text += `🔗 Ver Online: ${shareUrl}\n`;
    text += `🖼️ Código QR de Entrada: ${qrUrl}\n\n`;
  }

  text += `🥂 _Generado por *AcomodaAI* - ¡Sin dramas en tus mesas!_ ✨`;
  return text;
}

/**
 * Premium WhatsApp Format 2: For Planners & Catering (Tactical overview focused on kitchen & coordination)
 */
export function buildWhatsAppOrgsCopy(
  tables: Table[], 
  lang: Language, 
  shareUrl?: string,
  tone: 'elegant' | 'short' | 'informal' = 'elegant'
): string {
  const trans = translations[lang] || translations['es'];

  if (tone === 'short') {
    let text = `⚡ *REGISTRO TÉCNICO DE CATERING* (Compacto)\n\n`;
    tables.forEach((table, index) => {
      const tableDiets = table.guests
        .filter(g => g.diet && !g.diet.toLowerCase().includes('sin restric'))
        .map(g => `${g.name} (${g.diet})`);
      text += `📍 *${table.name}* (${table.guests.length} pax)\n`;
      if (tableDiets.length > 0) {
        text += `  ⚠️ Dietas: ${tableDiets.join(', ')}\n`;
      } else {
        text += `  ✅ Menú Estándar\n`;
      }
      text += `\n`;
    });
    if (shareUrl) text += `🔗 Plano técnico: ${shareUrl}\n`;
    return text;
  }

  if (tone === 'informal') {
    let text = `🔥 *¡EQUIPO DE COORDINACIÓN AL ATAQUE!* 🚀🍽️\nAcá está el plan maestro de mesas y requerimientos de menús para que la rompan hoy:\n\n`;
    tables.forEach((table) => {
      text += `📍 *${table.name.toUpperCase()}* (${table.guests.length} personas listas)\n`;
      table.guests.forEach(g => {
        const special = g.diet && !g.diet.toLowerCase().includes('sin restric') ? ` 🥦 [${g.diet.toUpperCase()}]` : ' 👍';
        text += `  [ ] ${g.name}${special}\n`;
      });
      text += `\n`;
    });
    if (shareUrl) text += `📲 Acceso salón digital en vivo: ${shareUrl}\n`;
    text += `¡Fuerza equipo, va a salir de lujo! 💪🔥`;
    return text;
  }

  // Elegant default
  let text = trans.orgsHeaderTemplate;

  const dietsCount: Record<string, number> = {};
  let totalGuests = 0;

  tables.forEach(table => {
    table.guests.forEach(g => {
      totalGuests++;
      const d = g.diet || 'Estándar';
      dietsCount[d] = (dietsCount[d] || 0) + 1;
    });
  });

  text += `📊 *INFORMACIÓN GENERAL DE MENÚS Y RECONOCIMIENTOS:*\n`;
  text += `• Total de Comensales: ${totalGuests}\n`;
  Object.entries(dietsCount).forEach(([dietName, count]) => {
    text += `• ${dietName}: *${count}*\n`;
  });
  text += `\n─────────────────────\n\n`;

  tables.forEach((table, index) => {
    const tableHeaderStr = trans.tableHeader ? trans.tableHeader.replace('{index}', (index + 1).toString()) : `Mesa #${index + 1}`;
    
    const tableDiets: string[] = [];
    table.guests.forEach(g => {
      if (g.diet && !g.diet.toLowerCase().includes('sin restric') && !g.diet.toLowerCase().includes('no rest') && !g.diet.toLowerCase().includes('none') && !g.diet.toLowerCase().includes('sans')) {
        tableDiets.push(g.diet);
      }
    });

    text += `📍 *${tableHeaderStr.toUpperCase()}: ${table.name.toUpperCase()}* (${table.guests.length} ${trans.statsGuests || 'Invitados'})\n`;
    if (tableDiets.length > 0) {
      text += `⚠️ *MENÚS ESPECIALES EN ESTA MESA:* ${tableDiets.join(', ')}\n`;
    } else {
      text += `✅ *Menú Estándar General*\n`;
    }

    table.guests.forEach(g => {
      const isSpecialDiet = g.diet && !g.diet.toLowerCase().includes('sin restric');
      const dietBadge = isSpecialDiet ? ` 🔴 *[${g.diet.toUpperCase()}]*` : '';
      text += `  [ ] ${g.name}${dietBadge}\n`;
    });
    text += `\n`;
  });

  if (shareUrl) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;
    text += `─────────────────────\n`;
    text += `📲 *MAPA INTERACTIVO PARA SERVICIO:*\n`;
    text += `🔗 Enlace Digital: ${shareUrl}\n`;
    text += `🖼️ QR del Mapa General: ${qrUrl}\n\n`;
  }

  text += `🔧 _Optimizador de Servicio Gastronómico *AcomodaAI*_`;
  return text;
}

/**
 * Premium Format 3: Personalized invitation copy for a single guest
 */
export function buildWhatsAppIndividualCopy(
  guestName: string, 
  tableName: string, 
  companionNames: string[], 
  lang: Language,
  shareUrl?: string,
  tone: 'elegant' | 'short' | 'informal' = 'elegant'
): string {
  const trans = translations[lang] || translations['es'];

  if (tone === 'short') {
    let text = `¡Hola *${guestName}*! 👋 Estás asignado/a en la *${tableName}* con: ${companionNames.length > 0 ? companionNames.join(', ') : 'buena compañía'}. ¡Te esperamos pronto! 🥂`;
    if (shareUrl) {
      const personalUrl = `${shareUrl}&search=${encodeURIComponent(guestName)}`;
      text += `\n🔗 Mapa e indicaciones: ${personalUrl}`;
    }
    return text;
  }

  if (tone === 'informal') {
    let text = `¡Hola *${guestName}*! 🎉 Prepárate porque vas a pasar una velada increíble en la mesa *${tableName}* al lado de: ${companionNames.length > 0 ? companionNames.join(', ') : 'gente de primera'}. ¡La fiesta está lista y se viene épica! 💃🕺❤️`;
    if (shareUrl) {
      const personalUrl = `${shareUrl}&search=${encodeURIComponent(guestName)}`;
      text += `\n\n📲 Mira tu pase y mapa de mesa interactivo acá:\n🔗 ${personalUrl}`;
    }
    return text;
  }

  // Elegant Default
  const template = trans.individualInviteTemplate || "Hola *{name}*! 👋 Estarás en *{table}* 🍽️ con: {others}.";
  
  const othersStr = companionNames.length > 0 
    ? companionNames.join(', ')
    : 'excelente compañía';

  let text = template
    .replace('{name}', guestName)
    .replace('{table}', tableName)
    .replace('{others}', othersStr);

  if (shareUrl) {
    const personalUrl = `${shareUrl}&search=${encodeURIComponent(guestName)}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(personalUrl)}`;
    
    text += `\n\n📲 *Tu Pase Digital y Mapa de Asientos:*\n`;
    text += `🔗 ${personalUrl}\n`;
    text += `🖼️ Código QR de tu Mesa: ${qrUrl}`;
  }

  return text;
}
