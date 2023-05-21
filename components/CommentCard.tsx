import React, { FormEvent, useEffect, useState } from "react";
import Avatar from "./Avatar";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import { PostType } from "./Post";
import { photoUrl } from "@/helpers/photoHelpers";

const CommentCard = ({
  currentUser,
  post,
}: {
  currentUser: any;
  post: PostType;
}) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<any>([]);
  const [newCommentPicture, setNewCommentPicture] = useState<any>(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    fetchComments();
  }, []);

  const addComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newComment.length < 1) return;
    supabase
      .from("comments")
      .insert({
        content: newComment,
        author: currentUser.id,
        post_id: post.id,
        picture: newCommentPicture,
      })
      .then((res) => {
        setNewComment("");
        console.log(res);
        setNewCommentPicture(null);
        fetchComments();
      });
  };

  const handleAddPicture = (event: FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (file && currentUser) {
      // setIsUploading(true);
      const name = Date.now() + file.name;
      supabase.storage
        .from("comment_pictures")
        .upload(name, file)
        .then(({ data }) => {
          console.log(data);
          if (data?.path) setNewCommentPicture(data.path);
        });
    }
  };

  const fetchComments = () => {
    supabase
      .from("comments")
      .select("*, users(*)")
      .eq("post_id", post.id)
      .then((result) => {
        setComments(result.data);
      });
  };

  return (
    <>
      <div className="flex mt-4 gap-3 ">
        <div>
          <Avatar url={currentUser?.avatar} size="xs" />
        </div>
        <div className="border grow rounded-xl relative bg-neutral outline-none rounded-xl focus:shadow-md mb-4">
          <form onSubmit={addComment}>
            <input
              value={newComment}
              id="commentInput"
              onChange={(event) => setNewComment(event.target.value)}
              className="block w-4/5 p-3 px-4 overflow-hidden h-12 bg-neutral outline-none "
              placeholder="Laisser un commentaire..."
            />
            <label
              htmlFor="commentPic"
              className="absolute bottom-0 right-0 hover:shadow-sm hover:bg-white hover:bg-opacity-70 hover:text-complementaryLight transition  h-full w-12 flex items-center justify-center p-2 rounded-xl text-gray-400 cursor-pointer"
            >
              <input
                type="file"
                className="hidden"
                name="commentPic"
                id="commentPic"
                onChange={handleAddPicture}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </label>
          </form>
          {newCommentPicture && (
            <div className="flex align-center mx-3 my-2 hover:bg-gray-800 w-16 h-16 rounded-md hover:bg-opacity-10">
              <img
                src={photoUrl(newCommentPicture, "comment_pictures")}
                alt="comment_pictures"
                className="cover"
              />
            </div>
          )}
        </div>
      </div>
      <hr />
      <div>
        {comments.length > 0 &&
          comments.map((comment: any) => (
            <div key={comment.id} className="mt-2 flex gap-2 items-center">
              <div className="self-start mr-2">
                <Avatar url={comment.users.avatar} size="sm" />
              </div>
              <div className="bg-neutral py-2 px-4 rounded-2xl">
                <div>
                  <Link href={"/profile/" + comment.users.id}>
                    <span className="hover:underline font-semibold mr-1">
                      {comment.users.name}
                    </span>
                  </Link>
                  <span className="text-sm text-gray-400">
                    <ReactTimeAgo
                      timeStyle={"twitter"}
                      date={new Date(comment.created_at).getTime()}
                    />
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
                {comment.picture && (
                  <div className="flex align-center mx-auto my-2 hover:bg-gray-800 w-30 max-w-xs rounded-md hover:bg-opacity-10">
                    <img
                      src={photoUrl(comment.picture.trim(), "comment_pictures")}
                      alt="comment_pictures"
                      className="contain "
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default CommentCard;
