import styled from 'styled-components';

const Input = styled.input`
  /* border: 1px solid var(--color-grey-700); */
  background-color: transparent;
  border-radius: var(--border-radius-sm);
  min-width: 0;
  vertical-align: middle;
  width: ${(props) => (props.width ? props.width : '100%')};
  outline: none;
`;

export default Input;
