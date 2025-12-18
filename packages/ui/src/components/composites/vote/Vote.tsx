"use client";

import type { ThumbUpAnimatedRef } from "@refugies-info/ui";
import type React from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import VoteLayoutStandard from "./VoteLayoutStandard";
import VoteLayoutSticky from "./VoteLayoutSticky";

type AnnounceOptions = {
  priority?: "interrupt" | "normal";
  delay?: number;
};

type VoteProps = {
  className?: string;
  currentVote?: boolean | null;
  isSticky?: boolean;
  onVoteYes?: () => void;
  onVoteNo?: () => void;
  onCancelYes?: () => void;
  onCancelNo?: () => void;
  onVoteUpdate?: (vote: boolean) => void;
  onVoteAnnounce?: (message: string, options?: AnnounceOptions) => void;
  error?: boolean | null;
};

type VoteRef = {
  thumbUpRef: React.RefObject<ThumbUpAnimatedRef | null>;
};

export const Vote = forwardRef<VoteRef, VoteProps>(
  (
    {
      className,
      currentVote = null,
      onVoteYes,
      onVoteNo,
      onCancelYes,
      onCancelNo,
      onVoteUpdate,
      onVoteAnnounce,
      isSticky = false,
      error = false,
    },
    ref,
  ) => {
    const [hasVoted, setHasVoted] = useState(false);
    const [vote, setVote] = useState<boolean | null>(currentVote);

    const thumbUpRef = useRef<ThumbUpAnimatedRef>(null);

    useEffect(() => {
      setVote(currentVote);

      if (currentVote === true) {
        const timer = setTimeout(() => {
          if (thumbUpRef.current) {
            thumbUpRef.current.goToLastFrame();
          }
        }, 1200);

        return () => clearTimeout(timer);
      }

      return () => {};
    }, [currentVote]);

    useEffect(() => {
      const checkAnimation = setInterval(() => {
        if (thumbUpRef.current) {
          clearInterval(checkAnimation);

          if (currentVote === true) {
            thumbUpRef.current.goToLastFrame();
          }
        }
      }, 100);

      return () => clearInterval(checkAnimation);
    }, []);

    useEffect(() => {
      if (error) {
        setHasVoted(false);
      }
    }, [error]);

    useImperativeHandle(ref, () => ({ thumbUpRef }), [thumbUpRef]);

    const handleClickYes = () => {
      if (vote === true) {
        setHasVoted(false);
        setVote(null);
        if (onCancelYes) {
          onCancelYes();
        }
        return;
      }

      setVote(true);

      if (hasVoted && onVoteUpdate) {
        onVoteUpdate(true);
        return;
      }
      if (onVoteYes) {
        onVoteYes();
      }

      setHasVoted(false);
      if (thumbUpRef.current) {
        thumbUpRef.current.stop();
        thumbUpRef.current.setFrame(0);
        thumbUpRef.current.play();
      }
      setHasVoted(true);
    };

    const handleClickNo = () => {
      if (vote === false) {
        setHasVoted(false);
        setVote(null);
        if (onCancelNo) {
          onCancelNo();
        }
        return;
      }

      setHasVoted(false);
      setVote(false);
      setHasVoted(true);

      if (onVoteNo) {
        onVoteNo();
      }
    };

    return isSticky ? (
      <VoteLayoutSticky
        className={className}
        vote={vote}
        handleClickYes={handleClickYes}
        handleClickNo={handleClickNo}
        thumbUpRef={thumbUpRef}
        hasVoted={!error && hasVoted}
        onVoteAnnounce={onVoteAnnounce}
      />
    ) : (
      <VoteLayoutStandard
        className={className}
        vote={vote}
        handleClickYes={handleClickYes}
        handleClickNo={handleClickNo}
        hasVoted={!error && hasVoted}
        thumbUpRef={thumbUpRef}
        onVoteAnnounce={onVoteAnnounce}
      />
    );
  },
);

Vote.displayName = "Vote";
