function isNewerOrEqualDate(newerDate, olderDate) {
  if (
    new Date(newerDate).toDateString() === new Date(olderDate).toDateString()
  ) {
    return true;
  } else if (new Date(newerDate) >= new Date(olderDate)) {
    return true;
  }
}

module.exports = {
  isNewerOrEqualDate,
};
