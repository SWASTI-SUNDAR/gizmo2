export const heatingQuestions = [
  {
    id: 1,
    text: "Reset the simulation, then set the Heat Level slider to 50%. Press the Start button to begin heating. Watch the graph as the solid changes to a liquid and then to a gas. What does the graph show about weight?",
    options: [
      "Weight decreases as the substance changes state.",
      "Weight increases when the gas forms.",
      "Weight remains the same during state changes.", // ✅
      "Weight disappears from the graph completely.",
    ],
    correctAnswer: 2, // Index 2 corresponds to the third option (C)
  },
  {
    id: 2,
    text: "Use the lever to seal the container, then begin heating. Record the weight once the water changes to precipitation. Click the Cool Down button to return the water to a solid. Next, open the container and heat again at the same temperature. Compare the weight readings. What happens when the container is sealed versus unsealed?",
    options: [
      "The weight increases when sealed and stays the same when unsealed.",
      "The weight stays the same when sealed but decreases when unsealed.", // ✅
      "The weight drops in both sealed and unsealed conditions.",
      "The weight stays the same in both sealed and unsealed conditions.",
    ],
    correctAnswer: 1, // Index 1 corresponds to the second option (B)
  },
  {
    id: 3,
    text: "Press the Start button to begin heating and observe the graph. As the solid changes to a liquid and then a gas, what pattern does the graph show about weight?",
    options: [
      "Weight decreases as the substance changes state.",
      "Weight increases when the gas forms.",
      "Weight remains the same during state changes.", // ✅
      "Weight disappears from the graph completely.",
    ],
    correctAnswer: 2, // Index 2 corresponds to the third option (C)
  },
];
export const coolingQuestions = [
  {
    id: 1,
    text: "Move the Cooling Rate slider to a low setting and start the simulation. Watch the temperature drop to zero and below and observe the liquid in the beaker. What change do you notice as the temperature decreases?",
    options: [
      "The liquid begins to boil, but the weight remains the same.",
      "The liquid turns into a solid, but the weight stays the same.", // ✅
      "The liquid disappears completely and the weight increases.",
      "The weight increases as the beaker gets colder.",
    ],
    correctAnswer: 1, // Index 1 corresponds to the second option (B)
  },
  {
    id: 2,
    text: "Reset the simulation, then click to open the container and simulate removing the lid while cooling. Watch the liquid as it cools and observe the weight on the digital balance. What do you notice?",
    options: [
      "The frost melts and the weight increases.",
      "The weight remains the same with or without the lid.",
      "The weight decreases when the lid is off.", // ✅
      "The beaker floats and the liquid changes color.",
    ],
    correctAnswer: 2, // Index 2 corresponds to the third option (C)
  },
  {
    id: 3,
    text: "Use the Cooling Rate slider to lower the temperature and observe the liquid in the beaker. Which of the following best explains why the liquid changes to a solid?",
    options: [
      "Cooling removes heat, causing the particles to slow down and lock into place.", // ✅
      "Cooling adds energy, making the particles move faster.",
      "The liquid evaporates, turning into a gas and then a solid.",
      "The weight increases and forces the liquid to freeze.",
    ],
    correctAnswer: 0, // Index 0 corresponds to the first option (A)
  },
];
export const mixingQuestions = [
  {
    id: 1,
    text: "Close the container using the button, then use the toggle to add a second substance to the beaker. Wait 2 minutes and record your results. What change do you observe as the substances mix?",
    options: [
      "The substances evaporate and disappear completely.",
      "A color change shows that a new substance has formed.", // ✅
      "The liquid in the beaker turns into a gas.",
      "The weight of the liquid drops to zero.",
    ],
    correctAnswer: 1, // Index 1 corresponds to the second option (B)
  },
  {
    id: 2,
    text: "Reset the simulation, then adjust the stirring speed using the slider. What effect does faster stirring have on the mixture?",
    options: [
      "It prevents the substances from combining.",
      "It slows down the mixing process.",
      "It helps the substances mix more quickly and evenly.", // ✅
      "It causes the substances to freeze.",
    ],
    correctAnswer: 2, // Index 2 corresponds to the third option (C)
  },
  {
    id: 3,
    text: "Reset the simulation and seal the container using the button. Begin mixing and observe the graph. What pattern supports the law of conservation of matter?",
    options: [
      "The graph shows a steady loss of weight over time.",
      "The graph shows that weight increases when bubbles appear.",
      "The graph shows that total weight stays the same during the entire reaction.", // ✅
      "The graph shows only temperature changes, not weight.",
    ],
    correctAnswer: 2, // Index 2 corresponds to the third option (C)
  },
];