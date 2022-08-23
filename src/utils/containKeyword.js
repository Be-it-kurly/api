const containKeyword = (target, keyword) => {
  let isContains = false;

  target.split(',').forEach((v) => {
    if (keyword.split(',').includes(v)) {
      isContains = true;
    }
  });

  return isContains;
};

module.exports = containKeyword;
