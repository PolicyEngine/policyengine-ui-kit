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
        'bg-white border border-pe-border-light rounded-pe-container overflow-hidden',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      <table className="w-full" style={styles?.table}>
        <thead>
          <tr className="border-b border-pe-border-light bg-pe-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-pe-text-secondary',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
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
              className="border-b border-pe-border-light last:border-b-0 hover:bg-pe-gray-50"
              style={styles?.row}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-sm text-pe-text-primary',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
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
