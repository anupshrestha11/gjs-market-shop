import * as yup from 'yup';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import { Form } from '@/components/ui/forms/form';
import Uploader from '@/components/ui/forms/uploader';
import RateInput from '@/components/ui/forms/rate-input';
import TextArea from '@/components/ui/forms/textarea';
import { Controller } from 'react-hook-form';
import { CreateReviewInput } from '@/types';
import { useMutation, useQueryClient } from 'react-query';
import client from '@/data/client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import isEmpty from 'lodash/isEmpty';
import { API_ENDPOINTS } from '@/data/client/endpoints';

const reviewFormSchema = yup.object().shape({
  rating: yup
    .number()
    .min(1, 'You must need to provide a rating')
    .required('You must need to provide a rating'),
  comment: yup.string().required('You must need to provide a comment'),
  photos: yup.array(),
});

export default function ReviewForm() {
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState(null);
  const { mutate: createReview, isLoading: creating } = useMutation(
    client.reviews.create,
    {
      onSuccess: () => {
        toast.success('Review Submitted');
        closeModal();
      },
      onError: (error: any) => {
        setServerError(error?.response?.data);
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ORDERS_DOWNLOADS);
      },
    }
  );
  const { mutate: updateReview, isLoading: updating } = useMutation(
    client.reviews.update,
    {
      onSuccess: () => {
        toast.success('Review Updated');
        closeModal();
      },
      onError: (error: any) => {
        setServerError(error?.response?.data);
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ORDERS_DOWNLOADS);
      },
    }
  );

  const onSubmit = (
    values: Omit<CreateReviewInput, 'product_id' | 'shop_id' | 'order_id'>
  ) => {
    if (data?.my_review) {
      // @ts-ignore
      updateReview({
        ...values,
        photos: values?.photos?.map(({ __typename, ...rest }) => rest),
        id: data.my_review.id,
        order_id: data.order_id,
      });
      return;
    }
    // @ts-ignore
    createReview({
      ...values,
      product_id: data.product_id,
      shop_id: data.shop_id,
      order_id: data.order_id,
    });
  };

  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light text-left dark:bg-dark-250 xs:h-auto xs:min-h-0 xs:max-w-[400px] md:max-w-[590px] md:rounded-md lg:max-w-[650px]">
      <h3 className="mb-2 pl-6 pr-6 text-center text-base font-medium tracking-[-0.3px] text-dark dark:text-light xs:mb-0 xs:border-b xs:border-dark/10 xs:py-4 xs:pr-10 xs:text-left xs:dark:border-light/10 md:py-5 md:pl-7 lg:py-6 lg:pr-16">
        Make a review
      </h3>
      <div className="p-7">
        <Form<Omit<CreateReviewInput, 'product_id' | 'shop_id' | 'order_id'>>
          onSubmit={onSubmit}
          validationSchema={reviewFormSchema}
          serverError={serverError}
          useFormProps={{
            defaultValues: {
              rating: data?.my_review?.rating ?? 0,
              comment: data?.my_review?.comment ?? '',
              photos: data?.my_review?.photos ?? [],
            },
          }}
        >
          {({ register, control, formState: { errors }, getValues }) => (
            <>
              <div className="mb-5">
                <label className="block cursor-pointer pb-1 text-13px font-normal text-dark/70 dark:text-light/70">
                  What’s your rating
                </label>
                <div className="w-auto">
                  <RateInput
                    control={control}
                    name="rating"
                    defaultValue={0}
                    style={{ fontSize: 30 }}
                    allowClear={false}
                  />
                  {errors?.rating && (
                    <p className="my-2 text-xs text-red-500">
                      {errors?.rating?.message}
                    </p>
                  )}
                </div>
              </div>

              <TextArea
                label="Write a comment"
                {...register('comment')}
                className="mb-5"
                error={errors?.comment?.message}
              />

              <div className="mb-8">
                <Controller
                  name="photos"
                  control={control}
                  render={({ field: { ref, ...rest } }) => (
                    <div className="sm:col-span-2">
                      <span className="block cursor-pointer pb-2.5 text-13px font-normal text-dark/70 dark:text-light/70">
                        Attachment
                      </span>
                      <div className="text-xs">
                        <Uploader multiple={true} {...rest} />
                      </div>
                    </div>
                  )}
                />
              </div>

              <div className="mt-8">
                <Button
                  className="text-sm"
                  isLoading={creating || updating}
                  disabled={creating || updating}
                >
                  {isEmpty(data?.my_review) ? 'Submit Review' : 'Update Review'}
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}
