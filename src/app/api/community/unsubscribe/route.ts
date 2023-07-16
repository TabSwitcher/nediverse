import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommunitySubscriptionValidator } from "@/lib/validators/community";
import { z } from "zod";

export async function POST(req: Request){
    try{
        const session = await getAuthSession();

        if (!session?.user){
            return new Response('Unauthorizd', {status: 401})
        }

        const body = await req.json();

        const {communityId} = CommunitySubscriptionValidator.parse(body); 

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                communityId,
                userId: session.user.id,
            }
        });

        if (!subscriptionExists){
            return new Response('You are not subscribed to this community', {status: 400})
        }

        //check if user is the create of the community
        const community = await db.community.findFirst({
            where: {
                id: communityId,
                creatorId: session.user.id,
            }
        })

        if(community){
            return new Response('You cannot unsubscribe from a community you created', {status: 400})
        }

        await db.subscription.delete({
            where: {
                userId_communityId: {
                    communityId,
                    userId: session.user.id,
                }
            }
        })

        return new Response(communityId);

    } catch(error){
        if(error instanceof z.ZodError){
            return new Response('Invalid request data passed', {status: 422})
        }

        return new Response('Could not subscribe, please try again later', {status: 500})
    }
} 