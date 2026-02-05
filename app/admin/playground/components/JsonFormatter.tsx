import React from 'react';

interface JsonFormatterProps {
  data: any;
  theme?: 'dark' | 'light';
}

export const JsonFormatter = ({ data, theme = 'dark' }: JsonFormatterProps) => {
  const isLight = theme === 'light';
  
  const styles = {
    string: isLight ? 'text-green-700' : 'text-green-400',
    number: isLight ? 'text-orange-600' : 'text-orange-400',
    boolean: isLight ? 'text-purple-700' : 'text-purple-400',
    null: isLight ? 'text-gray-600 font-bold' : 'text-gray-500 font-bold',
    key: isLight ? 'text-blue-700 font-bold' : 'text-sky-300 font-bold',
    bracket: isLight ? 'text-gray-600' : 'text-gray-400',
    comma: isLight ? 'text-gray-500' : 'text-gray-500',
    border: isLight ? 'border-gray-300' : 'border-gray-700',
  };

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return <span className={styles.string}>"{data}"</span>;
    }
  }

  if (data === null) return <span className={styles.null}>null</span>;
  if (typeof data === 'boolean') return <span className={styles.boolean}>{data.toString()}</span>;
  if (typeof data === 'number') return <span className={styles.number}>{data}</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className={styles.bracket}>[]</span>;
    return (
      <span>
        <span className={styles.bracket}>[</span>
        <div className={`pl-4 border-l ${styles.border}`}>
          {data.map((item, i) => (
            <div key={i}>
              <JsonFormatter data={item} theme={theme} />
              {i < data.length - 1 && <span className={styles.comma}>,</span>}
            </div>
          ))}
        </div>
        <span className={styles.bracket}>]</span>
      </span>
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return <span className={styles.bracket}>{'{}'}</span>;
    return (
      <span>
        <span className={styles.bracket}>{'{'}</span>
        <div className={`pl-4 border-l ${styles.border}`}>
          {keys.map((key, i) => (
            <div key={key}>
              <span className={styles.key}>"{key}"</span>: <JsonFormatter data={data[key]} theme={theme} />
              {i < keys.length - 1 && <span className={styles.comma}>,</span>}
            </div>
          ))}
        </div>
        <span className={styles.bracket}>{'}'}</span>
      </span>
    );
  }

  return <span className={styles.string}>"{String(data)}"</span>;
};
