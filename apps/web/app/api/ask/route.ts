export async function POST(req: Request) {
  const { prompt } = await req.json()

  const res = await fetch("http://localhost:8000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: prompt }),
  })

  const data = await res.json()
  return Response.json(data)
}
