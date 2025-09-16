// Shared tone configurations for bio crafting
export interface Tone {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export const TONES: Tone[] = [
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm, approachable, and welcoming tone',
    examples: [
      "Hey there! I'm always up for trying new things and meeting interesting people.",
      "Love chatting with new people over coffee or a good walk in the park."
    ]
  },
  {
    id: 'witty',
    name: 'Witty',
    description: 'Clever, humorous, and playful tone',
    examples: [
      "Professional sandcastle builder at beach parties. Warning: I'm competitive at board games.",
      "I speak fluent sarcasm and intermediate dad jokes."
    ]
  },
  {
    id: 'confident',
    name: 'Confident',
    description: 'Self-assured and assertive tone',
    examples: [
      "I know what I want and I'm not afraid to go after it.",
      "Not looking for perfection, just someone real who's ready for adventure."
    ]
  },
  {
    id: 'sincere',
    name: 'Sincere',
    description: 'Genuine, honest, and heartfelt tone',
    examples: [
      "I believe in meaningful connections and honest conversations.",
      "Looking for someone who values authenticity as much as I do."
    ]
  },
  {
    id: 'flirty',
    name: 'Flirty',
    description: 'Playful, charming, and romantic tone',
    examples: [
      "I have a weakness for long walks and even longer conversations.",
      "Looking for someone to share adventures and stolen glances with."
    ]
  },
  {
    id: 'adventurous',
    name: 'Adventurous',
    description: 'Exciting, bold, and exploratory tone',
    examples: [
      "Weekend warrior always looking for the next thrill or hidden gem.",
      "Life's an adventure, and I'm ready for the next chapter."
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic, imaginative, and innovative tone',
    examples: [
      "I see beauty in unusual places and love thinking outside the box.",
      "Whether it's painting, writing, or cooking, I'm always creating something."
    ]
  },
  {
    id: 'authentic',
    name: 'Authentic',
    description: 'Real, honest, and true to oneself',
    examples: [
      "No filters, no pretenses. Just me being genuinely me.",
      "I value realness over perfection and depth over surface-level connections."
    ]
  },
  {
    id: 'intellectual',
    name: 'Intellectual',
    description: 'Thoughtful, analytical, and knowledge-seeking tone',
    examples: [
      "I enjoy deep conversations about philosophy, science, or current events.",
      "Always curious about how things work and why people think the way they do."
    ]
  },
  {
    id: 'nerdy',
    name: 'Nerdy',
    description: 'Geeky, knowledgeable, and passion-driven tone',
    examples: [
      "Comic book collector by day, trivia champion by night.",
      "I can explain the physics of why the sky is blue and why that's fascinating."
    ]
  }
];

export default TONES;