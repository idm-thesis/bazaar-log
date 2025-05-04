"use client";
import WinBox from "@/components/windows/WinBox";
import { useFutureForumStore } from "@/store/useFutureForumStore";
import { useEffect } from "react";
import {supabase} from "@/lib/supabaseClient";

export default function FutureLANWindow({ era }: { era: string }) {
  const { posts, setPosts } = useFutureForumStore();

  useEffect(() => {
    const fetchPosts = async() => {
      const {data, error} = await supabase.from("formSubmission").select("*").order("timestamp", {ascending: false});

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, [setPosts]);

  return (
    <WinBox
      id="lan"
      title="See All Proposals"
      width="600px"
      height="400px"
      era={era}
    >
      <div className="window-body">
        <h2>Local Area Network</h2>
        {posts.length > 0 ? posts.map((item, index) => (
          <div key={index}>
            <div key={item.id}>
              <div className="inline">
                <p>Author: {item.author}</p>
                <p>{item.timestamp}</p>
              </div>
              <div className="col-span-2"></div>
              <h4 className="col-span-4">Title: {item.title}</h4>
              <p className="col-span-4">Comment: {item.content}</p>
            </div>
          </div>
        )) : <div>
          <p>No discussions yet. Share your view!</p>
          </div>}
      </div>
    </WinBox>
  );
}
