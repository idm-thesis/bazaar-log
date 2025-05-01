"use client";
import WinBox from "@/components/windows/WinBox";
import { useFutureForumStore } from "@/store/useFutureForumStore";

export default function FutureProposalFormWindow({ era }: { era: string }) {
  const { addLanPost } = useFutureForumStore();
  const addToLAN = (name: string, title: string, future: string) => {
    addLanPost({
      id: Date.now(),
      title: title,
      author: name,
      content: future,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <WinBox
      id="lan"
      title="Your Proposal"
      width="600px"
      height="400px"
      era={era}
    >
      <div className="window-body">
        <h2>Submit Your Proposal</h2>
        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const author =
              (e.currentTarget.elements.namedItem("author") as HTMLInputElement)
                ?.value || "Anonymous";
            const title =
              (e.currentTarget.elements.namedItem("title") as HTMLInputElement)
                ?.value || "";
            const future =
              (e.currentTarget.elements.namedItem("future") as HTMLInputElement)
                ?.value || "";
            addToLAN(author, title, future);
          }}
        >
          <div className="flex flex-col items-start">
            <label htmlFor="author" className="font-semibold">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              className="w-full p-2 border rounded"
              placeholder="How the community should address you"
            />
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="title" className="font-semibold">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full p-2 border rounded"
              placeholder="Your post title"
              required
            />
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="future" className="font-semibold">
              Post Content
            </label>
            <textarea
              id="future"
              name="future"
              rows={4}
              className="w-full p-2 border rounded"
              placeholder="Your proposed future..."
              required
            />
          </div>
          <input
            type="submit"
            value="Submit"
            className="self-center px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          />
        </form>
      </div>
    </WinBox>
  );
}
