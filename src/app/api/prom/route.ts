import { NextResponse } from "next/server";

type ResultType = {
  metric: {
    name: string;
  };
  values: Array<[number, string]>;
};
type JsonType = {
    resultType: string;
    result: Array<ResultType>
}

export async function GET() {
    const url = new URL(`${process.env.PROM_URL}/api/v1/query_range`);
    const start = Date.now() / 1000 - 60 * 60 * 24
    const end = Date.now() / 1000
    const step = 60 * 60
    url.searchParams.set("query", "avg_over_time(up{monitor='true'}[1h]) * 100\n")
    url.searchParams.set("start", start.toString())
    url.searchParams.set("end", end.toString())
    url.searchParams.set("step", step.toString())
    const res = await fetch(url.toString());
    const {data}: { data: JsonType } = await res.json();
    const result = data.result.map(ins => {
        return {
            name: ins.metric.name,
            values: ins.values.map(([time, score]: [number, string]) => ([time * 1000, score]))
        }
    })
    return NextResponse.json(result);
}
