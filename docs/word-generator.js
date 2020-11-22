import memoizeOne from "memoize-one";

export function getMediumWord(unboundedIndex, shuffleSeed) {
  return memoizedShuffle(mediumWordsList, shuffleSeed)[unboundedIndex % mediumWordsList.length];
}

// Deterministic shuffle w/ seed
// https://github.com/yixizhang/seed-shuffle/blob/master/index.js
const memoizedShuffle = memoizeOne(function shuffle(array, seed) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  seed = seed || 1;
  let random = function() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
});

// Medium Catch Phrase words, from https://www.thegamegal.com/word-generator/
const mediumWordsList = [
  'factory',
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

  // From Shauna
  'as the crow flies',
  'jackrabbit',
  'literally',
  'grammar',
  'a dime a dozen',
  'turkey dinner',
  'beat around the bush',
  'foot scrubber',
  'bite the bullet',
  'no pain no gain',
  'old western',
  'speak of the devil',
  'as right as rain',
  'friction harp',
  'calm before the storm',
  'fit as a fiddle',
  'leave no stone unturned',
  'banana chair',
  'gel pen',
  'glitter glue',
  'run like the wind',
  'through thick and thin',
  'frogfish',
  'calico cat',
  'monkey puzzle tree',
  'banana bread',
  'fantasy',
  'tyrant',
  'old as the hills',
  'toolbelt',
  'hold my beer',
  'thick as thieves',
  'starboard',
  'cheaters never prosper',
  'black spot',
  'treasure island',
  'each to their own',
  'romeo and juliet',
  'the good the bad and the ugly',
  'ignorance is bliss',
  'takes two to tango',
  'keep your chin up',
  'live and let live',
  'sight for sore eyes',
  'pardon my french',
  'fit as a butcher\'s dog',
  'happy cabbage',
  'in the ketchup',
  'in the spotlight',
  'viper',
  'frog sticks',
  'Sherlock Holmes',
  'Houston we have a problem',
  'cut the mustard',
  'easy as pie',
  'eat my dust',
  'icing on the cake',
  'in a pickle',
  'stick a fork in it',
  'not my cup of tea',
  'hamster wheel',
  'bouncy ball',
  'Luke Skywalker',
  'all bark and no bite',
  'long in the tooth',
  'an elephant never forgets',
  'crocodile tears',
  'elephant in the room',
  'fish out of water',
  'live bait',
  'out of left field',
  'right off the bat',
  'swing for the fences',
  'below the belt',
  'throw in the towel',
  'paint the town red',
  'toiletries',
  'international flight',
  'chip on your shoulder',
  'back to square one',
  'burst your bubble',
  'color me happy',
  'hound dog',
  'happy as a clam',
  'happy camper',
  'over the moon',
  'under the weather',
  'hit the roof',
  'up in arms',
  'third wheel',
  'transformer',
  'roadblock',
  'writer\'s block',
  'soundtrack',
  'apple of my eye',
  'off the record',
  'acid',
  'bring home the bacon',
  'barking mad',
  'basket case',
  'fly off the handle',
  'witch\'s brew',
  'saved by the bell',
  'mad as a hatter',
  'symphony',
  'phone bill',
  'tomato soup',
  'fried rice',
  'chicken pot pie',
  'cheesecake',
  'chimichanga',
  'chocolate covered strawberries',
  'submarine sandwich',
  'lamb chops',
  'raviolo',
  'onion rings',
  'croissant',
  'down to the wire',
  'off the wood',
  'wooden spoon',
  'wild card',
  'game of inches',
  'hail mary',
  'pass the baton',
  'albatross',
  'back pocket',
  'bicycle kick',
  'alpha and omega',
  'coat hanger',
  'conversion',
  'electrical outlet',
  'disposal',
  'face off',
  'a few dollars more',
  'John Williams',
  'scrimmage',
  'shepherd',
  'spear tackle',
  'chimney sweeper',
  'ambience',
  'collage',
  'composition',
  'foreground',
  'geometry',
  'beyond the horizon',
  'illusion',
  'perspective',
  'middle ground',
  'negative space',
  'proportion',
  'subject',
  'tint',
  'open source',
  'organic',
  'blueprint',
  'airbag',
  'coolant',
  'brake fluid',
  'gearbox',
  'keyless entry',
  'transmission',
  'aluminum',
  'space dust',
  'bacteria',
  'catalyst',
  'circuit',
  'contaminated',
  'molecule',
  'periodic table',
  'volatile',
  'phonetics',
  'chisel',
  'snow blower',
  'air compressor',
  'staple gun',
  'lug nut',
  'Kentucky Fried Chicken',
  'made in the shade',
  'burn rubber',
  'knuckle sandwich',
  'bust a gut',
  'hunk of junk',
  'far out',
  'lay it on me',
  'do me a solid',
  'phone case',
  'detective',
  'take a chill pill',
  'out to lunch',
  'talk to the hand',
  'can of worms',
  'bust a move',
  'giggle water',
  'church bell',
  'skating rink',
  'pretzels',
  'baritone',
  'cadence',
  'plane of existence',
  'ensemble',
  'harmony',
  'intonation',
  'quartet',
  'waltz',
  'barking owl',
  'gopher',
  'green iguana',
  'box turtle',
  'stars and stripes',
  'lemon shark',
  'bunny slippers',
  'gold digger',
  'heaven and hell',
  'computer desk',
  'speakerphone',
  'subwoofer',
  'federal court',
  'opaque',
  'fool\'s gold',
  'fever dreams',
  'Dead Poet\'s Society',
  'fact check',
  'Captain America',
  'flip flops',
  'glitch',
  'right to remain silent',
  'disturbance in the force',
  'Darth Vader',
  'do or do not',
  'virtual reality',
  'parallel universe',
  'perpendicular',
  'thunder and lightning',
  'civil engineer',
  'quarantine',
  'Professor Snape',
  'across the aisle',
  'fist bump',
  'shower curtain',
  'mind your manners',
  'Michael Jordan',
  'Abraham Lincoln',
  'Albert Einstein',
  'encyclopedia',
  'Will Smith',
  'law school',
  'leprechaun gold',
  'beach waves',
  'rosy cheeks',
  'earlobe',
  'henchman',
  'writing on the wall',
  'snuggle',
  'eyesore',
  'carpet cleaner',
  'administration',
  'transition',
  'car battery',
  'wireless mouse',
  'hatchet',
  'spray bottle',
  'Alaskan cruise',
  'clementine',
  'pumpkin pie',
  'peach cobbler',
  'album',
  'hatband',
  'ripple effect',
  'grand piano',
  'prairie',
  'backyard pool',
  'book spine',
  'publisher',
  'record player',
  'pen holder',
  'overpass',
  'annual exam',
  'platypus',
  'ultraviolet',
  'holiday card',
  'sweet potatoes',
  'grim reaper',
];
