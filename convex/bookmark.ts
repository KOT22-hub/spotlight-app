import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const toggleBookmark = mutation({
    args:{postId:v.id("posts")},
    handler : async(ctx,args)=>{
        const currentUser = await getAuthenticatedUser(ctx);
        const exisiting = await ctx.db.query("bookmarks").withIndex("by_user_and_by_post",(q)=> q.eq("userId",currentUser._id).eq("postsId",args.postId)).first();
        if(exisiting){
            await ctx.db.delete(exisiting._id)
            return false

        }else{
            await ctx.db.insert("bookmarks",{
                userId:currentUser._id,
                postsId:args.postId
            })
            return true
        }

    }
})

export const getBookmarkedPosts = query({
    handler:async(ctx)=>{
        const currentUser = await getAuthenticatedUser(ctx);
        const bookmarks = await ctx.db.query("bookmarks").withIndex("by_user",(q)=>q.eq("userId",currentUser._id)).order("desc").collect();
        const bookmarksWithInfo = await Promise.all(
            bookmarks.map(async(bookmark)=>{
                const post = await ctx.db.get(bookmark.postsId)
                return post
            })

        )
        return bookmarksWithInfo
    }
})