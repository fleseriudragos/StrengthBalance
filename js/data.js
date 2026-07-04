
// ============================================================
// DATE: muschi (sub-regiuni), exercitii, grupe, perechi antagoniste
// ============================================================
// Acest fisier contine toate DATELE aplicatiei. Nu face niciun calcul si nu
// deseneaza nimic pe ecran — doar defineste "materia prima": ce muschi exista,
// ce exercitii exista si cum se leaga intre ele.
//
// De ce e separat: intr-un proiect bine organizat, datele stau separat de logica
// si de interfata (principiul "separarea responsabilitatilor"). Asa poti modifica
// lista de exercitii fara sa atingi restul codului.

// ---------- BAZA DE DATE MUSCULARA (pe SUB-REGIUNI) ----------
// Aici e inovatia lucrarii: in loc sa tratam "pieptul" ca un singur muschi,
// il impartim in sub-regiuni (superior, mijlociu, inferior). La fel pentru
// umeri (3 capete), triceps (3 capete), biceps (2 capete) etc.
// Fiecare intrare are: un nume afisat in romana si grupa mare din care face parte.
// Cheia (ex: "chest_upper") e identificatorul folosit intern in cod.
var MUSCLES = {
  chest_upper:{name:'Piept superior',group:'chest'},
  chest_mid:{name:'Piept mijlociu',group:'chest'},
  chest_lower:{name:'Piept inferior',group:'chest'},
  back_upper:{name:'Trapez',group:'back'},
  back_mid:{name:'Spate mijlociu',group:'back'},
  back_lats:{name:'Dorsali',group:'back'},
  back_lower:{name:'Lombari',group:'back'},
  delt_front:{name:'Deltoid anterior',group:'shoulders'},
  delt_side:{name:'Deltoid lateral',group:'shoulders'},
  delt_rear:{name:'Deltoid posterior',group:'shoulders'},
  biceps_long:{name:'Biceps cap lung',group:'arms'},
  biceps_short:{name:'Biceps cap scurt',group:'arms'},
  brachialis:{name:'Brahial',group:'arms'},
  triceps_long:{name:'Triceps cap lung',group:'arms'},
  triceps_lateral:{name:'Triceps cap lateral',group:'arms'},
  triceps_medial:{name:'Triceps cap medial',group:'arms'},
  forearm_flexors:{name:'Flexori antebrat',group:'arms'},
  forearm_extensors:{name:'Extensori antebrat',group:'arms'},
  quads:{name:'Cvadriceps',group:'legs'},
  hamstrings:{name:'Ischiogambieri',group:'legs'},
  glutes:{name:'Fesieri',group:'legs'},
  calves:{name:'Gambe',group:'legs'},
  tibialis:{name:'Tibial',group:'legs'},
  adductors:{name:'Adductori',group:'legs'},
  abductors:{name:'Abductori',group:'legs'},
  core_abs:{name:'Abdomen',group:'core'},
  core_obliques:{name:'Oblici',group:'core'},
};

// ---------- GRUPELE MUSCULARE MARI ----------
// Cele 6 grupe pe care utilizatorul le alege la inceputul antrenamentului.
// Fiecare sub-regiune de mai sus apartine uneia dintre acestea.
var GROUPS = [
  {id:'chest', name:'Piept'},
  {id:'back', name:'Spate'},
  {id:'shoulders', name:'Umeri'},
  {id:'arms', name:'Brate'},
  {id:'legs', name:'Picioare'},
  {id:'core', name:'Core'},
];

// ---------- PERECHILE ANTAGONISTE (muschi opusi) ----------
// Doi muschi sunt "antagonisti" daca au actiuni opuse (ex: bicepsul indoaie
// bratul, tricepsul il intinde). Pentru postura sanatoasa si articulatii,
// raportul dintre ei trebuie sa fie echilibrat.
// "idealRatio" = raportul tinta dintre muschiul mai slab si cel mai puternic,
// valori luate din literatura de kinetoterapie (1.0 = egali, 0.7 = normal sa fie
// unul ceva mai puternic). Agentul compara raportul REAL cu acest ideal.
var ANTAGONIST_PAIRS = [
  {a:'chest_mid',b:'back_mid',label:'Piept - Spate',idealRatio:1.0},
  {a:'chest_upper',b:'back_upper',label:'Piept sup - Trapez',idealRatio:1.0},
  {a:'delt_front',b:'delt_rear',label:'Umar ant - post',idealRatio:0.8},
  {a:'biceps_long',b:'triceps_long',label:'Biceps - Triceps',idealRatio:0.7},
  {a:'quads',b:'hamstrings',label:'Cvadriceps - Ischio',idealRatio:0.75},
  {a:'core_abs',b:'back_lower',label:'Abdomen - Lombari',idealRatio:1.0},
  {a:'calves',b:'tibialis',label:'Gambe - Tibial',idealRatio:1.2},
];

