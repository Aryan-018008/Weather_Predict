export async function handler(event, context) {
  const city = event.queryStringParameters.city || "Bhubaneswar";
  const API_KEY = process.env.WEATHER_API_KEY;

  const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}