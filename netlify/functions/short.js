exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                error: "Method not allowed"
            })
        };
    }

    try {

        const { url } = JSON.parse(event.body);

        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "No URL provided."
                })
            };
        }

        // Basic URL validation
        try {
            new URL(url);
        } catch {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Invalid URL."
                })
            };
        }

        const response = await fetch(
            `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
        );

        const text = await response.text();

        if (!response.ok || text.startsWith("Error")) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: text
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                shorturl: text
            })
        };

    } catch (err) {

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: err.message
            })
        };

    }

};