// ---------- LIBRARIA DE EXERCITII ----------
// Fiecare exercitiu are: identificator, nume, echipament, grupa, si cel mai
// important — "activation": ce muschi lucreaza si CAT de mult (factor 0 la 1).
//   factor 1.0 = muschi PRINCIPAL (mobilizatorul principal al exercitiului)
//   factor 0.5 = muschi SECUNDAR (ajuta, dar nu e principalul)
//   factor 0.3 = STABILIZATOR (activare mica)
// Exemplu: impinsul la piept lucreaza pieptul mijlociu la maxim (1.0), dar si
// tricepsul si umarul mai putin. Aceste valori vin din studii de electromiografie
// (EMG) care masoara activarea musculara reala. Agentul le foloseste ca sa
// calculeze cat volum primeste fiecare sub-regiune.
var EXERCISES = [
  // PIEPT
  {id:'bench_press',name:'Impins la piept cu bara',equipment:'Bara',group:'chest',activation:{chest_mid:1.0,chest_lower:0.6,chest_upper:0.3,triceps_lateral:0.5,triceps_medial:0.5,delt_front:0.5}},
  {id:'incline_bench',name:'Impins inclinat cu bara',equipment:'Bara',group:'chest',activation:{chest_upper:1.0,chest_mid:0.5,delt_front:0.6,triceps_lateral:0.4,triceps_medial:0.4}},
  {id:'incline_db_press',name:'Impins inclinat cu gantere',equipment:'Gantere',group:'chest',activation:{chest_upper:1.0,chest_mid:0.5,delt_front:0.5,triceps_medial:0.3}},
  {id:'decline_bench',name:'Impins declinat',equipment:'Bara',group:'chest',activation:{chest_lower:1.0,chest_mid:0.6,triceps_lateral:0.4,triceps_medial:0.4}},
  {id:'dips',name:'Dips la paralele',equipment:'Corporal',group:'chest',activation:{chest_lower:1.0,chest_mid:0.5,triceps_lateral:0.6,triceps_long:0.4,delt_front:0.4}},
  {id:'cable_fly_low',name:'Fluturari cablu de jos',equipment:'Cablu',group:'chest',activation:{chest_upper:1.0,chest_mid:0.4}},
  {id:'cable_fly_high',name:'Fluturari cablu de sus',equipment:'Cablu',group:'chest',activation:{chest_lower:1.0,chest_mid:0.5}},
  // SPATE
  {id:'pullup',name:'Tractiuni',equipment:'Corporal',group:'back',activation:{back_lats:1.0,back_mid:0.5,biceps_long:0.5,biceps_short:0.4,forearm_flexors:0.3}},
  {id:'barbell_row',name:'Ramat cu bara',equipment:'Bara',group:'back',activation:{back_mid:1.0,back_lats:0.7,back_upper:0.4,delt_rear:0.4,biceps_long:0.3}},
  {id:'lat_pulldown',name:'Helcometru',equipment:'Cablu',group:'back',activation:{back_lats:1.0,back_mid:0.4,biceps_short:0.4}},
  {id:'seated_row',name:'Ramat la cablu sezand',equipment:'Cablu',group:'back',activation:{back_mid:1.0,back_lats:0.5,delt_rear:0.4,biceps_long:0.3}},
  {id:'deadlift',name:'Indreptari',equipment:'Bara',group:'back',activation:{back_lower:1.0,glutes:0.8,hamstrings:0.7,back_mid:0.5,back_upper:0.4,forearm_flexors:0.4}},
  {id:'face_pull',name:'Face pull',equipment:'Cablu',group:'back',activation:{delt_rear:1.0,back_upper:0.5,back_mid:0.4}},
  {id:'shrugs',name:'Ridicari de umeri (shrugs)',equipment:'Gantere',group:'back',activation:{back_upper:1.0}},
  // UMERI
  {id:'ohp',name:'Impins deasupra capului',equipment:'Bara',group:'shoulders',activation:{delt_front:1.0,delt_side:0.5,triceps_long:0.4,triceps_lateral:0.4,chest_upper:0.3}},
  {id:'lateral_raise',name:'Ridicari laterale',equipment:'Gantere',group:'shoulders',activation:{delt_side:1.0,delt_front:0.3}},
  {id:'rear_delt_fly',name:'Fluturari posterioare',equipment:'Gantere',group:'shoulders',activation:{delt_rear:1.0,back_mid:0.4}},
  {id:'front_raise',name:'Ridicari frontale',equipment:'Gantere',group:'shoulders',activation:{delt_front:1.0}},
  // BRATE
  {id:'barbell_curl',name:'Flexii cu bara',equipment:'Bara',group:'arms',activation:{biceps_long:0.7,biceps_short:0.8,brachialis:0.4,forearm_flexors:0.3}},
  {id:'incline_db_curl',name:'Flexii inclinate cu gantere',equipment:'Gantere',group:'arms',activation:{biceps_long:1.0,biceps_short:0.4}},
  {id:'preacher_curl',name:'Flexii la pupitru',equipment:'Gantere',group:'arms',activation:{biceps_short:1.0,brachialis:0.4}},
  {id:'hammer_curl',name:'Flexii tip ciocan',equipment:'Gantere',group:'arms',activation:{brachialis:1.0,biceps_long:0.5,forearm_extensors:0.4}},
  {id:'pushdown',name:'Extensii cablu (pushdown)',equipment:'Cablu',group:'arms',activation:{triceps_lateral:1.0,triceps_medial:0.6}},
  {id:'overhead_ext',name:'Extensii deasupra capului',equipment:'Gantere',group:'arms',activation:{triceps_long:1.0,triceps_medial:0.4}},
  {id:'skull_crusher',name:'Extensii culcat (skull crusher)',equipment:'Bara',group:'arms',activation:{triceps_long:0.8,triceps_lateral:0.6,triceps_medial:0.5}},
  {id:'close_grip_bench',name:'Impins priza ingusta',equipment:'Bara',group:'arms',activation:{triceps_medial:1.0,triceps_lateral:0.7,chest_mid:0.5,delt_front:0.3}},
  {id:'wrist_curl',name:'Flexii incheietura',equipment:'Gantere',group:'arms',activation:{forearm_flexors:1.0}},
  {id:'reverse_wrist_curl',name:'Extensii incheietura',equipment:'Gantere',group:'arms',activation:{forearm_extensors:1.0}},
  // PICIOARE
  {id:'squat',name:'Genuflexiuni cu bara',equipment:'Bara',group:'legs',activation:{quads:1.0,glutes:0.7,hamstrings:0.4,back_lower:0.4,adductors:0.4}},
  {id:'leg_press',name:'Presa de picioare',equipment:'Aparat',group:'legs',activation:{quads:1.0,glutes:0.6,hamstrings:0.3}},
  {id:'rdl',name:'Indreptari romanesti',equipment:'Bara',group:'legs',activation:{hamstrings:1.0,glutes:0.7,back_lower:0.5}},
  {id:'leg_curl',name:'Flexii de picioare',equipment:'Aparat',group:'legs',activation:{hamstrings:1.0,calves:0.3}},
  {id:'leg_ext',name:'Extensii de picioare',equipment:'Aparat',group:'legs',activation:{quads:1.0}},
  {id:'hip_thrust',name:'Hip thrust',equipment:'Bara',group:'legs',activation:{glutes:1.0,hamstrings:0.5}},
  {id:'calf_raise',name:'Ridicari pe varfuri',equipment:'Aparat',group:'legs',activation:{calves:1.0}},
  {id:'tibialis_raise',name:'Ridicari tibial',equipment:'Corporal',group:'legs',activation:{tibialis:1.0}},
  {id:'hip_abduction',name:'Abductie sold',equipment:'Aparat',group:'legs',activation:{abductors:1.0,glutes:0.4}},
  {id:'hip_adduction',name:'Adductie sold',equipment:'Aparat',group:'legs',activation:{adductors:1.0}},
  // CORE
  {id:'crunch',name:'Abdomene (crunch)',equipment:'Corporal',group:'core',activation:{core_abs:1.0,core_obliques:0.3}},
  {id:'leg_raise',name:'Ridicari de picioare',equipment:'Corporal',group:'core',activation:{core_abs:1.0}},
  {id:'russian_twist',name:'Rasuciri rusesti',equipment:'Corporal',group:'core',activation:{core_obliques:1.0,core_abs:0.5}},
  {id:'back_ext',name:'Hiperextensii',equipment:'Corporal',group:'core',activation:{back_lower:1.0,glutes:0.4,hamstrings:0.3}},
  {id:'plank',name:'Plansa (plank)',equipment:'Corporal',group:'core',activation:{core_abs:1.0,core_obliques:0.5}},
];

function getExercise(id){ for(var i=0;i<EXERCISES.length;i++) if(EXERCISES[i].id===id) return EXERCISES[i]; return null; }
function round1(x){ return Math.round(x*10)/10; }

var DB = { MUSCLES:MUSCLES, EXERCISES:EXERCISES, ANTAGONIST_PAIRS:ANTAGONIST_PAIRS };
