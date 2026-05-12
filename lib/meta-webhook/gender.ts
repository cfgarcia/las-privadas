/**
 * Spanish first-name gender heuristic. Direct port of the FEMALE_NAMES / MALE_NAMES
 * sets in meta-ads-mcp/pages/el-as-de-la-sierra/respond_bookings.py.
 *
 * Defaults to "male" on unknown — per user choice, "mi compa" reads more universal
 * across Regional Mexican fan culture than the formal "oiga".
 */

export type Gender = "male" | "female"

const FEMALE_NAMES = new Set([
    "ana", "andrea", "alejandra", "alondra", "amparo", "araceli", "ariana",
    "beatriz", "bertha", "blanca", "brenda", "candelaria", "carmen", "carolina",
    "catalina", "cecilia", "celeste", "claudia", "concepcion", "consuelo",
    "cristina", "cynthia", "daisy", "daniela", "delia", "diana", "dolores",
    "edith", "elena", "elia", "elizabeth", "elvira", "emilia", "erica",
    "esmeralda", "esperanza", "estela", "estefania", "esther", "eva", "evelyn",
    "fabiola", "fatima", "fernanda", "flor", "francisca", "gabriela", "gloria",
    "graciela", "guadalupe", "guillermina", "ingrid", "irene", "iris", "irma",
    "isabel", "isela", "itzel", "jacqueline", "jasmine", "jazmin", "jennifer",
    "jessica", "jocelyn", "josefina", "judith", "julia", "julieta", "karen",
    "karina", "karla", "katia", "kimberly", "laura", "leticia", "lidia",
    "liliana", "linda", "lizbeth", "lorena", "lourdes", "lucero", "lucia",
    "luisa", "lupe", "lupita", "magdalena", "maira", "marcela", "margarita",
    "maria", "mariana", "maribel", "marina", "marisol", "martha", "melissa",
    "mercedes", "mireya", "miriam", "monica", "monserrat", "nadia", "nancy",
    "natalia", "nayeli", "nicole", "noemi", "norma", "olga", "olivia", "paloma",
    "paola", "patricia", "perla", "pilar", "raquel", "rebeca", "regina", "reyna",
    "rocio", "rosa", "rosalba", "rosalia", "rosario", "ruby", "salma", "samantha",
    "sandra", "selena", "silvia", "sofia", "sonia", "stephanie", "susana",
    "tatiana", "teresa", "valeria", "vanessa", "veronica", "victoria", "violeta",
    "virginia", "viviana", "wendy", "xochitl", "yadira", "yamileth", "yanira",
    "yesenia", "yolanda", "zenaida",
])

const MALE_NAMES = new Set([
    "abraham", "adan", "adolfo", "adrian", "agustin", "alberto", "alejandro",
    "alex", "alfonso", "alfredo", "alvaro", "andres", "angel", "anibal",
    "antonio", "armando", "arnoldo", "arnulfo", "arturo", "aurelio", "baltazar",
    "benigno", "benito", "benjamin", "bernardo", "braulio", "brayan", "bryan",
    "candido", "carlos", "cecilio", "cesar", "cipriano", "ciro", "clemente",
    "cristian", "cristobal", "damian", "daniel", "dario", "david", "demetrio",
    "diego", "domingo", "eduardo", "efren", "eladio", "elias", "eliel", "eliseo",
    "emilio", "enrique", "ernesto", "esteban", "ezequiel", "fabian", "federico",
    "felipe", "felix", "fernando", "fidel", "filemon", "francisco", "gabriel",
    "gerardo", "german", "gilberto", "gildardo", "gonzalo", "gregorio", "gustavo",
    "heriberto", "hector", "hermilo", "hilario", "homero", "horacio", "hugo",
    "humberto", "ignacio", "isaac", "isidro", "ismael", "israel", "ivan",
    "jacinto", "jacobo", "jaime", "jair", "javier", "jesus", "joaquin", "joel",
    "jonatan", "jonathan", "jorge", "jose", "joshua", "juan", "julian", "julio",
    "kevin", "leandro", "leonardo", "leonel", "leopoldo", "leobardo", "lorenzo",
    "lucio", "luis", "manuel", "marco", "marcos", "mariano", "mario", "martin",
    "mateo", "matias", "mauricio", "mauro", "maximiliano", "miguel", "moises",
    "nestor", "nicolas", "noel", "norberto", "octavio", "omar", "orlando",
    "oscar", "osvaldo", "pablo", "pancho", "pascual", "patricio", "paulino",
    "pedro", "porfirio", "rafael", "ramiro", "ramon", "raul", "raymundo",
    "refugio", "rene", "reyes", "ricardo", "rigoberto", "roberto", "rodolfo",
    "rodrigo", "rogelio", "rolando", "roman", "romeo", "ruben", "rufino",
    "salomon", "salvador", "samuel", "santiago", "santos", "saul", "sebastian",
    "sergio", "silvestre", "silvio", "simon", "tomas", "tony", "ulises", "uriel",
    "valentin", "vicente", "victor", "vidal", "wilfrido", "william", "wilmer",
    "wilson", "xavier", "yair", "yoel",
])

function normalizeForLookup(name: string): string {
    return name.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/^\.+|\.+$/g, "")
}

export function detectGender(displayNameOrUsername: string | null | undefined): Gender {
    if (!displayNameOrUsername) return "male"
    const trimmed = displayNameOrUsername.trim()
    if (!trimmed) return "male"
    const first = trimmed.split(/\s+/)[0]
    const norm = normalizeForLookup(first)
    if (!norm) return "male"
    if (FEMALE_NAMES.has(norm)) return "female"
    if (MALE_NAMES.has(norm)) return "male"
    return "male"
}
