import classNames from "classnames";
import dayjs from "dayjs";
import Image from "next/image";

type MetricType = {
  name: string;
  values: Array<[number, string]>;
};
type ResultType = {
  metric: {
    name: string;
  };
  values: Array<[number, string]>;
};
type JsonType = {
  resultType: string;
  result: Array<ResultType>;
};
const fetcher = async (): Promise<Array<MetricType>> => {
  const url = new URL(`${process.env.PROM_URL}/api/v1/query_range`);
  const start = Date.now() / 1000 - 60 * 60 * 24;
  const end = Date.now() / 1000;
  const step = 60 * 60;
  url.searchParams.set("query", "avg_over_time(up{monitor='true'}[1h]) * 100");
  url.searchParams.set("start", start.toString());
  url.searchParams.set("end", end.toString());
  url.searchParams.set("step", step.toString());
  console.log(url.toString());
  const res = await fetch(url.toString(),{ cache: 'no-store' });
  const { data }: { data: JsonType } = await res.json();
  return data.result.map((ins) => {
    return {
      name: ins.metric.name,
      values: ins.values.map(([time, score]: [number, string]) => [
        time * 1000,
        score,
      ]),
    };
  });
};

function calculateAvailability(values: Array<[number, string]>) {
  const totalAvailability = values.reduce((acc, [_, percentageStr]) => {
    return acc + parseFloat(percentageStr);
  }, 0);
  const averageAvailability = totalAvailability / values.length;

  return parseFloat(averageAvailability.toFixed(2));
}

export default async function Home() {
  const data = await fetcher();
  return (
    <div className="min-h-screen max-w-3xl mx-auto">
      <header className="flex justify-between items-center w-full bg-gradient-to-b backdrop-blur-2xl h-20">
        <div>
          <div className="text-2xl">Monitor Service</div>
          <div className="text-sm mr-auto text-slate-500">
            Hourly Average Over the Last 24 Hours
          </div>
        </div>
        <Image src="/logo.svg" alt="Logo" width={32} height={32} priority />
      </header>
      <main className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex-col lg:flex">
        {data.map(({ name, values }) => (
          <div
            className="flex flex-col w-full items-center flex-wrap lg:flex-nowrap justify-between hover:bg-muted py-3 px-3 gap-y-1 hover:border-gray-300 hover:bg-gray-100"
            key={name}
          >
            <div className="flex gap-x-1 w-full">
              <span className="font-mono w-20 p-y-2 px-3 bg-teal-300 text-center rounded-2xl">
                {calculateAvailability(values)}%
              </span>
              <span>{name}</span>
            </div>
            <ul className="flex gap-x-1 w-full">
              {values.map(([time, score]) => (
                <li
                  key={time}
                  title={dayjs(time).format("YYYY-MM-DD HH:mm:ss")}
                  className={classNames(
                    "w-2 h-4 rounded hover:scale-150 ease-in-out",
                    Number.parseFloat(score) < 100
                      ? "bg-pink-500"
                      : "bg-teal-700",
                  )}
                />
              ))}
            </ul>
          </div>
        ))}
      </main>
      <footer className="text-center py-10">
        <p>By wawama</p>
        <p className="text-sm text-gray-700">
          {dayjs().format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </footer>
    </div>
  );
}
