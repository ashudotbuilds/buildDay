/**
 * Mock API layer for CommuteClass frontend.
 * Conforms strictly to API_SPEC.md.
 */

export async function mockClarify(topic) {
  // Simulate network roundtrip (600ms)
  await new Promise((r) => setTimeout(r, 600));

  if (!topic || topic.trim().length === 0) {
    throw new Error("topic is required");
  }

  return {
    questions: [
      {
        q: "What's your current level with this topic?",
        options: ["Complete beginner", "Some background", "Pretty familiar already"],
      },
      {
        q: "What do you mainly want out of this?",
        options: ["Quick overview", "Understand how it actually works", "Prep for a conversation/exam"],
      },
      {
        q: "Any specific angle you care about?",
        options: ["The science/mechanism", "The history", "Why it's debated/controversial"],
      },
    ],
  };
}

export async function mockGenerateStream({ topic, level, goal, angle, minutes, voice }, onProgress, onDone, onError) {
  try {
    // Stage 1: Researching
    onProgress("researching");
    await new Promise((r) => setTimeout(r, 1200));

    // Stage 2: Writing
    onProgress("writing");
    await new Promise((r) => setTimeout(r, 1400));

    // Stage 3: Recording
    onProgress("recording");
    await new Promise((r) => setTimeout(r, 1200));

    // Stage 4: Done
    const targetWords = (minutes || 5) * 150;
    const sampleScript = `Welcome to your ${minutes}-minute audio briefing on ${topic || "this topic"}.

Imagine your immune system as a vigilant city security team. Vaccines are essentially the training drills for that force. Instead of waiting for a live intruder to wreak havoc, a vaccine introduces a harmless, disarmed mugshot—whether that's a fragment of protein or a blueprint like mRNA. 

When your specialized white blood cells, known as B-cells and T-cells, encounter this decoy, they study its unique surface markers and begin mass-producing custom antibodies. Crucially, they also form 'memory cells'. 

Weeks or decades later, if the actual pathogen attacks, your immune system doesn't hesitate. It recognizes the threat instantly and neutralizes it before you even feel sick. That is how vaccines turn a potentially lethal infection into a minor, unnoticed encounter.`;

    onDone({
      script: sampleScript,
      sources: [
        {
          title: "World Health Organization: How do vaccines work in the human body?",
          url: "https://www.who.int/news-room/feature-stories/detail/how-do-vaccines-work",
        },
        {
          title: "Centers for Disease Control and Prevention: Understanding Immunity",
          url: "https://www.cdc.gov/vaccines/basics/work.html",
        },
        {
          title: "Nature Immunology Review: Principles of Immunological Memory",
          url: "https://www.nature.com/articles/nri3862",
        },
      ],
      audioUrl: "/demo/demo1.mp3",
    });
  } catch (err) {
    onError(err?.message || "Failed to generate lesson");
  }
}

export const DEMO_LESSON_DATA = {
  topic: "How do vaccines work",
  minutes: 3,
  script: `Welcome to your 3-minute CommuteClass briefing on how vaccines work.

Think of your immune system like a high-tech security operation. Every day, it monitors trillions of cells for rogue invaders. When a completely novel virus or bacteria slips into the body, your defenses are caught flat-footed because they don't know the intruder's signature. It can take days to figure out the right molecular key to neutralize it, during which time you get sick.

Vaccines solve this by giving your immune system advance intelligence without the risk of disease. Traditional vaccines introduced a weakened or deadened version of the bug. Modern platforms, such as mRNA vaccines, deliver temporary instructions teaching your cells how to make a single, harmless surface protein of the germ.

Your immune system spots this foreign protein immediately. It unleashes dendritic cells to inspect it and alerts helper T-cells, which command B-cells to build precision antibodies. Once the drill is complete, the mRNA or harmless protein dissolves away. What stays behind are memory B and T cells. 

If the real virus ever dares to enter your body months or years later, these memory cells awaken within minutes, pumping out thousands of antibodies per second to wipe out the virus before it takes hold. That is the genius of immunological memory—training today to protect tomorrow.`,
  sources: [
    {
      title: "World Health Organization: Vaccines and Immunization",
      url: "https://www.who.int/news-room/feature-stories/detail/how-do-vaccines-work",
    },
    {
      title: "CDC: Immunity and Vaccines Explained",
      url: "https://www.cdc.gov/vaccines/basics/work.html",
    },
  ],
  audioUrl: "/demo/demo1.mp3",
};
