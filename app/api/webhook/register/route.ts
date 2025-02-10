import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { env } from 'process';
import { UserType } from '@prisma/client';
// import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const webhookSecret = process.env.WEBHOOK_SECRET || '';
    if (!webhookSecret){
        throw new Error("Please add webhook secret in env");
    }
    const headerPayload = headers();
    const svixHeaders = {
     'svix-id' : (await headerPayload).get('svix-id') || '',
     'svix-timestamp' : (await headerPayload).get('svix-timestamp') || '',
     'svix-signature' : (await headerPayload).get('svix-signature') || '',
    }
    if(!svixHeaders['svix-id'] || !svixHeaders['svix-timestamp'] || !svixHeaders['svix-signature']){
        return new Response('Error occurd- Missing Svix headers.');
    }
   
    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);

    let evt:WebhookEvent;

    try {
        evt = wh.verify(body, svixHeaders) as WebhookEvent;

    } catch (error) {
        console.error("Error verifying webhook.")
        return new Response("Error Occured while verifying", {status:400});
        
    }

    const evtType = evt.type;
    const data = evt.data;

    if (evtType == "user.created"){
      
            const {email_addresses } = data;
            const userid:string = email_addresses[0].id;
            const email:string = email_addresses[0].email_address;
            console.log(userid);
            console.log(email);
      
        const newUser= await prisma.user.create({
            data:{
                email:email,
                userType: UserType.STUDENT
            }
        })
        console.log("new user: ", newUser);




    }
    return new Response("WebHook received successfully", {status:200});

}

