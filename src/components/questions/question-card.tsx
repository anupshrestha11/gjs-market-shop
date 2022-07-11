import dayjs from 'dayjs';
import cn from 'classnames';
import { useModalAction } from '@/components/modal-views/context';
import { useMe } from '@/data/user';
import { LikeIcon } from '@/components/icons/like-icon';
import { DislikeIcon } from '@/components/icons/dislike-icon';
import type { Question } from '@/types';
import { useCreateFeedback } from '@/data/product';

type QuestionCardProps = {
  className?: any;
  question: Question;
};

export default function QuestionCard({ question }: QuestionCardProps) {
  const { openModal } = useModalAction();
  const { isAuthorized } = useMe();
  const { createFeedback } = useCreateFeedback();

  const {
    id,
    answer,
    created_at,
    my_feedback,
    negative_feedbacks_count,
    positive_feedbacks_count,
    question: userQuestion,
  } = question;

  function feedback(value: { positive: boolean } | { negative: boolean }) {
    if (!isAuthorized) {
      openModal('LOGIN_VIEW');
      return;
    }
    createFeedback({
      model_id: id,
      model_type: 'Question',
      ...value,
    });
  }

  return (
    <div className="border-t border-light-500 py-5 first:border-t-0 dark:border-dark-400">
      <p className="mb-1.5 text-13px font-medium text-dark dark:text-light">
        <span className="mr-1 inline-block uppercase">Q:</span>
        {userQuestion}
      </p>
      {answer && (
        <p className="text-13px leading-[1.85em] text-dark-600 dark:text-light-600">
          <span className="mr-1 inline-block font-medium uppercase">A:</span>
          {answer}
        </p>
      )}

      <div className="mt-5 flex list-disc items-center space-x-3 text-13px marker:text-sky-400 sm:space-x-4">
        <div className="flex items-center text-dark-800 after:ml-3 after:inline-block after:h-1 after:w-1 after:rounded-full after:bg-dark-900 dark:text-light-900 after:dark:bg-light-900 sm:after:ml-4">
          <span className="hidden sm:block">
            {dayjs(created_at).format('MMMM D, YYYY')}
          </span>
          <span className="sm:hidden">
            {dayjs(created_at).format('MMM D, YYYY')}
          </span>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            className={cn(
              'flex items-center tracking-wider text-dark-800 transition dark:text-dark-900',
              {
                'dark:!text-light': my_feedback?.positive,
              }
            )}
            disabled={my_feedback?.positive}
            onClick={() => feedback({ positive: true })}
          >
            <LikeIcon
              className={cn('mr-2 h-3.5 w-3.5', {
                'text-brand': my_feedback?.positive,
              })}
            />
            {positive_feedbacks_count}
          </button>
          <button
            className={cn(
              'flex items-center tracking-wider text-dark-800 transition dark:text-dark-900',
              {
                'dark:!text-light': my_feedback?.negative,
              }
            )}
            onClick={() => feedback({ negative: true })}
            disabled={my_feedback?.negative}
          >
            <DislikeIcon
              className={cn('mr-2 mt-0.5 h-3.5 w-3.5', {
                'text-brand': my_feedback?.negative,
              })}
            />
            {negative_feedbacks_count}
          </button>
        </div>
      </div>
    </div>
  );
}
