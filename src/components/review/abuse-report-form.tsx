import type { CreateAbuseReportInput } from '@/types';
import { ReportIcon } from '@/components/icons/report-icon';
import { useMutation } from 'react-query';
import client from '@/data/client';
import * as yup from 'yup';
import { Form } from '@/components/ui/forms/form';
import TextArea from '@/components/ui/forms/textarea';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import toast from 'react-hot-toast';

const abuseValidationSchema = yup.object().shape({
  message: yup.string().required('You must need to provide a message'),
});

export default function AbuseReportForm() {
  const { data } = useModalState();
  const { closeModal } = useModalAction();

  const { mutate: createAbuseReport, isLoading } = useMutation(
    client.abuse.create,
    {
      onSuccess: () => {
        toast.success('Abuse Report Submitted');
      },
      onError: (error) => {
        // TODO: replace it after implement translation
        const {
          response: { data },
        }: any = error ?? {};

        if (
          data?.message?.includes(
            'YOU_HAVE_ALREADY_GIVEN_ABUSIVE_REPORT_FOR_THIS'
          )
        ) {
          toast.error("You've already given report");
        } else {
          toast.error(data?.message);
        }
      },
      onSettled: () => {
        closeModal();
      },
    }
  );

  function onSubmit(values: Pick<CreateAbuseReportInput, 'message'>) {
    createAbuseReport({
      model_id: data.reviewId,
      model_type: 'Review',
      ...values,
    });
  }

  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light p-6 text-left dark:bg-dark-250 xs:h-auto xs:min-h-0 xs:max-w-[400px] md:max-w-[590px] md:rounded-md md:p-7 lg:max-w-[650px]">
      <div className="flex flex-col items-center justify-center pt-3 pb-7 md:pt-5 md:pb-9">
        <ReportIcon className="h-14 w-14 md:h-[60px] md:w-[60px]" />
        <h2 className="mt-4 text-15px font-medium tracking-[-0.3px] text-dark dark:text-light">
          Report this comment
        </h2>
      </div>

      <Form<Pick<CreateAbuseReportInput, 'message'>>
        onSubmit={onSubmit}
        validationSchema={abuseValidationSchema}
        useFormProps={{
          defaultValues: {
            message: '',
          },
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <TextArea
              label="Write your reason"
              {...register('message')}
              error={errors?.message?.message}
            />
            <Button
              className="text-sm"
              disabled={isLoading}
              isLoading={isLoading}
            >
              Make Report
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
