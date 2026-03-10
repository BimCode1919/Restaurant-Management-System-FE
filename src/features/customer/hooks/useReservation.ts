import { useState } from 'react';
import { Table, OrderItem } from '../types';

export type ReservationStep = 'WELCOME' | 'CHOOSE_OPTION' | 'SELECT_TABLE' | 'SELECT_MENU' | 'FILL_FORM' | 'SUCCESS';

export const useReservation = () => {
    const [step, setStep] = useState<ReservationStep>('WELCOME');
    const [isLargeGroup, setIsLargeGroup] = useState(false); // Option 1 (<5) hay Option 2 (>5)
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [cart, setCart] = useState<OrderItem[]>([]);

    const nextStep = (next: ReservationStep) => setStep(next);

    const resetReservation = () => {
        setStep('WELCOME');
        setSelectedTable(null);
        setCart([]);
    };

    return {
        step, setStep,
        isLargeGroup, setIsLargeGroup,
        selectedTable, setSelectedTable,
        cart, setCart,
        nextStep, resetReservation
    };
};