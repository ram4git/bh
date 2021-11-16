export const SleepDurationOptions = () => {
  const options = [];
  for (let i: number = 0; i < 24; i++) {
    options.push({ key: `${i}h0m`, value: i * 60, label: `${i} hours` });
    options.push({
      key: `${i}h30m`,
      value: i * 60 + 30,
      label: `${i} hours 30 mins`,
    });
  }
  return options;
};
