exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { url } = JSON.parse(event.body);

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No URL provided." }),
      };
    }

    const api = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(
      url
    )}`;

    const response = await fetch(api);
    const shortUrl = await response.text();

    if (!response.ok || shortUrl.startsWith("Error")) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: shortUrl,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        shorturl: shortUrl,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};