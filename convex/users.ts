import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';

export const createUser = mutation({
    args:{
        username:v.string(),
        fullname:v.string(),
        email:v.string(),
        bio:v.optional(v.string()),
        image:v.string(),
        clerkId:v.string()
    },
    handler:async(ctx,args)=>{

       const exisitinguser= await ctx.db.query("users").withIndex("by_clerk_id",(q)=> q.eq("clerkId",args.clerkId)).first()

       
       if(exisitinguser) return;
        await ctx.db.insert("users",{
            username:args.username,
            fullname:args.fullname,
            email:args.email,
            bio:args.bio,
            image:args.image,
            clerkId:args.clerkId,
            followers:0,
            following:0,
            posts:0



        })
    }
    
})

export const getUsersbyClerkId=query({
    args:{
       clerkId: v.string()
    },
    handler: async(ctx,args)=>{
        const user = await ctx.db.query("users").withIndex("by_clerk_id",(q)=>q.eq("clerkId",args.clerkId)).unique();
        return user

    }
})
export async function getAuthenticatedUser(ctx:QueryCtx| MutationCtx){
    const identity = await ctx.auth.getUserIdentity();
        if(!identity) throw new Error("unauthorized user")

            const currentUser = await ctx.db.query("users").withIndex("by_clerk_id",(q)=>q.eq('clerkId',identity.subject)).first();
            if(!currentUser) throw new Error("user not found");
            return currentUser;
}
export const updateProfile = mutation({
    args: {
      fullname: v.string(),
      bio: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      const currentUser = await getAuthenticatedUser(ctx);
  
      await ctx.db.patch(currentUser._id, {
        fullname: args.fullname,
        bio: args.bio,
      });
    },
  });