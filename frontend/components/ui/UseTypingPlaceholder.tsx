import { useEffect, useState } from "react";

export function useTypingPlaceholder(phrases: string[], speed = 60, pause = 1200) {
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [forward, setForward] = useState(true);

  useEffect(() => {
    if (!phrases.length) return;

    if (forward && subIndex < phrases[index].length) {
      setTimeout(() => setSubIndex(subIndex + 1), speed);
    } else if (!forward && subIndex > 0) {
      setTimeout(() => setSubIndex(subIndex - 1), 30);
    } else if (forward && subIndex === phrases[index].length) {
      setForward(false);
      setTimeout(() => {}, pause);
    } else if (!forward && subIndex === 0) {
      setForward(true);
      setIndex((index + 1) % phrases.length);
    }
    setPlaceholder(phrases[index].substring(0, subIndex));
  }, [subIndex, index, phrases, forward, speed, pause]);
  useEffect(() => setPlaceholder(phrases[index].substring(0, subIndex)), [index, subIndex, phrases]);
  return placeholder;
}
