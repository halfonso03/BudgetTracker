/* eslint-disable @typescript-eslint/no-explicit-any */
import styled, { css } from 'styled-components';
import { createContext, useContext, type FC, type ReactNode } from 'react';

interface CommonRowProps {
  $columns: string;
}

interface TableProps {
  columns: string;
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
}

interface TableHeaderProps {
  children: ReactNode;
}

interface TableBodyProps {
  data: any[];
  render: (data: any, index: number) => React.ReactNode;
}

interface CellProps {
  children: ReactNode;
  align?: string;
  textoverflow?: string;
}

interface FooterProps {
  children: ReactNode;
}

interface ITable extends FC<TableProps> {
  Row: FC<TableRowProps>;
  Header: FC<TableHeaderProps>;
  Body: FC<TableBodyProps>;
  Cell: any;
  Footer: any;
}

const CommonRow = styled.div<CommonRowProps>`
  display: grid;
  grid-template-columns: ${(props) => props.$columns};
  column-gap: 1.25rem;
  align-items: center;
  transition: none;
`;

const StyledTable = styled.div.attrs({ className: 'MY_TABLE min-h-screen' })`
  /* font-size: 0.8rem; */
  border-radius: 7px;
  overflow: hidden;
  padding-bottom: 100px;
`;

const StyledHeader = styled(CommonRow).attrs({
  className: 'text-gray-900 dark:text-gray-200 font-semibold',
})`
  transition: background-color 0.5s ease-in-out;
  padding: 0.5rem;
  /* text-transform: uppercase; */

  /* font-size: 1rem; */
`;

const StyledRow = styled(CommonRow).attrs({
  className: 'text-gray-900 dark:text-gray-200 user-row',
})`
  transition: background-color 0.2s ease-in-out;
  padding: 0.5rem;
  /* font-size: 0.9rem; */
`;

const StyledCell = styled.div<CellProps>`
  ${(props) =>
    props.align == 'center' &&
    css`
      text-align: :'center';
    `}
  ${(props) =>
    props.align == '' &&
    css`
      text-align: :'left';
    `}
  ${(props) =>
    props.textoverflow == 'ellipses' &&
    css`
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `}
`;

const StyledBody = styled.section`
  /* margin: 0.4rem 0; */
  /* :last-child {
    border-bottom: none;
  } */
`;

const StyledFooter = styled.footer`
  background-color: var(--color-grey-900);
  display: flex;
  justify-content: end;
  padding: 1.2rem;
  border-top: 1px solid var(--color-neutral-800);

  /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  margin: 2rem;
`;


type TableContextType = {
  columns: string;
};

const TableContext = createContext<TableContextType | null>(null);

const Table: ITable = ({ columns, children }: TableProps) => {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
};

const Header: FC<TableHeaderProps> = ({ children }) => {
  const { columns } = useContext<TableContextType>(TableContext as any);

  return (
    <StyledHeader role="row" $columns={columns} as="header" className='border-b border-b-gray-300 dark:border-b-mauve-700'>
      {children}
    </StyledHeader>
  );
};

const Body: FC<TableBodyProps> = ({ data, render }) => {
  if (!data.length) return <Empty className="text-neutral-800 dark:text-neutral-300">No data to show at the moment</Empty>;
  return <StyledBody>{data.map(render)}</StyledBody>;
};

const Row: FC<TableRowProps> = ({ children }) => {
  const { columns } = useContext<TableContextType>(TableContext as any);
  return (
    <StyledRow $columns={columns} role="row" className='border-b border-b-gray-300 dark:border-b-neutral-700'>
      {children}
    </StyledRow>
  );
};

const Cell: FC<CellProps> = ({ children, align, textoverflow }) => {
  return (
    <StyledCell align={align} textoverflow={textoverflow}>
      {children}
    </StyledCell>
  );
};

const Footer: FC<FooterProps> = ({ children }) => {
  return <StyledFooter role="row">{children}</StyledFooter>;
};

Table.Row = Row;
Table.Header = Header;
Table.Body = Body;
Table.Cell = Cell;
Table.Footer = Footer;

export default Table;
