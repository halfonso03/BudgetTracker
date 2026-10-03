import styled from 'styled-components';
import type { FC, ReactNode } from 'react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { FileExclamationPoint } from 'lucide-react';

type FormRowProps = {
  id: string;
  label?: string;
  children: ReactNode;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl>;
  useMessage?: boolean;
  swidth?: string | null;
  className?: string;
};

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1.6fr 0.4fr;

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
  font-size: 1.5rem;
  color: var(--color-red-500);
`;

const FormRow: FC<FormRowProps> = ({
  id,
  label,
  error,
  children,
  useMessage,
  className,
}: FormRowProps) => {
  return (
    <StyledFormRow className={className}>
      {label && (
        <div className='self-start pr-2 text-neutral-600'>
          <Label
            htmlFor={id}
            style={{
              textWrap: 'wrap',
              overflowWrap: 'break-word',
            }}
          >
            {label}
          </Label>
        </div>
      )}
      <div>{children}</div>
      <div className="pl-2">
        {error && useMessage && <Error>{error.toString()}</Error>}
        {error && !useMessage && (
          <Error>
            <FileExclamationPoint></FileExclamationPoint>
          </Error>
        )}
      </div>
    </StyledFormRow>
  );
};

export default FormRow;
