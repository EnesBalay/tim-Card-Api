const TimCardRecord = require("../models/TimCardRecord");

async function createTimCardDoorLog(cardId, door, state, card = null) {
  await TimCardRecord.create({
    card: card,
    cardId: cardId,
    door: door,
    state: state,
  });
}
module.exports = {
  createTimCardDoorLog,
};
