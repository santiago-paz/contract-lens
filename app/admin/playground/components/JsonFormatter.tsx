import React from 'react';

export const JsonFormatter = ({ data }: { data: any }) => {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return <span className="text-green-400">"{data}"</span>;
    }
  }

  if (data === null) return <span className="text-gray-500 font-bold">null</span>;
  if (typeof data === 'boolean') return <span className="text-purple-400 font-bold">{data.toString()}</span>;
  if (typeof data === 'number') return <span className="text-orange-400 font-bold">{data}</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-gray-400">[]</span>;
    return (
      <span>
        <span className="text-gray-400">[</span>
        <div className="pl-4 border-l border-gray-700">
          {data.map((item, i) => (
            <div key={i}>
              <JsonFormatter data={item} />
              {i < data.length - 1 && <span className="text-gray-500">,</span>}
            </div>
          ))}
        </div>
        <span className="text-gray-400">]</span>
      </span>
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return <span className="text-gray-400">{'{}'}</span>;
    return (
      <span>
        <span className="text-gray-400">{'{'}</span>
        <div className="pl-4 border-l border-gray-700">
          {keys.map((key, i) => (
            <div key={key}>
              <span className="text-sky-300 font-bold">"{key}"</span>: <JsonFormatter data={data[key]} />
              {i < keys.length - 1 && <span className="text-gray-500">,</span>}
            </div>
          ))}
        </div>
        <span className="text-gray-400">{'}'}</span>
      </span>
    );
  }

  return <span className="text-green-400">"{String(data)}"</span>;
};
