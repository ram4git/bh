import { SyntheticEvent, useState } from 'react';

import { SleepDurationOptions } from '../utils';

interface NetworkResp {
  error?: string;
  errorMsg?: string;
  sleepScore?: string;
}

const timeOptions = SleepDurationOptions();
export default function SleepQualityWidget() {
  const [durationInBed, setDurationInBed] = useState(0);
  const [durationAsleep, setDurationAsleep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sleepScore, setSleepScore] = useState(0);
  const [error, setError] = useState<NetworkResp | null>(null);

  const onChangeOfDurationInBed: React.ChangeEventHandler<HTMLSelectElement> =
    (e: { target: HTMLSelectElement }) =>
      e.target?.value && setDurationInBed(parseInt(e.target?.value, 10));
  const onChangeOfDurationAsleep: React.ChangeEventHandler<HTMLSelectElement> =
    (e: { target: HTMLSelectElement }) =>
      e.target?.value && setDurationAsleep(parseInt(e.target?.value, 10));

  const isSubmitButtonEnabled =
    durationInBed && durationAsleep && !isSubmitting;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setSleepScore(0);

    fetch('/api/score/sleep/', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        score: (100 * durationAsleep) / (durationInBed || Number.MIN_VALUE),
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d);
        } else {
          setSleepScore(d.sleepScore);
        }
      })
      .catch((e: Error) =>
        setError({
          error: 'Error',
          errorMsg: `Unable to save sleep score, ${e.message}`,
        })
      )
      .finally(() => setIsSubmitting(false));
    return false;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-4xl mx-auto w-full ">
        <div className="bh-form-field">
          <label className="bh-label">Duration in bed</label>
          <select
            data-cy="select-duration-in-bed"
            className="bh-select"
            onChange={onChangeOfDurationInBed}
            value={durationInBed}
          >
            {timeOptions.map((o) => (
              <option
                className="text-lg text-blue-800"
                key={`db${o.key}`}
                value={o.value}
              >
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="bh-form-field">
          <label className="bh-label">Duration asleep</label>
          <select
            data-cy="select-duration-asleep"
            className="bh-select"
            onChange={onChangeOfDurationAsleep}
            value={durationAsleep}
          >
            {timeOptions.map((o) => (
              <option
                className="text-lg text-blue-800"
                key={`da${o.key}`}
                value={o.value}
              >
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full justify-center flex">
          <button
            data-cy="submit-btn"
            className="bh-btn"
            disabled={!isSubmitButtonEnabled}
            type="submit"
          >
            {isSubmitting ? 'Loading' : 'Calculate'}
          </button>
        </div>
        {error ? (
          <div className="w-full py-8" data-cy="sleep-score-error">
            <p
              className="text-center font-semibold text-lg text-red-700 px-4"
              data-cy="error-msg"
            >
              {error.errorMsg}
            </p>
          </div>
        ) : null}
        {sleepScore ? (
          <div className="w-full py-8" data-cy="sleep-score">
            <p className="font-extrabold text-7xl text-center ">
              <span
                data-cy="sleep-score-val"
                className="bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent"
              >
                {sleepScore}
              </span>
            </p>
            <p className="text-center font-semibold text-lg text-gray-700">
              Your Sleep Score
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
