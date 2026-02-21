import { NextResponse } from 'next/server';

export async function GET() {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;

    // If no token exists yet, we let the client know so it can use the fallback grid
    if (!token) {
        return NextResponse.json({ error: "No Instagram token configured." }, { status: 401 });
    }

    try {
        // Fetch up to 8 recent posts from Instagram Basic Display Graph API
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=8&access_token=${token}`;

        // Cache this fetch for 1 hour to prevent hitting Instagram rate limits
        const res = await fetch(url, { next: { revalidate: 3600 } });
        const data = await res.json();

        if (data.error) {
            return NextResponse.json({ error: data.error.message }, { status: 500 });
        }

        const posts = data.data.map((item: any) => ({
            id: item.id,
            // If the post is a video, Instagram only gives us the `thumbnail_url`.
            // Otherwise, we use the raw `media_url` for images.
            image: item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url,
            link: item.permalink,
            caption: item.caption
        }));

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Instagram fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch Instagram feed." }, { status: 500 });
    }
}
