let currentMediumWordsListIndex = 0;

export function getCurrentMediumWord() {
  const word = mediumWordsList[currentMediumWordsListIndex];
  return word;
}

export function nextMediumWord() {
  currentMediumWordsListIndex = (currentMediumWordsListIndex + 1) % mediumWordsList.length;
}

// Fisher-Yates shuffling algorithm
// https://stackoverflow.com/a/2450976/1431146
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Medium Catch Phrase words, from https://www.thegamegal.com/word-generator/
const mediumWordsList = shuffle(['factory',
  'marathon',
  'boil',
  'lighthouse',
  'crazy',
  'wallet',
  'quilt',
  'pack',
  'online',
  'snowman',
  'Ã¯Â»Â¿aardvark',
  'index',
  'skate',
  'cramp',
  'twilight',
  'sip',
  'check',
  'mom',
  'chess',
  'bubble',
  'writer',
  'morning',
  'sofa',
  'figure skating',
  'polish',
  'suit',
  'paperclip',
  'tickle',
  'squint',
  'lamp',
  'ribbon',
  'teenager',
  'acne',
  'ticket',
  'time machine',
  'matchstick',
  'smoke',
  'blush',
  'railroad',
  'jet',
  'friend',
  'foe',
  'yo-yo',
  'sum',
  'shipwreck',
  'agree',
  'bedspread',
  'heel',
  'lifeboat',
  'road trip',
  'clown',
  'wrap',
  'airport',
  'breaststroke',
  'snuggle',
  'nightmare',
  'ceiling fan',
  'banana peel',
  'dirt',
  'calorie',
  'wick',
  'noise',
  'sunburn',
  'grandfather',
  'prize',
  'entrepreneur',
  'entertainer',
  'story',
  'verse',
  'pawn',
  'snowball',
  'windmill',
  'monster',
  'tag',
  'wristwatch',
  'sap',
  'candlestick',
  'waste',
  'doghouse',
  'snap',
  'sandpaper',
  'cage',
  'leotard',
  'aristocrat',
  'seashore',
  'transport',
  'number',
  'lid',
  'oil',
  'pleasure',
  'loveseat',
  'career',
  'camp',
  'tire',
  'safari',
  'insect',
  'branch',
  'energy',
  'amusement park',
  'rancher',
  'germ',
  'selfish',
  'usher',
  'flock',
  'pride',
  'tip',
  'spend',
  'quiz',
  'monarch',
  'finger',
  'puppet',
  'tailor',
  'match',
  'world',
  'size',
  'city',
  'weed',
  'bathroom scale',
  'violin',
  'church',
  'inbox',
  'bite',
  'stiff',
  'stingray',
  'sleigh',
  'observe',
  'jeep',
  'trousers',
  'letters',
  'astronaut',
  'mail',
  'Friday',
  'yesterday',
  'healthy',
  'coach',
  'police officer',
  'armadillo',
  'top hat',
  'guppy',
  'lake',
  'address',
  'dew',
  'envious',
  'bruise',
  'curtains',
  'record',
  'between',
  'cape',
  'saw',
  'ditch',
  'retire',
  'paint',
  'skis',
  'bunk bed',
  'sun block',
  'tar',
  'pinch',
  'Christmas carolers',
  'porch swing',
  'underwear',
  'quill',
  'chain',
  'fad',
  'cello',
  'souvenir',
  'glide',
  'driveway',
  'reign',
  'mountain biking',
  'rug',
  'plumber',
  'fishing pole',
  'zipper',
  'runt',
  'seashell',
  'war',
  'judgmental',
  'funny',
  'basket',
  'snowflake',
  'letter opener',
  'photograph',
  'beach',
  'price',
  'arm',
  'Windex',
  'tool',
  'hurdle',
  'bonnet',
  'stoplight',
  'swing',
  'claw',
  'beg',
  'state',
  'draw',
  'double',
  'jaw',
  'living room',
  'inventor',
  'territory',
  'bedbug',
  'year',
  'puzzle piece',
  'nation',
  'budget',
  'nail',
  'firefighter',
  'crack',
  'blue jeans',
  'music',
  'start',
  'baseboards',
  'oak tree',
  'whine',
  'robot',
  'send',
  'senior',
  'classroom',
  'batteries',
  'chin',
  'hot tub',
  'pill',
  'blue whale',
  'silver',
  'ancestor',
  'ironing board',
  'leak',
  'outer space',
  'hike',
  'nucleus',
  'shack',
  'operation',
  'unit',
  'standing ovation',
  'aunt',
  'delay',
  'toddler',
  'plastic',
  'bandage',
  'bridge',
  'bubble wrap',
  'departure',
  'dance',
  'forest',
  'attic',
  'jog',
  'flagpole',
  'cheer',
  'mall',
  'feast',
  'stomp',
  'earache',
  'saddle',
  'injure',
  'magic',
  'eat',
  'trash can',
  'robin',
  'magnet',
  'spring',
  'slide',
  'voyage',
  'brain',
  'hose',
  'tooth',
  'weather',
  'waist',
  'rocking chair',
  'camping',
  'believe',
  'month',
  'map',
  'family reunion',
  'country',
  'recycle',
  'drums',
  'app',
  'coupon',
  'leather',
  'caribou',
  'sod',
  'week',
  'pocket',
  'tulip',
  'dragonfly',
  'skin',
  'quicksand',
  'sponge',
  'pond',
  'kiss',
  'bake',
  'twig',
  'pin',
  'alarm clock',
  'rattle',
  'iPod',
  'pigpen',
  'team',
  'desk',
  'mute',
  'infant',
  'gasoline',
  'triplets',
  'basketball',
  'goblin',
  'ivy',
  'Segway',
  'wedding ring',
  'laugh',
  'teammate',
  'decide',
  'beach house',
  'stapler',
  'brass',
  'submerge',
  'spaceship',
  'stone',
  'barn',
  'sailboat',
  'dentist',
  'foil',
  'yawn',
  'regret',
  'gate',
  'wound',
  'skateboard',
  'skip',
  'movie',
  'bass',
  'snowboard',
  'net',
  'newspaper',
  'ship',
  'click',
  'motel',
  'plow',
  'spy',
  'voice',
  'smog',
  'nursery',
  'face',
  'tank',
  'rib',
  'bait',
  'riddle',
  'sprinkler',
  'toad',
  'chauffeur',
  'slush',
  'silverware',
  'electricity',
  'elf',
  'beanstalk',
  'stationery',
  'waves',
  'lunch tray',
  'darts',
  'relative',
  'passport',
  'metal',
  'blink',
  'stage',
  'surfboard',
  'rock',
  'think',
  'rainbow',
  'shoulder',
  'curious',
  'cot',
  'stepmom',
  'skeleton',
  'washing machine',
  'hotel',
  'fetch',
  'swamp',
  'trumpet',
  'stove',
  'visitor',
  'sheet',
  'mast',
  'wilderness',
  'cancel',
  'log',
  'earthworm',
  'whistle',
  'sister',
  'mountain',
  'mold',
  'buddy',
  'mother',
  'taxi',
  'organ',
  'spouse',
  'want',
  'blackboard',
  'snack',
  'air',
  'typhoon',
  'grown-up',
  'wonder',
  'flu',
  'rut',
  'bowtie',
  'spider web',
  'ink',
  'date',
  'freshman',
  'photographer',
  'hand',
  'headache',
  'pipe',
  'vase',
  'home movies',
  'midwife',
  'yoke',
  'sneeze',
  'ballpoint pen',
  'sin',
  'rim',
  'front porch',
  'crumb',
  'lip',
  'blanket',
  'dawn',
  'cell',
  'succeed',
  'shower curtain',
  'excuse',
  'stem',
  'neon',
  'pull',
  'job',
  'pogo stick',
  'hide-and-seek',
  'rollerblades',
  'button',
  'skull',
  'knight',
  'tennis shoes',
  'monopoly',
  'tiptoe',
  'linen',
  'sentence',
  'curb',
  'cloud',
  'spark',
  'dollar',
  'banister',
  'mine',
  'wheat',
  'throne',
  'wag',
  'meal',
  'harp',
  'tremble',
  'shed',
  'paperback',
  'shopping cart',
  'stream',
  'yam',
  'trailer',
  'Internet',
  'dimple',
  'x-ray',
  'hopscotch',
  'card',
  'sense',
  'fiddle',
  'fence',
  'telephone booth',
  'seesaw',
  'puzzle',
  'earthquake',
  'sunshine',
  'birthday',
  'rake',
  'baby-sitter',
  'softball',
  'museum',
  'campsite',
  'sidewalk',
  'forehead',
  'shrimp',
  'avoid',
  'hip',
  'candle',
  'scar',
  'plane',
  'vent',
  'currency',
  'word',
  'produce',
  'flute',
  'boa constrictor',
  'water',
  'volunteer',
  'hug',
  't-shirt',
  'president',
  'lumber',
  'sink',
  'blossom',
  'customer service',
  'grill',
  'stairs',
  'grandma',
  'rind',
  'watchtower',
  'rocket',
  'wind',
  'blunt',
  'gumball',
  'holiday',
  'hoedown',
  'shrub',
  'paddle',
  'low',
  'fine',
  'money',
  'cartographer',
  'cab',
  'goal',
  'sideline',
  'corner',
  'soil',
  'pea',
  'easel',
  'bump',
  'Pluto',
  'mop',
  'wrench',
  'slam dunk',
  'nitrogen',
  'spread',
  'shelf',
  'jungle',
  'bobsled',
  'steel',
  'Old Spice',
  'chimpanzee',
  'eraser',
  'rejoice',
  'volt',
  'torch',
  'ping pong',
  'thread',
  'spine',
  'maid',
  'carbon',
  'joyful',
  'coin',
  'bicycle',
  'scale',
  'gold',
  'race',
  'printer',
  'huddle',
  'bib',
  'cartoon',
  'brick',
  'predator',
  'cruise',
  'robe',
  'rebound',
  'park',
  'experiment',
  'noun',
  'glue stick',
  'cowboy',
  'fog',
  'hornet',
  'step-daughter',
  'post office',
  'poster',
  'offer',
  'stripe',
  'wood',
  'plant',
  'order',
  'hook',
  'bud',
  'son',
  'veil',
  'dock',
  'pharmacy',
]);
