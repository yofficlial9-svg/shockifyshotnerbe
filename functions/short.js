export async function onRequestPost(context) {
    try {
        const { url } = await context.request.json();

        if (!url) {
            return Response.json({
                error: "No URL provided."
            }, { status: 400 });
        }

        try {
            new URL(url);
        } catch {
            return Response.json({
                error: "Invalid URL."
            }, { status: 400 });
        }

        const res = await fetch(
            `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
        );

        const text = await res.text();

        if (!res.ok || text.startsWith("Error")) {
            return Response.json({
                error: text
            }, { status: 500 });
        }

        return Response.json({
            shorturl: text
        });

    } catch (err) {

        return Response.json({
            error: err.message
        }, { status: 500 });

    }
}