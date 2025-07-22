import { v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { mutation, MutationCtx, query } from "./_generated/server";
import { getAuthenticatedUser } from './users';

export const generateuploadUrl = mutation(async(ctx)=>{
    const identity = await ctx.auth.getUserIdentity();
    if(!identity) throw new Error("unauthorized user")

        return await ctx.storage.generateUploadUrl();
})



export const createPost = mutation({
    args:{
        caption:v.optional(v.string()),
        storageId:v.id("_storage"),


    },

    handler:async(ctx,args)=>{
        const currentUser = await getAuthenticatedUser(ctx);

            const imageUrl= await ctx.storage.getUrl(args.storageId)
            if(!imageUrl) throw new Error("image not found");

            //create post

          const postId=  await ctx.db.insert("posts",{
                userId:currentUser._id,
                imageUrl,
                storageId:args.storageId,
                caption:args.caption,
                likes:0,
                comments:0


            })
            await ctx.db.patch(currentUser._id,{
                posts:currentUser.posts +1
            })

            return postId


    }
})

export const getFeedPosts = query({
    handler:async(ctx)=>{
        const currentUser = await getAuthenticatedUser(ctx);

        //get all posts 
        const posts = ctx.db.query("posts").order("desc").collect()

        if((await posts).length===0) return []

        const postsWithInfo = await Promise.all(
            (await posts).map(async(post)=>{
                const PostAuthor = (await ctx.db.get(post.userId))!;

                const like=await ctx.db.query("likes").withIndex("by_user_and_post",(q)=>q.eq("userId",currentUser._id).eq("postsId",post._id)).first();

                const bookmark = await ctx.db
                .query("bookmarks")
                .withIndex("by_user_and_by_post", (q) =>
                  q.eq("userId", currentUser._id).eq("postsId", post._id)
                )
                .first();
                return {
                    ...post,
                    author: {
                      _id: PostAuthor._id,
                      username: PostAuthor.username,
                      image: PostAuthor.image,
                    },
                    isLiked: !!like, // corrected
                    isBookmarked: !!bookmark, // corrected
                  };
                  

            })

        )

      

        return postsWithInfo


    }
})

export const toggleLike= mutation({
    args:{postId :v.id("posts")},
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
    
        // Check if the user has already liked the post
        const existing = await ctx.db
            .query("likes")
            .withIndex("by_user_and_post", (q) =>
                q.eq("userId", currentUser._id).eq("postsId", args.postId)
            )
            .first();
    
        // Get the post
        const post = await ctx.db.get(args.postId);
        if (!post) throw new Error('Post not found');
    
        if (existing) {
            // User has already liked the post — remove the like
            await ctx.db.delete(existing._id);
            await ctx.db.patch(args.postId, { likes: post.likes - 1 });
            return false; // unliked
        } else {
            // User hasn't liked the post yet — add a like
            await ctx.db.insert("likes", {
                userId: currentUser._id,
                postsId: args.postId
            });
            await ctx.db.patch(args.postId, { likes: (post.likes || 0) + 1 });
            // if its not my post create notification
            if (currentUser._id !== post.userId) {
                await ctx.db.insert("notifications", {
                    receiverId: post.userId,
                    senderId: currentUser._id,
                    type: 'like',
                    postsId: args.postId
                });
            }
            // ✅ Always return true when liking
            return true;
            
        }
    }
    


})
export const deletePost = mutation({
    args:{postId:v.id("posts")},
    handler:async(ctx,args)=>{
        const currentUser = await getAuthenticatedUser(ctx);
        const post = await ctx.db.get(args.postId);
        if(!post) throw new Error("Post not found");
        
        //verify ownership
       
            //delete associated likes
            const likes = await ctx.db.query('likes').withIndex("by_post",(q)=>q.eq("postsId",args.postId)).collect();
        for(const like of likes){
            await ctx.db.delete(like._id)
        }
        //delete associated comments
        const comments =await ctx.db.query("comments").withIndex("by_post",(q)=>q.eq("postsId",args.postId)).collect();

        for(const comment of comments){

            await ctx.db.delete(comment._id);


        }
        //delete associated bookmarks
        const bookmarks =await ctx.db.query("bookmarks").withIndex("by_post",(q)=>q.eq("postsId",args.postId)).collect();

        for(const bookmark of bookmarks){

            await ctx.db.delete(bookmark._id);


        }
        // delete notifications 

        //delete storage file
        await ctx.storage.delete(post.storageId)
        //delete post 
        await ctx.db.delete(args.postId);
        await ctx.db.patch(currentUser._id,{
            posts:Math.max(0,(currentUser.posts||1)-1)
        })

    }
})
export const getPostsByUser = query({
    args: {
      userId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
      const user = args.userId ? await ctx.db.get(args.userId) : await getAuthenticatedUser(ctx);
  
      if (!user) throw new Error("User not found");
  
      const posts = await ctx.db
        .query("posts")
        .withIndex("by_user", (q) => q.eq("userId", args.userId || user._id))
        .collect();
  
      return posts;
    },
  });
  export const getUserProfile = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
      const user = await ctx.db.get(args.id);
      if (!user) throw new Error("User not found");
  
      return user;
    },
  });
  export const isFollowing = query({
    args: { followingId: v.id("users") },
    handler: async (ctx, args) => {
      const currentUser = await getAuthenticatedUser(ctx);
  
      const follow = await ctx.db
        .query("follows")
        .withIndex("by_both", (q) =>
          q.eq("followerId", currentUser._id).eq("followingId", args.followingId)
        )
        .first();
  
      return !!follow;
    },
  });

export const toggleFollow = mutation({
    args: { followingId: v.id("users") },
    handler: async (ctx, args) => {
      const currentUser = await getAuthenticatedUser(ctx);
  
      const existing = await ctx.db
        .query("follows")
        .withIndex("by_both", (q) =>
          q.eq("followerId", currentUser._id).eq("followingId", args.followingId)
        )
        .first();
  
      if (existing) {
        // unfollow
        await ctx.db.delete(existing._id);
        await updateFollowCounts(ctx, currentUser._id, args.followingId, false);
      } else {
        // follow
        await ctx.db.insert("follows", {
          followerId: currentUser._id,
          followingId: args.followingId,
        });
        await updateFollowCounts(ctx, currentUser._id, args.followingId, true);
  
        // create a notification
        await ctx.db.insert("notifications", {
          receiverId: args.followingId,
          senderId: currentUser._id,
          type: "follow",
        });
      }
    },
  });
  
  async function updateFollowCounts(
    ctx: MutationCtx,
    followerId: Id<"users">,
    followingId: Id<"users">,
    isFollow: boolean
  ) {
    const follower = await ctx.db.get(followerId);
    const following = await ctx.db.get(followingId);
  
    if (follower && following) {
      await ctx.db.patch(followerId, {
        following: follower.following + (isFollow ? 1 : -1),
      });
      await ctx.db.patch(followingId, {
        followers: following.followers + (isFollow ? 1 : -1),
      });
    }
  }