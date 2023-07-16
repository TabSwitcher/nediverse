import axios from "axios";

export async function GET(req: Request){
    const url = new URL(req.url);
    const href = url.searchParams.get('url');

    if (!href) {
        return new Response('Invalid href', {status: 400});
    }

    //simply getting a link and making a request to that link
    const res = await axios.get(href);

    //match whatever is in the title tag and return it to the frontend
    const titleMatch = res.data.match(/<title>(.*?)<\/title>/)

    //if we have a title match, [1] represents whatever it is in between the title elements
    const title = titleMatch ? titleMatch[1] : '';

    const descriptionMatch = res.data.match(/<meta name="description" content="(.*?)">/)
    const description = descriptionMatch ? descriptionMatch[1] : '';

    const imageMatch = res.data.match(/<meta property="og:image" content="(.*?)">/)
    const imageUrl = imageMatch ? imageMatch[1] : '';

    //editorJS expects this format for the response
    return new Response(
        JSON.stringify({
            success: 1,
            meta: {
                title,
                description,
                image: {
                    url: imageUrl,
                }
            }
        })
    )
}