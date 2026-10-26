import styled from 'styled-components';
import type { FC, ReactNode } from 'react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

type FormRowProps = {
  id: string;
  label?: string;
  children: ReactNode;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl>;
  useMessage?: boolean;
  swidth?: string | null;
  className?: string;
};

const StyledStackedFormRow = styled.div`
  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

//  &:not(:last-child) {
//     /* border-bottom: 1px solid var(--color-grey-100); */
//     margin-bottom: 10px;
//   }

const Label = styled.label`
  align-self: center;
  font-weight: 500;
`;

const Error = styled.div`
  font-size: 1.2rem;
  font-weight: medium;
  color: var(--color-red-600);
`;

const StackedFormRow: FC<FormRowProps> = ({
  id,
  label,
  error,
  children,
  useMessage,
  className,
}: FormRowProps) => {
  return (
    <StyledStackedFormRow className={className}>
      {label && (
        <div>
          <Label
            htmlFor={id}
            style={{
              textWrap: 'wrap',
              overflowWrap: 'break-word',
            }}
            className='text-gray-600 dark:text-neutral-200 text-lg '
          >
            {label}
          </Label>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <div className='flex-1'>{children}</div>
        <div className="flex-0 pl-1 mr-2">
          {error && useMessage && <Error>{error.toString()}</Error>}
          {error && !useMessage && (
            <Error>
              <span className='text-red-600 font-semibold'>!</span>
            </Error>
          )}
        </div>
      </div>
    </StyledStackedFormRow>
  );
};

export default StackedFormRow;
