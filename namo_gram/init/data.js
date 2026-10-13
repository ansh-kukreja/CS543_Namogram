const imageUrls = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop"
];

const samplePosts = [
  {
    userId: "user_001",
    image: imageUrls[0],
    caption: "Chasing sunsets and collecting memories. 🌅",
    tags: ["sunset", "nature", "photography"],
    uploadTime: new Date("2026-10-10T17:30:00Z"),
    commentId: "comment_001",
    likes: ["user_002", "user_003", "user_005"]
  },
  {
    userId: "user_002",
    image: imageUrls[1],
    caption: "Sometimes all you need is a mountain escape. 🏔️",
    tags: ["mountains", "travel", "adventure"],
    uploadTime: new Date("2026-10-10T14:20:00Z"),
    commentId: "comment_002",
    likes: ["user_001", "user_004", "user_006"]
  },
  {
    userId: "user_003",
    image: imageUrls[2],
    caption: "Peace is a place, not just a feeling.",
    tags: ["peace", "nature", "travel"],
    uploadTime: new Date("2026-10-10T11:45:00Z"),
    commentId: "comment_003",
    likes: ["user_001", "user_002"]
  },
  {
    userId: "user_004",
    image: imageUrls[3],
    caption: "Ocean waves and a completely clear mind. 🌊",
    tags: ["ocean", "beach", "relax"],
    uploadTime: new Date("2026-10-09T18:15:00Z"),
    commentId: "comment_004",
    likes: ["user_002", "user_003", "user_007"]
  },
  {
    userId: "user_005",
    image: imageUrls[4],
    caption: "Take the scenic route whenever you can.",
    tags: ["landscape", "travel", "explore"],
    uploadTime: new Date("2026-10-09T15:00:00Z"),
    commentId: "comment_005",
    likes: ["user_001", "user_006"]
  },
  {
    userId: "user_006",
    image: imageUrls[5],
    caption: "Golden hour makes everything beautiful. ✨",
    tags: ["goldenhour", "sky", "photography"],
    uploadTime: new Date("2026-10-09T12:10:00Z"),
    commentId: "comment_006",
    likes: ["user_003", "user_004", "user_008"]
  },
  {
    userId: "user_007",
    image: imageUrls[6],
    caption: "Into the woods, away from the noise.",
    tags: ["forest", "hiking", "nature"],
    uploadTime: new Date("2026-10-08T17:00:00Z"),
    commentId: "comment_007",
    likes: ["user_002", "user_005"]
  },
  {
    userId: "user_008",
    image: imageUrls[7],
    caption: "Vitamin Sea is all I need right now. 🏖️",
    tags: ["beach", "vacation", "summer"],
    uploadTime: new Date("2026-10-08T13:30:00Z"),
    commentId: "comment_008",
    likes: ["user_001", "user_004", "user_009"]
  },
  {
    userId: "user_009",
    image: imageUrls[8],
    caption: "Flowers remind us that growth takes time. 🌸",
    tags: ["flowers", "growth", "positivity"],
    uploadTime: new Date("2026-10-08T09:20:00Z"),
    commentId: "comment_009",
    likes: ["user_003", "user_006"]
  },
  {
    userId: "user_010",
    image: imageUrls[9],
    caption: "New places, new perspectives, new stories.",
    tags: ["travel", "adventure", "memories"],
    uploadTime: new Date("2026-10-07T16:40:00Z"),
    commentId: "comment_010",
    likes: ["user_002", "user_005", "user_007"]
  },
  {
    userId: "user_011",
    image: imageUrls[0],
    caption: "Weekend mode: switched on. 😎",
    tags: ["weekend", "chill", "lifestyle"],
    uploadTime: new Date("2026-10-07T12:15:00Z"),
    commentId: "comment_011",
    likes: ["user_001", "user_008"]
  },
  {
    userId: "user_012",
    image: imageUrls[1],
    caption: "The best views come after the hardest climbs.",
    tags: ["motivation", "hiking", "mountains"],
    uploadTime: new Date("2026-10-06T18:05:00Z"),
    commentId: "comment_012",
    likes: ["user_003", "user_006", "user_010"]
  },
  {
    userId: "user_013",
    image: imageUrls[2],
    caption: "A little adventure never hurt anyone.",
    tags: ["adventure", "travel", "explore"],
    uploadTime: new Date("2026-10-06T14:00:00Z"),
    commentId: "comment_013",
    likes: ["user_004", "user_009"]
  },
  {
    userId: "user_014",
    image: imageUrls[3],
    caption: "Let the tides wash your worries away.",
    tags: ["ocean", "peace", "beach"],
    uploadTime: new Date("2026-10-06T10:30:00Z"),
    commentId: "comment_014",
    likes: ["user_002", "user_007", "user_011"]
  },
  {
    userId: "user_015",
    image: imageUrls[4],
    caption: "Finding beauty in the little things.",
    tags: ["simpleliving", "nature", "mindfulness"],
    uploadTime: new Date("2026-10-05T17:45:00Z"),
    commentId: "comment_015",
    likes: ["user_001", "user_005"]
  },
  {
    userId: "user_016",
    image: imageUrls[5],
    caption: "Proof that every sunset is unique.",
    tags: ["sunset", "evening", "photography"],
    uploadTime: new Date("2026-10-05T15:15:00Z"),
    commentId: "comment_016",
    likes: ["user_003", "user_010", "user_012"]
  },
  {
    userId: "user_017",
    image: imageUrls[6],
    caption: "Nature doesn't need a filter. 🌿",
    tags: ["nature", "green", "photography"],
    uploadTime: new Date("2026-10-05T11:00:00Z"),
    commentId: "comment_017",
    likes: ["user_006", "user_008"]
  },
  {
    userId: "user_018",
    image: imageUrls[7],
    caption: "Collect moments, not things.",
    tags: ["memories", "travel", "life"],
    uploadTime: new Date("2026-10-04T19:00:00Z"),
    commentId: "comment_018",
    likes: ["user_002", "user_009", "user_013"]
  },
  {
    userId: "user_019",
    image: imageUrls[8],
    caption: "Bloom at your own pace. 🌷",
    tags: ["flowers", "selfgrowth", "inspiration"],
    uploadTime: new Date("2026-10-04T14:35:00Z"),
    commentId: "comment_019",
    likes: ["user_004", "user_011"]
  },
  {
    userId: "user_020",
    image: imageUrls[9],
    caption: "Somewhere between lost and found.",
    tags: ["travel", "journey", "adventure"],
    uploadTime: new Date("2026-10-04T09:45:00Z"),
    commentId: "comment_020",
    likes: ["user_001", "user_007", "user_015"]
  },
  {
    userId: "user_021",
    image: imageUrls[0],
    caption: "Make today worth remembering.",
    tags: ["motivation", "dailyinspiration", "life"],
    uploadTime: new Date("2026-10-03T18:25:00Z"),
    commentId: "comment_021",
    likes: ["user_005", "user_012"]
  },
  {
    userId: "user_022",
    image: imageUrls[1],
    caption: "Fresh air, fresh thoughts, fresh energy.",
    tags: ["outdoors", "wellness", "mountains"],
    uploadTime: new Date("2026-10-03T13:50:00Z"),
    commentId: "comment_022",
    likes: ["user_003", "user_010", "user_018"]
  },
  {
    userId: "user_023",
    image: imageUrls[2],
    caption: "Adventure is calling. Are you coming?",
    tags: ["adventure", "travel", "weekend"],
    uploadTime: new Date("2026-10-03T10:10:00Z"),
    commentId: "comment_023",
    likes: ["user_006", "user_014"]
  },
  {
    userId: "user_024",
    image: imageUrls[3],
    caption: "The sound of the ocean is my favourite song.",
    tags: ["ocean", "waves", "relaxation"],
    uploadTime: new Date("2026-10-02T17:35:00Z"),
    commentId: "comment_024",
    likes: ["user_002", "user_008", "user_016"]
  },
  {
    userId: "user_025",
    image: imageUrls[4],
    caption: "Chasing dreams, one step at a time.",
    tags: ["dreams", "goals", "motivation"],
    uploadTime: new Date("2026-10-02T12:45:00Z"),
    commentId: "comment_025",
    likes: ["user_001", "user_009"]
  },
  {
    userId: "user_026",
    image: imageUrls[5],
    caption: "The sky puts on a different show every day.",
    tags: ["sky", "sunset", "beautiful"],
    uploadTime: new Date("2026-10-02T09:30:00Z"),
    commentId: "comment_026",
    likes: ["user_004", "user_013", "user_020"]
  },
  {
    userId: "user_027",
    image: imageUrls[6],
    caption: "Take a deep breath. You've got this.",
    tags: ["mindfulness", "motivation", "selfcare"],
    uploadTime: new Date("2026-10-01T18:10:00Z"),
    commentId: "comment_027",
    likes: ["user_005", "user_015"]
  },
  {
    userId: "user_028",
    image: imageUrls[7],
    caption: "Sandy toes and salty hair.",
    tags: ["beachlife", "summer", "vacation"],
    uploadTime: new Date("2026-10-01T14:25:00Z"),
    commentId: "comment_028",
    likes: ["user_007", "user_011", "user_021"]
  },
  {
    userId: "user_029",
    image: imageUrls[8],
    caption: "A flower doesn't compete; it simply blooms.",
    tags: ["flowers", "positivity", "growth"],
    uploadTime: new Date("2026-10-01T11:40:00Z"),
    commentId: "comment_029",
    likes: ["user_002", "user_016"]
  },
  {
    userId: "user_030",
    image: imageUrls[9],
    caption: "Leave footprints, take photographs.",
    tags: ["photography", "travel", "memories"],
    uploadTime: new Date("2026-09-30T17:20:00Z"),
    commentId: "comment_030",
    likes: ["user_003", "user_012", "user_022"]
  },
  {
    userId: "user_031",
    image: imageUrls[0],
    caption: "Good things take time. Keep going.",
    tags: ["inspiration", "patience", "growth"],
    uploadTime: new Date("2026-09-30T13:10:00Z"),
    commentId: "comment_031",
    likes: ["user_001", "user_017"]
  },
  {
    userId: "user_032",
    image: imageUrls[1],
    caption: "A little closer to the clouds today. ☁️",
    tags: ["mountains", "clouds", "hiking"],
    uploadTime: new Date("2026-09-30T09:55:00Z"),
    commentId: "comment_032",
    likes: ["user_006", "user_014", "user_024"]
  },
  {
    userId: "user_033",
    image: imageUrls[2],
    caption: "Let life surprise you sometimes.",
    tags: ["life", "adventure", "spontaneous"],
    uploadTime: new Date("2026-09-29T18:40:00Z"),
    commentId: "comment_033",
    likes: ["user_009", "user_019"]
  },
  {
    userId: "user_034",
    image: imageUrls[3],
    caption: "Somewhere the waves meet the horizon.",
    tags: ["ocean", "horizon", "peace"],
    uploadTime: new Date("2026-09-29T14:15:00Z"),
    commentId: "comment_034",
    likes: ["user_004", "user_013", "user_025"]
  },
  {
    userId: "user_035",
    image: imageUrls[4],
    caption: "Happiness is an open road and good company.",
    tags: ["roadtrip", "friends", "travel"],
    uploadTime: new Date("2026-09-29T10:05:00Z"),
    commentId: "comment_035",
    likes: ["user_007", "user_018"]
  },
  {
    userId: "user_036",
    image: imageUrls[5],
    caption: "Another day, another reason to be grateful.",
    tags: ["gratitude", "positivity", "daily"],
    uploadTime: new Date("2026-09-28T17:50:00Z"),
    commentId: "comment_036",
    likes: ["user_002", "user_020", "user_027"]
  },
  {
    userId: "user_037",
    image: imageUrls[6],
    caption: "Disconnect to reconnect with yourself.",
    tags: ["digitaldetox", "nature", "mindfulness"],
    uploadTime: new Date("2026-09-28T12:30:00Z"),
    commentId: "comment_037",
    likes: ["user_008", "user_016"]
  },
  {
    userId: "user_038",
    image: imageUrls[7],
    caption: "Paradise found. 🌴",
    tags: ["paradise", "beach", "holiday"],
    uploadTime: new Date("2026-09-28T09:15:00Z"),
    commentId: "comment_038",
    likes: ["user_005", "user_014", "user_029"]
  },
  {
    userId: "user_039",
    image: imageUrls[8],
    caption: "Surround yourself with things that make you happy.",
    tags: ["happiness", "flowers", "lifestyle"],
    uploadTime: new Date("2026-09-27T18:20:00Z"),
    commentId: "comment_039",
    likes: ["user_003", "user_021"]
  },
  {
    userId: "user_040",
    image: imageUrls[9],
    caption: "Every journey begins with a single step.",
    tags: ["journey", "goals", "motivation"],
    uploadTime: new Date("2026-09-27T14:45:00Z"),
    commentId: "comment_040",
    likes: ["user_010", "user_017", "user_030"]
  },
  {
    userId: "user_041",
    image: imageUrls[0],
    caption: "Stay curious. Keep exploring.",
    tags: ["curiosity", "explore", "adventure"],
    uploadTime: new Date("2026-09-27T10:25:00Z"),
    commentId: "comment_041",
    likes: ["user_006", "user_023"]
  },
  {
    userId: "user_042",
    image: imageUrls[1],
    caption: "Views like these make every step worthwhile.",
    tags: ["views", "hiking", "nature"],
    uploadTime: new Date("2026-09-26T17:15:00Z"),
    commentId: "comment_042",
    likes: ["user_004", "user_019", "user_031"]
  },
  {
    userId: "user_043",
    image: imageUrls[2],
    caption: "Collecting little moments of joy.",
    tags: ["joy", "memories", "lifestyle"],
    uploadTime: new Date("2026-09-26T13:35:00Z"),
    commentId: "comment_043",
    likes: ["user_001", "user_024"]
  },
  {
    userId: "user_044",
    image: imageUrls[3],
    caption: "Let the ocean remind you how vast life can be.",
    tags: ["ocean", "inspiration", "reflection"],
    uploadTime: new Date("2026-09-26T09:40:00Z"),
    commentId: "comment_044",
    likes: ["user_008", "user_028", "user_036"]
  },
  {
    userId: "user_045",
    image: imageUrls[4],
    caption: "Choose experiences over excuses.",
    tags: ["experiences", "travel", "motivation"],
    uploadTime: new Date("2026-09-25T18:00:00Z"),
    commentId: "comment_045",
    likes: ["user_012", "user_025"]
  },
  {
    userId: "user_046",
    image: imageUrls[5],
    caption: "Sunsets are proof that endings can be beautiful.",
    tags: ["sunset", "inspiration", "evening"],
    uploadTime: new Date("2026-09-25T14:50:00Z"),
    commentId: "comment_046",
    likes: ["user_005", "user_018", "user_033"]
  },
  {
    userId: "user_047",
    image: imageUrls[6],
    caption: "Find your own little corner of peace.",
    tags: ["peace", "forest", "relaxation"],
    uploadTime: new Date("2026-09-25T11:25:00Z"),
    commentId: "comment_047",
    likes: ["user_009", "user_022"]
  },
  {
    userId: "user_048",
    image: imageUrls[7],
    caption: "Life is better with a little sunshine.",
    tags: ["sunshine", "beach", "happiness"],
    uploadTime: new Date("2026-09-24T17:40:00Z"),
    commentId: "comment_048",
    likes: ["user_003", "user_027", "user_040"]
  },
  {
    userId: "user_049",
    image: imageUrls[8],
    caption: "Growing through what you go through.",
    tags: ["growth", "flowers", "resilience"],
    uploadTime: new Date("2026-09-24T13:20:00Z"),
    commentId: "comment_049",
    likes: ["user_011", "user_026"]
  },
  {
    userId: "user_050",
    image: imageUrls[9],
    caption: "The world is too beautiful to stay in one place.",
    tags: ["world", "travel", "explore"],
    uploadTime: new Date("2026-09-24T09:10:00Z"),
    commentId: "comment_050",
    likes: ["user_002", "user_016", "user_035"]
  }
];

module.exports = { data: samplePosts };