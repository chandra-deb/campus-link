import { NextResponse } from 'next/server';
import {auth} from "@clerk/nextjs/server"
import prisma from '@/lib/prisma';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const {userId} = await auth();
        console.log(userId);
    
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userCategories = await prisma.userCategory.findMany({
            where: {
                userId: parseInt('1')
            },
            include: {
                category: true
            }
        });
    
        return NextResponse.json(userCategories) || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
        
    }
}

// export async function POST(req: Request) {
//     try {
//         const session = await getServerSession(authOptions);
//         if (!session?.user?.email) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         const { categoryName } = await req.json();
//         if (!categoryName) {
//             return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
//         }

//         // Find or create the category
//         const category = await prisma.category.upsert({
//             where: { name: categoryName },
//             update: {},
//             create: { name: categoryName }
//         });

//         // Add the category to user's categories if not already added
//         const userCategory = await prisma.userCategory.upsert({
//             where: {
//                 userId_categoryId: {
//                     userId: session.user.id,
//                     categoryId: category.id
//                 }
//             },
//             update: {},
//             create: {
//                 userId: session.user.id,
//                 categoryId: category.id
//             }
//         });

//         return NextResponse.json({ category, userCategory }, { status: 200 });
//     } catch (error) {
//         console.error('Error handling category:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }