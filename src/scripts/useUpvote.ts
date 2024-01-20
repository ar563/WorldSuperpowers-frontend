import { useEffect, useState } from "react";
import useAxios from "axios-hooks";

import { api, fetchData } from ".";

interface UpvoteResponse {
  message: string;
  upvotes?: number;
  upvoteid?: string;
}

export const useUpvote = ({
  id,
  initialCount,
  isVoted,
  upvoteId,
}: {
  id: string;
  initialCount: number;
  isVoted: boolean;
  upvoteId: string;
}) => {
  const [upvoteState, setUpvoteState] = useState<{
    count: number;
    hasVoted: boolean;
    upvoteid: string;
  }>({
    count: initialCount,
    hasVoted: isVoted,
    upvoteid: upvoteId,
  });

  const handleUpvote = async () => {
    const response = await api.post<UpvoteResponse>({
      url: "/upvote_article",
      data: { articleid: id },
    });
    if (
      response?.data.message === "User has already upvoted" ||
      response?.data.message === "Error adding upvote" ||
      response?.status !== 200 ||
      !response.data.upvotes ||
      !response.data.upvoteid
    ) {
      alert(response?.data);
      return;
    }
    console.log(response?.data.upvoteid);
    setUpvoteState({
      count: response.data.upvotes,
      hasVoted: true,
      upvoteid: response?.data.upvoteid,
    });
  };

  const handleDeleteUpvote = async () => {
    const response = await fetchData<UpvoteResponse>({
      url: `/article_upvotes/${upvoteState.upvoteid}`,
      method: "delete",
    });
    if (
      response?.data.message === "Article upvote deleted!" &&
      response.data.upvotes !== undefined
    ) {
      setUpvoteState({
        count: response.data.upvotes,
        hasVoted: false,
        upvoteid: "",
      });
      return;
    }
    alert(response?.data);
  };

  useEffect(() => {
    setUpvoteState({
      count: initialCount,
      hasVoted: isVoted,
      upvoteid: upvoteId,
    });
  }, [isVoted, upvoteId, initialCount]);

  return {
    ...upvoteState,
    handleClick: () => {
      if (upvoteState.hasVoted) return handleDeleteUpvote();
      handleUpvote();
    },
  };
};
