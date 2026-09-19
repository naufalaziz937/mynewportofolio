import type { ChangeEventHandler, ReactNode } from 'react';
interface FormFieldProps { label: string; children: ReactNode; hint?: string }
export function FormField({ label, children, hint }: FormFieldProps) { return <label className="manage-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>; }
interface TextFieldProps { label: string; value: string; onChange: ChangeEventHandler<HTMLInputElement>; placeholder?: string; required?: boolean; type?: string }
export function TextField({ label, value, onChange, placeholder, required, type = 'text' }: TextFieldProps) { return <FormField label={label}><input value={value} onChange={onChange} placeholder={placeholder} required={required} type={type} /></FormField>; }
