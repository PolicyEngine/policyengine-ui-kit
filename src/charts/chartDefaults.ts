import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { chartColors } from '../tokens/charts';

export const AXIS_STYLE = {
  fontFamily: typography.fontFamily.primary,
  fontSize: 12,
  fill: colors.text.secondary,
};

export const GRID_STYLE = {
  stroke: colors.border.light,
  strokeDasharray: '3 3',
};

export const TOOLTIP_STYLE = {
  contentStyle: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 13,
    backgroundColor: colors.white,
    border: `1px solid ${colors.border.light}`,
    borderRadius: '8px',
    boxShadow: `0 4px 12px ${colors.shadow.medium}`,
    padding: '8px 12px',
  },
  labelStyle: {
    fontWeight: 600,
    marginBottom: 4,
    color: colors.text.primary,
  },
  itemStyle: {
    color: colors.text.secondary,
    padding: '2px 0',
  },
};

export const LEGEND_STYLE = {
  wrapperStyle: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 13,
    color: colors.text.secondary,
    paddingTop: 8,
  },
};

export { chartColors };
