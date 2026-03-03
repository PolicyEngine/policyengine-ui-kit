import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from '../../src/inputs/NumberInput';
import { CurrencyInput } from '../../src/inputs/CurrencyInput';
import { SelectInput } from '../../src/inputs/SelectInput';
import { CheckboxInput } from '../../src/inputs/CheckboxInput';
import { SliderInput } from '../../src/inputs/SliderInput';
import { InputGroup } from '../../src/inputs/InputGroup';

describe('NumberInput', () => {
  it('renders label and value', () => {
    render(<NumberInput label="Age" value={30} onChange={() => {}} />);
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('calls onChange with number', () => {
    const onChange = vi.fn();
    render(<NumberInput value={10} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '25' } });
    expect(onChange).toHaveBeenCalledWith(25);
  });
});

describe('CurrencyInput', () => {
  it('renders with $ prefix and formatted value', () => {
    render(<CurrencyInput label="Income" value={50000} onChange={() => {}} />);
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50,000')).toBeInTheDocument();
  });
});

describe('SelectInput', () => {
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
  ];

  it('renders options', () => {
    render(<SelectInput label="Pick" options={options} value="a" onChange={() => {}} />);
    expect(screen.getByText('Pick')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('calls onChange with selected value', () => {
    const onChange = vi.fn();
    render(<SelectInput options={options} value="a" onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalledWith('b');
  });
});

describe('CheckboxInput', () => {
  it('renders label', () => {
    render(<CheckboxInput label="Agree" checked={false} onChange={() => {}} />);
    expect(screen.getByText('Agree')).toBeInTheDocument();
  });

  it('calls onChange on toggle', () => {
    const onChange = vi.fn();
    render(<CheckboxInput label="Agree" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('SliderInput', () => {
  it('renders label and value', () => {
    render(<SliderInput label="Rate" value={50} min={0} max={100} onChange={() => {}} />);
    expect(screen.getByText('Rate')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});

describe('InputGroup', () => {
  it('renders section label and children', () => {
    render(
      <InputGroup label="Household">
        <div>Field 1</div>
      </InputGroup>,
    );
    expect(screen.getByText('Household')).toBeInTheDocument();
    expect(screen.getByText('Field 1')).toBeInTheDocument();
  });
});
