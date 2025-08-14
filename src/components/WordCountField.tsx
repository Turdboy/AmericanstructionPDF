import React from 'react';

interface WordCountFieldProps {
  value: string;
  maxWords?: number;
}

const countWords = (text: string) =>
  text?.trim().split(/\s+/).filter(Boolean).length || 0;

const WordCountField: React.FC<WordCountFieldProps> = ({ value, maxWords }) => {
  const currentWords = countWords(value);
  const isOver = maxWords && currentWords > maxWords;

  return (
    <p className={`text-xs text-right ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
      {currentWords} word{currentWords !== 1 ? 's' : ''}
      {maxWords && ` / ${maxWords}`}
    </p>
  );
};

export default WordCountField;
