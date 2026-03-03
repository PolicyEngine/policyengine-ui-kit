import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  format?: (value: unknown, row: T) => string | React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T = Record<string, unknown>>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: DataTableColumn<T>[];
  data: T[];
  styles?: {
    root?: React.CSSProperties;
    table?: React.CSSProperties;
    header?: React.CSSProperties;
    row?: React.CSSProperties;
    cell?: React.CSSProperties;
  };
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  className,
  styles,
  ...props
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'tw:bg-white tw:border tw:border-border-light tw:rounded-container tw:overflow-hidden',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      <table className="tw:w-full" style={styles?.table}>
        <thead>
          <tr className="tw:border-b tw:border-border-light tw:bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'tw:px-4 tw:py-3 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-text-secondary',
                  col.align === 'right' && 'tw:text-right',
                  col.align === 'center' && 'tw:text-center',
                )}
                style={styles?.header}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="tw:border-b tw:border-border-light last:tw:border-b-0 tw:hover:bg-gray-50"
              style={styles?.row}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'tw:px-4 tw:py-3 tw:text-sm tw:text-text-primary',
                    col.align === 'right' && 'tw:text-right',
                    col.align === 'center' && 'tw:text-center',
                  )}
                  style={styles?.cell}
                >
                  {col.format
                    ? col.format(row[col.key], row)
                    : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
