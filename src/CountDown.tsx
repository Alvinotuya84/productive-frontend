import React, { useState, useEffect } from 'react';

interface Props{
    initialCount: number;
}

export function CountDown({initialCount}:Props) {
  const [count, setCount] = useState(initialCount);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count - 1);
    }, 1000);
    if (count === 0) {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [count]);

  return <div>{count}</div>;
}
