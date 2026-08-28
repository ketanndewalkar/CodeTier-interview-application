import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchInterviewDetails,
  fetchInterviewRoom,
} from "../functions/interview.functions";
import { useRoomStore } from "../../store/room.store";

const useInterviewDetails = () => {
  const { interviewId } = useParams();
  const setRoomId = useRoomStore((state) => state.setRoomId);
  const resetRoom = useRoomStore((state) => state.resetRoom);
  const [interviewInfo, setInterviewInfo] = useState({
    interviewId: "",
    candidateId: "",
    interviewerInfo: {
      interviewId: "",
      interviewName: "",
    },
  });
  const { data, isPending, isLoading, error } = useQuery({
    queryFn: (interviewId) => fetchInterviewDetails(interviewId),
    queryKey: ["interview-detail", interviewId],
    staleTime: 0,
    gcTime: 0,
  });

  const {
    mutate,
    isPending: roomPending,
    isLoading: roomLoading,
    reset
  } = useMutation({
    mutationFn: (interviewId) => fetchInterviewRoom(interviewId),
    onSuccess: (res) => {
      setRoomId(res.roomId);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Reset the mutation state and cached room state every time this page/component loads
  useEffect(() => {
    resetRoom();
    reset();
  }, [resetRoom, reset, interviewId]);
  return {
    data,
    isPending,
    isLoading,
    error,
    mutate,
    roomPending,
    roomLoading,
  };
};

export default useInterviewDetails;
