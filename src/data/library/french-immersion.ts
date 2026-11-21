import { course, strand, topic } from "./build";

// French Immersion, following The Ontario Curriculum: French as a Second
// Language, Grades 1 to 8 (2013). Immersion students learn French as a
// language and use it to learn other subjects, so these topics go much
// further than Core French. Topic names are in French, like the classes.
//
// The curriculum sets expectations for oral communication, reading and
// writing, and boards decide when each grammar point is taught. Grammar
// topics are placed where they're most often taught.

const O = "Communication orale";
const L = "Lecture";
const E = "Écriture";
const G = "Grammaire";

export const frenchImmersion = [
  course(1, "french-immersion", [
    strand(O,
      topic("Les salutations et les présentations", "Dire bonjour; Se présenter; Poser des questions simples"),
      topic("L'écoute active", "Suivre des consignes; Comprendre une courte histoire"),
    ),
    strand(L,
      topic("L'alphabet et les sons", "Les lettres et leurs sons; Les syllabes; Les sons ou, on, an, oi"),
      topic("Lire des mots et des phrases", "Les mots fréquents; Lire une phrase simple; Les illustrations"),
    ),
    strand(E,
      topic("Écrire des mots et des phrases", "Former les lettres; Écrire une phrase simple; La majuscule et le point"),
    ),
    strand(G,
      topic("Le vocabulaire de base", "La famille; La salle de classe; Les nombres et les couleurs; Les jours et les mois"),
    ),
  ]),

  course(2, "french-immersion", [
    strand(O,
      topic("Écouter et parler", "Raconter un événement; Écouter et répondre; Poser des questions"),
    ),
    strand(L,
      topic("Lire des textes simples", "Comprendre une histoire; Les personnages et les lieux; Le début, le milieu et la fin"),
      topic("Le vocabulaire", "Mots de la même famille; Les mots nouveaux dans un texte"),
    ),
    strand(E,
      topic("Écrire de courtes descriptions", "Décrire une personne; Décrire un animal; Utiliser des adjectifs"),
      topic("Construire des phrases", "Sujet et verbe; L'ordre des mots; La ponctuation"),
    ),
    strand(G,
      topic("Le genre et le nombre des noms", "Masculin et féminin; Le pluriel en -s"),
      topic("Les déterminants", "Un, une, des; Le, la, l', les"),
      topic("Les verbes courants", "Être et avoir au présent; Les verbes en -er au présent"),
      topic("Les adjectifs", "Les adjectifs de couleur et de taille; L'accord simple"),
    ),
  ]),

  course(3, "french-immersion", [
    strand(L,
      topic("La compréhension de lecture", "L'idée principale; Les détails importants; Faire des prédictions"),
      topic("Le développement du vocabulaire", "Les synonymes et les antonymes; Les mots de la même famille"),
    ),
    strand(E,
      topic("Écrire un paragraphe", "La phrase d'introduction; Les phrases d'appui; La conclusion"),
      topic("La structure de la phrase", "Phrase déclarative, interrogative et exclamative; Les marqueurs de relation simples"),
    ),
    strand(G,
      topic("Les classes de mots", "Le nom, le verbe et l'adjectif; Le déterminant; Le pronom"),
      topic("Le présent de l'indicatif", "Les verbes en -er; Les verbes en -ir; Les terminaisons"),
      topic("Les verbes irréguliers courants", "Être, avoir, aller et faire; Dans des phrases"),
      topic("L'accord de l'adjectif", "Le féminin des adjectifs; Le pluriel des adjectifs"),
    ),
  ]),

  course(4, "french-immersion", [
    strand(L,
      topic("La compréhension de lecture", "Faire des inférences; Les éléments du récit; Les textes informatifs"),
    ),
    strand(E,
      topic("L'organisation d'un paragraphe", "Planifier ses idées; Les marqueurs de relation; Réviser et corriger"),
      topic("Le texte narratif et descriptif", "Le schéma du récit; Décrire un lieu ou un personnage"),
    ),
    strand(G,
      topic("Le présent des verbes réguliers et irréguliers", "Les verbes en -er, -ir et -re; Les verbes irréguliers fréquents"),
      topic("L'accord dans le groupe du nom", "Le déterminant, le nom et l'adjectif; Les pluriels irréguliers"),
      topic("Les déterminants", "Articles, possessifs et démonstratifs; Les articles contractés"),
      topic("Les pronoms personnels", "Les pronoms sujets; Remplacer un groupe du nom"),
      topic("La phrase négative", "Ne … pas, ne … jamais, ne … plus; La place de la négation"),
      topic("La phrase interrogative", "Est-ce que; L'inversion; Les mots interrogatifs"),
    ),
  ]),

  course(5, "french-immersion", [
    strand(L,
      topic("La compréhension de lecture", "Le point de vue; Les inférences; Comparer deux textes"),
    ),
    strand(E,
      topic("Le texte narratif, descriptif et informatif", "Les caractéristiques de chaque texte; Planifier et rédiger; Réviser"),
    ),
    strand(G,
      topic("Le présent des verbes réguliers et irréguliers", "Révision; Les verbes en -oir; Les verbes pronominaux"),
      topic("Le passé composé", "Avec avoir; Avec être; Les participes passés irréguliers; L'accord avec être"),
      topic("Les verbes pronominaux", "Se lever, s'habiller; Au présent; Au passé composé"),
      topic("L'accord de l'adjectif", "Les adjectifs irréguliers; La place de l'adjectif"),
      topic("Les adverbes", "Former un adverbe en -ment; La place de l'adverbe"),
      topic("Les pronoms", "Les pronoms compléments directs; Les pronoms toniques"),
      topic("La négation", "Les différentes formes; La négation au passé composé"),
      topic("Les conjonctions", "Et, mais, ou, donc, car; Relier des phrases"),
    ),
  ]),

  course(6, "french-immersion", [
    strand(L,
      topic("La compréhension littéraire", "Les thèmes; Les personnages; Le langage figuré"),
    ),
    strand(E,
      topic("Le paragraphe et la rédaction", "Le texte d'opinion; Le texte explicatif; Réviser et corriger"),
      topic("La structure de la phrase", "La phrase complexe; Les subordonnées simples"),
    ),
    strand(G,
      topic("Le présent", "Révision des verbes réguliers et irréguliers; Les verbes en -ger et -cer"),
      topic("Le passé composé", "Avoir ou être?; L'accord du participe passé"),
      topic("L'imparfait", "La formation; Les emplois de l'imparfait; Imparfait ou passé composé?"),
      topic("Le futur proche", "Aller + infinitif; Parler de projets"),
      topic("Les verbes pronominaux", "Au présent et au passé composé; L'accord"),
      topic("Les pronoms compléments directs et indirects", "Le, la, les; Lui, leur; La place du pronom"),
      topic("Les déterminants possessifs et démonstratifs", "Mon, ton, son…; Ce, cet, cette, ces"),
    ),
  ]),

  course(7, "french-immersion", [
    strand(O,
      topic("La recherche et la présentation orale", "Chercher de l'information; Préparer une présentation; Parler devant un groupe"),
    ),
    strand(L,
      topic("L'analyse littéraire", "Le thème et le message; Les procédés littéraires; Justifier sa réponse avec le texte"),
    ),
    strand(E,
      topic("Le texte persuasif et argumentatif", "La thèse; Les arguments et les preuves; La conclusion"),
      topic("Les structures de phrase complexes", "Les subordonnées; La ponctuation; Les marqueurs de relation"),
    ),
    strand(G,
      topic("Les temps du passé", "Le passé composé et l'imparfait; Raconter au passé"),
      topic("Le futur simple", "Les terminaisons; Les radicaux irréguliers; Futur simple ou futur proche?"),
      topic("Le conditionnel présent (introduction)", "La formation; Exprimer un souhait ou une politesse"),
      topic("Les pronoms compléments", "Directs et indirects; Deux pronoms dans une phrase"),
      topic("Les pronoms y et en", "Remplacer un lieu; Remplacer une quantité"),
      topic("Les pronoms relatifs", "Qui, que, où; Dont (introduction)"),
    ),
  ]),

  course(8, "french-immersion", [
    strand(O,
      topic("La recherche et la présentation orale", "Le débat; La présentation multimédia; L'écoute critique"),
    ),
    strand(L,
      topic("L'analyse et l'interprétation littéraire", "Les thèmes; Le point de vue du narrateur; Interpréter un texte"),
      topic("La culture et la littérature francophones", "Auteurs francophones du Canada; La francophonie dans le monde"),
    ),
    strand(E,
      topic("La rédaction d'une dissertation", "Le plan; L'introduction, le développement et la conclusion; Les citations"),
      topic("Le texte argumentatif et persuasif", "Les stratégies de persuasion; Réfuter un argument"),
    ),
    strand(G,
      topic("Les temps de verbes", "Révision du présent, du passé composé et de l'imparfait; La concordance des temps"),
      topic("Le plus-que-parfait", "La formation; Les emplois"),
      topic("Le futur simple et le conditionnel présent", "La formation; Les phrases avec si"),
      topic("Le subjonctif présent (introduction)", "Il faut que…; Les verbes de volonté; La formation"),
      topic("Les pronoms", "Pronoms compléments, y et en; Pronoms relatifs; L'ordre des pronoms"),
      topic("Les phrases complexes", "La coordination et la subordination; Varier ses phrases"),
    ),
  ], {
    note: "Le subjonctif is introduced in some Grade 8 immersion programs and taught fully in high school.",
  }),
];
