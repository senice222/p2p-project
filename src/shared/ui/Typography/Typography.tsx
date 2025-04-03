import { JSX, ReactNode } from 'react';
import styled from 'styled-components';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'subtitle1'
  | 'subtitle2';

export interface TypographyProps {
  variant?: TypographyVariant;
  color?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  fontFamily?: string;
  lineHeight?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  margin?: string;
  padding?: string;
  children: ReactNode;
  className?: string;
}

const StyledTypography = styled.div<Omit<TypographyProps, 'children'>>`
  color: ${({ color }) => color || 'inherit'};
  font-size: ${({ fontSize }) => typeof fontSize === 'number' ? `${fontSize}px` : fontSize || 'inherit'};
  font-weight: ${({ fontWeight }) => fontWeight || 'inherit'};
  font-family: ${({ fontFamily }) => fontFamily || 'inherit'};
  line-height: ${({ lineHeight }) => lineHeight || 'inherit'};
  text-align: ${({ textAlign }) => textAlign || 'inherit'};
  margin: ${({ margin }) => margin || '0'};
  padding: ${({ padding }) => padding || '0'};
`;

const variantMapping: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  subtitle1: 'h6',
  subtitle2: 'h6',
};

const defaultStyles: Partial<Record<TypographyVariant, Partial<TypographyProps>>> = {
  h1: { fontSize: '2.5rem', fontWeight: 700 },
  h2: { fontSize: '2rem', fontWeight: 700 },
  h3: { fontSize: '1.75rem', fontWeight: 600 },
  h4: { fontSize: '1.5rem', fontWeight: 600 },
  h5: { fontSize: '1.25rem', fontWeight: 500 },
  h6: { fontSize: '1rem', fontWeight: 500 },
  body1: { fontSize: '1rem' },
  body2: { fontSize: '0.875rem' },
  caption: { fontSize: '0.75rem' },
  subtitle1: { fontSize: '1rem', fontWeight: 500 },
  subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
};

export const Typography = ({
  variant = 'body1',
  children,
  ...props
}: TypographyProps) => {
  const Component = variantMapping[variant];
  const variantStyle = defaultStyles[variant] || {};

  return (
    <StyledTypography
      as={Component}
      {...variantStyle}
      {...props}
    >
      {children}
    </StyledTypography>
  );
};