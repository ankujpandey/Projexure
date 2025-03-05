import { useAppSelector } from '@/app/redux';
import Modal from '@/components/Modal';
import Image from 'next/image';
import { Comment,Task, useAddCommentMutation } from '@/state/api';
import {TextareaAutosize} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { User } from 'lucide-react';
import LetterAvatar from '../LetterAvatar';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onCommentAdded: (comment: Comment) => void;
}

const ModalComments = ({ isOpen, onClose, task, onCommentAdded }: Props) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const [commentText, setCommentText] = useState('');
    const [addComment] = useAddCommentMutation();
    const userId = 1;

    useEffect(() => {
      console.log("Updated comments:", task?.comments);
    }, [task?.comments]);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!task) return;
  
      try {
        const newComment = await addComment({ taskId: task.id, userId: userId, text: commentText }).unwrap();
        onCommentAdded(newComment);
        setCommentText('');
        // Optionally, trigger a refetch of the task/comments or update local state
      } catch (err) {
        console.error("Failed to add comment:", err);
      }
    };

    const formattedStartDate = task?.startDate ? format(new Date(task.startDate), "P") : ""
    const formattedDueDate = task?.dueDate ? format(new Date(task.dueDate), "P") : ""
  
    const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:foucus:outline-none"

    if (!isOpen || !task) return null;

    return (
      <Modal isOpen={isOpen} onClose={onClose} name={`${task.title}`}>
          <div className="text-xs text-gray-500 dark:text-neutral-500">
            {formattedStartDate && <span>{formattedStartDate} - </span>}
            {formattedDueDate && <span>{formattedDueDate}</span>}
          </div>
        <div className="space-y-4">
          <p className="mb-4 text-gray-600 dark:text-neutral-400">{task.description}</p>
          <h3 className="font-semibold dark:text-neutral-200">Comments</h3>
          <div className="space-y-4">
            {task?.comments &&
              (task.comments as Comment[]).map((comment: Comment) => {
                return (
                  <div key={comment.id} className="flex space-x-2">
                    <div className="h-10 w-10">
                      {comment.id && comment.profilePictureUrl ? (
                        <Image
                          key={comment.id}
                          src={`/${comment.profilePictureUrl!}`}
                          alt={comment.username}
                          width={30}
                          height={30}
                          className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                        />
                      ) : (
                          // {/* <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-200 dark:border-dark-secondary">
                          //   <User className="h-6 w-6 text-gray-500" />
                          // </div> */}
                        <LetterAvatar name={`${comment?.username}`} size={35} />
                      )}
                    </div>
                    <div className="flex-1 mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium dark:text-neutral-300">
                          {comment?.username}
                        </span>
                        <span className="text-muted-foreground text-xs dark:text-gray-500">
                        {formatDistanceToNow(new Date(comment.created), {
                          addSuffix: true,
                        })}
                      </span>
                      </div>
                      <p className="text-sm dark:text-neutral-400">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="space-y-2">
            <TextareaAutosize
              placeholder="Add a comment..."
              value={commentText}
              // sx={textFieldSxStyle(isDarkMode)}
              onChange={(e) => setCommentText(e.target.value)}
              className={inputStyles}
            />
            <button
              onClick={handleSubmit}
              className="w-full rounded bg-blue-500 py-2 text-white"
            >
              Add Comment
            </button>
          </div>
        </div>
      </Modal>
    );
};

export default ModalComments