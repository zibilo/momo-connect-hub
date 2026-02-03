"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VerificationCodeInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
  error?: string;
}

export function VerificationCodeInput({ 
  length = 8, 
  onComplete, 
  disabled = false,
  error 
}: VerificationCodeInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    const newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (newValue.length > 1) {
      const chars = newValue.slice(0, length - index).split('');
      const newValues = [...values];
      chars.forEach((char, i) => {
        if (index + i < length) {
          newValues[index + i] = char;
        }
      });
      setValues(newValues);
      
      const nextIndex = Math.min(index + chars.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      
      if (newValues.every(v => v !== '')) {
        onComplete(newValues.join(''));
      }
      return;
    }

    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValues.every(v => v !== '')) {
      onComplete(newValues.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const chars = pastedData.slice(0, length).split('');
    const newValues = Array(length).fill('');
    chars.forEach((char, i) => {
      newValues[i] = char;
    });
    setValues(newValues);
    
    if (chars.length === length) {
      onComplete(newValues.join(''));
    } else {
      inputRefs.current[chars.length]?.focus();
    }
  };

  const handleClear = () => {
    setValues(Array(length).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="space-y-3">
      <Label>Code de vérification</Label>
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {values.map((value, index) => (
          <React.Fragment key={index}>
            <Input
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={disabled}
              className={cn(
                "w-10 h-12 text-center font-mono text-lg font-bold p-0",
                error && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {index === 3 && (
              <span className="flex items-center text-muted-foreground">-</span>
            )}
          </React.Fragment>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
      <div className="flex justify-center">
        <Button variant="ghost" size="sm" onClick={handleClear} disabled={disabled}>
          Effacer
        </Button>
      </div>
    </div>
  );
}

export default VerificationCodeInput;
