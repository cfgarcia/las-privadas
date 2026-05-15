-- Backfill historias (description) + albumCount + careerYears for all 9 real artists.
-- Source: /Users/christianfranciscogarcia/Proyects/Researcher/output/artist-profiles/*.md
-- Voice: cinematic narrative with concrete hooks from each profile (specific years,
-- songs, places, streams). Passed through /humanizer principles: no em-dash overuse,
-- no rule-of-three, no AI vocab, sentence variety.

-- 1. El As de la Sierra
UPDATE "Artist"
   SET "description"  = E'En 1996, un corrido sobre un helicóptero negro que esquivaba a la federal por los cielos de la sierra cambió las radios del sur de California. Era el debut de un cantor sinaloense que firmó esa misma semana con Titan Records y nunca se fue. Treinta años después, José Heredia, a quien todos llaman El As de la Sierra, sigue con la misma disquera, suma 1.3 millones de oyentes mensuales en Spotify, y carga un catálogo que va de los corridos chacalosos de los 90s al ADN del corrido tumbado actual. Su "Catarino y los Rurales" rebasa los 45 millones de streams. A los 56 años sigue de gira y sigue grabando.',
       "albumCount"   = 30,
       "careerYears"  = 30
 WHERE id = 'cmi82wy400000s1rrkp7omiwk';

-- 2. Leonel El Ranchero
UPDATE "Artist"
   SET "description"  = E'Cruzó la frontera de Badiraguato a California cargando una guitarra y una frase suya: "allá levantas una piedra y sacas un cantante". Años después, en una noche del club El Parral, el ingeniero lo grabó en vivo sin avisarle, a él y a su hermano menor Almikar. Ese accidente se volvió disco, y el disco se volvió Los Ases de Sinaloa. Quince años de dueto siguieron, hasta que Almikar falleció. Leonel siguió solo. Hoy carga la bandera de la vieja escuela con Banda Titanes Sinaloenses detrás y Titan Records distribuyendo. Su álbum "El Afortunado" (2025) y su lugar fijo en el Patrón de Patrones Tour confirman que el rancho todavía está en pie.',
       "albumCount"   = 10,
       "careerYears"  = 25
 WHERE id = 'cmi82wy9h0001s1rr9gw27fs2';

-- 3. El Chalinillo
UPDATE "Artist"
   SET "description"  = E'Su nombre lo carga como diminutivo en homenaje: Chalinillo, el pequeño Chalino. No es hijo del Rey del Corrido asesinado en Culiacán en 1992, aunque mucha gente todavía lo confunde. Ambrosio Cano es uno de los pocos sobrevivientes activos de la escuela post-Chalino, la generación de discípulos (El Gavilancillo, El Lobito) que mantuvieron viva la voz nasal y los corridos-tragedia cuando todo el mundo decía que el género había muerto con su maestro. Veintisiete años después, sigue grabando: "Recordando los 90s" (2022), "Hasta La Pregunta Ofende" (2024), un sencillo nuevo en 2026. Sigue cantando en el Patrón de Patrones Tour.',
       "albumCount"   = 13,
       "careerYears"  = 27
 WHERE id = 'cmi82wyex0002s1rrufjilwtr';

-- 4. Banda La Tunera
UPDATE "Artist"
   SET "description"  = E'Mucha gente cree que "Tunera" viene de La Tuna, Badiraguato. No: viene de Nochistlán de Mejía, Zacatecas, tierra de nopales y tunas, donde Saúl Mejía fundó la banda en 1991. Treinta y cinco años después, Banda La Tunera, apodada "El Fruto Musical de Zacatecas", ha pasado por Fonovisa, Líderes, Andrea Records y hoy por Titan Records, sin perder el sonido romántico con sabor a banda que la hizo referencia obligada en la diáspora zacatecana de California, Texas, Illinois y Georgia. "Quiero Que Seas Tú" (1996) y "Chava Romero" siguen sumando streams. Hicieron un álbum cruzado con Banda Limonense en 2024, algo que casi nadie se atreve a hacer en este género, y siguen tocando bailes donde el público canta los coros completos.',
       "albumCount"   = 15,
       "careerYears"  = 35
 WHERE id = 'cmp725e130000tu1jxwkn7utt';

-- 5. Jessie Morales El Original de la Sierra
UPDATE "Artist"
   SET "description"  = E'Nació en el Sur Centro de Los Ángeles, no en Sinaloa, y empezó a grabar a los catorce años en una época en que sus compañeros del Thomas Jefferson High School escuchaban rap de la West Coast. Su padre era de Zacatecas, su madre de Nayarit, y los discos que sonaban en su casa eran de Los Tigres del Norte y Ramón Ayala. En 2001, con 18 años, su "Homenaje a Chalino Sánchez" llegó al #1 del Billboard Latin 50: la nueva voz chicana del corrido, antes de que existiera el término "corrido tumbado". Hoy, con 510 mil oyentes mensuales en Spotify y un vínculo activo con Prajin Music Group, el mismo grupo que lanzó a Peso Pluma, Jessie Morales es el puente entre la generación pre-tumbado y la actual.',
       "albumCount"   = 20,
       "careerYears"  = 27
 WHERE id = 'cmp725f0l0001tu1jhhh6ybpj';

-- 6. Los Ases de Sinaloa
UPDATE "Artist"
   SET "description"  = E'Dos hermanos de Badiraguato, Sinaloa, una guitarra, un acordeón. Leonel cruzó primero la frontera; años después Almikar, su hermano menor, se le sumó en California. Una noche en el club El Parral un compadre llamado Jorge les organizó un show sorpresa, y el ingeniero, sin avisarles, grabó toda la presentación en vivo. Ese disco-accidente fue su despegue. Durante quince años fueron uno de los duetos más respetados del circuito de corridos chacalosos en Estados Unidos: "Plebes Atrevidos" suma 1.3 millones de streams todavía. Almikar falleció a finales de los 2010s y el proyecto quedó en pausa. Leonel sigue cantando el repertorio del dueto en cada show del Patrón de Patrones Tour: nadie va a ocupar el puesto de su hermano.',
       "albumCount"   = 6,
       "careerYears"  = 15
 WHERE id = 'cmp725fp30002tu1j0sdj78zt';

-- 7. Los Morros del Norte
UPDATE "Artist"
   SET "description"  = E'Cuatro músicos, tres hermanos Beltrán y su primo Samuel Ayón, salieron de Los Remedios, Tamazula, Durango, en los 90s rumbo al norte. En 1995 Banda El Recodo los invitó a una gira por México, un sello temprano de respeto que casi nadie del norteño consigue. Una década después, en 2005, grabaron "La Botella". El público la rebautizó "Dos Botellas de Mezcal" y la canción se convirtió en himno: 82 millones de streams hoy, presente en cada baile, jaripeo y tributo en TikTok. Los Morros del Norte llevan 33 años con la misma formación familiar, 325 millones de streams acumulados en Spotify, 1.8 millones de oyentes mensuales, y un calendario de bailes que no se detiene.',
       "albumCount"   = 20,
       "careerYears"  = 33
 WHERE id = 'cmp725g1i0003tu1j6bx23uhz';

-- 8. Meño Lugo
UPDATE "Artist"
   SET "description"  = E'A los 13 años ya tocaba en bailes por Sinaloa. A los 21 estaba en el escenario detrás de Espinoza Paz como su segunda voz, cinco años de tarima que fueron su universidad. En 2014 se salió, sacó un sencillo llamado "Zapatillas Ferragamo" compuesto por Edgar Quiñones, y la canción escaló los primeros lugares de monitorLATINO en México y Estados Unidos. Su ídolo de infancia, Pancho Barraza, lo invitó a su camerino en California y le cantó "Zapatillas Ferragamo" a él, no al revés. Doce años después, Luis Manuel Lugo Valenzuela, conocido como Meño Lugo, sigue siendo artista independiente bajo su propio sello Lugo Recordz, con 6.5 millones de streams en su sencillo insignia y nuevos sencillos saliendo en 2026.',
       "albumCount"   = 4,
       "careerYears"  = 12
 WHERE id = 'cmp725gdv0004tu1jyox1yyvo';

-- 9. Paulino Rosas Y Su Estilo Norteño
UPDATE "Artist"
   SET "description"  = E'Pénjamo, Guanajuato, no Sinaloa. Antes de tener su propio grupo, Paulino Rosas pasó quince años acompañando a su hermano acordeonista Mario por toda la república, tocando con Jenni Rivera y con el hijo de Chalino Sánchez. En marzo de 2014, ya en California, fundó Paulino Rosas Y Su Estilo Norteño con su hermano Armando en el acordeón, su primo Hugo en el bajo y su sobrino Armando Jr. en la batería: cien por ciento familia. La filosofía la dijo él mismo en una entrevista: "vamos solos y poco a poquito para no tener compromiso con nadie". Compone casi todas sus canciones. Doce años después, su álbum colaborativo de 2026 con Leonel El Ranchero, "A Mi San Juditas (En Vivo)" bajo Titan Records, lo pone en el mapa del corrido sinaloense desde la trinchera norteña tradicional.',
       "albumCount"   = 7,
       "careerYears"  = 12
 WHERE id = 'cmp725gq70005tu1jlydvbxvh';
