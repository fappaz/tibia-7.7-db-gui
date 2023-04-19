import { getRankingSurroundings } from "../../utils/ranking";

describe('getRankingSurroundings', () => {

  const assertions = [
    {
      description: `should return surrounding players, with 1 gap after the first and 1 gap before the last`,
      allPlayers: [
        { points: 88 },
        { points: 70 },
        { points: 35 },
        { points: 34 },
        { points: 33 },
        { points: 33 },
        { points: 1 },
      ],
      indexOfInterest: 3, // player with 34 points
      expectedPointsRanking: [
        { position: 0, positionRelativeToItem: -3, data: { points: 88 }},
        {},
        { position: 2, positionRelativeToItem: -1, data: { points: 35 }},
        { position: 3, positionRelativeToItem: 0, data: { points: 34 } },
        { position: 4, positionRelativeToItem: 1, data: { points: 33 }},
        {},
        { position: 6, positionRelativeToItem: 3, data: { points: 1 }},
      ],
      debug: true,
    },

    {
      description: `should return surrounding players, with 1 gap after the first and no gap before the last`,
      allPlayers: [
        { points: 88 },
        { points: 70 },
        { points: 35 },
        { points: 34 },
        { points: 33 },
        { points: 1 },
      ],
      indexOfInterest: 3, // player with 34 points
      expectedPointsRanking: [
        { position: 0, positionRelativeToItem: -3, data: { points: 88 }},
        {},
        { position: 2, positionRelativeToItem: -1, data: { points: 35 }},
        { position: 3, positionRelativeToItem: 0, data: { points: 34 } },
        { position: 4, positionRelativeToItem: 1, data: { points: 33 }},
        { position: 5, positionRelativeToItem: 2, data: { points: 1 }},
      ],
    },

    {
      description: `should return surrounding players, with no gap after the first and 1 gap before the last`,
      allPlayers: [
        { points: 88 },
        { points: 35 },
        { points: 34 },
        { points: 33 },
        { points: 33 },
        { points: 1 },
      ],
      indexOfInterest: 2, // player with 34 points
      expectedPointsRanking: [
        { position: 0, positionRelativeToItem: -2, data: { points: 88 }},
        { position: 1, positionRelativeToItem: -1, data: { points: 35 }},
        { position: 2, positionRelativeToItem: 0, data: { points: 34 } },
        { position: 3, positionRelativeToItem: 1, data: { points: 33 }},
        {},
        { position: 5, positionRelativeToItem: 3, data: { points: 1 }},
      ],
    },

    {
      description: `should return surrounding players, with no gap after the first and no gap before the last`,
      allPlayers: [
        { points: 88 },
        { points: 35 },
        { points: 34 },
        { points: 33 },
        { points: 1 },
      ],
      indexOfInterest: 2, // player with 34 points
      expectedPointsRanking: [
        { position: 0, positionRelativeToItem: -2, data: { points: 88 }},
        { position: 1, positionRelativeToItem: -1, data: { points: 35 }},
        { position: 2, positionRelativeToItem: 0, data: { points: 34 } },
        { position: 3, positionRelativeToItem: 1, data: { points: 33 }},
        { position: 4, positionRelativeToItem: 2, data: { points: 1 }},
      ],
    },

    {
      description: `should return surrounding players with no gap after the first one and one item after the current`,
      allPlayers: [
        { points: 88 },
        { points: 35 },
        { points: 34 },
        { points: 33 },
      ],
      indexOfInterest: 2, // player with 34 points
      expectedPointsRanking: [
        { position: 0, positionRelativeToItem: -2, data: { points: 88 }},
        { position: 1, positionRelativeToItem: -1, data: { points: 35 }},
        { position: 2, positionRelativeToItem: 0, data: { points: 34 } },
        { position: 3, positionRelativeToItem: 1, data: { points: 33 }},
      ],
    },

    {
      description: `should return surrounding players with no gap after the first one and nothing after the current`,
      allPlayers: [
        { points: 88 },
        { points: 35 },
        { points: 34 },
      ],
      indexOfInterest: 2, // player with 34 points
      expectedPointsRanking: [
        { position: 0, positionRelativeToItem: -2, data: { points: 88 }},
        { position: 1, positionRelativeToItem: -1, data: { points: 35 }},
        { position: 2, positionRelativeToItem: 0, data: { points: 34 } },
      ],
    },

    {
      description: `should return surrounding players with one item before and after the current`,
      allPlayers: [
        { points: 88 },
        { points: 34 },
        { points: 33 },
      ],
      indexOfInterest: 1, // player with 34 points
      expectedPointsRanking: [
        { position: 0, positionRelativeToItem: -1, data: { points: 88 }},
        { position: 1, positionRelativeToItem: 0, data: { points: 34 } },
        { position: 2, positionRelativeToItem: 1, data: { points: 33 }},
      ],
    },
  ];
  
  assertions.forEach(({ description, allPlayers, expectedPointsRanking, indexOfInterest, debug }) => {
    it(description, () => {
      if (debug) {
        console.log(`Debugging ${description}`);
      }

      const rankingSurroundings = getRankingSurroundings(allPlayers, indexOfInterest, { addGap: true });
      expect(rankingSurroundings).toStrictEqual(expectedPointsRanking);
    });
  });

});

