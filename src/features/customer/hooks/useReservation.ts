import { useState } from 'react';
import { Table, OrderItem } from '../types';

export type ReservationStep = 'WELCOME' | 'CHOOSE_OPTION' | 'SELECT_TABLE' | 'SELECT_MENU' | 'FILL_FORM' | 'SUCCESS';

export const useReservation = () => {
    const [step, setStep] = useState<ReservationStep>('WELCOME');
    const [isLargeGroup, setIsLargeGroup] = useState(false);
    const [selectedTables, setSelectedTables] = useState<Table[]>([]); // Đổi thành mảng để gộp bàn
    const [cart, setCart] = useState<OrderItem[]>([]);

    // Tính toán tiền cọc tạm tính: (Tiền món + (Số bàn * 300k)) * 10%
    const calculateDeposit = () => {
        const preOrderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tableFee = selectedTables.length * 300000;
        return Math.round((preOrderTotal + tableFee) * 0.1);
    };

    const nextStep = (next: ReservationStep) => setStep(next);

    const resetReservation = () => {
        setStep('WELCOME');
        setSelectedTables([]);
        setCart([]);
    };

    return {
        step, setStep,
        isLargeGroup, setIsLargeGroup,
        selectedTables, setSelectedTables,
        cart, setCart,
        nextStep, resetReservation,
        depositAmount: calculateDeposit(),
        preOrderTotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
};