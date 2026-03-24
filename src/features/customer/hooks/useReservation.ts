import { useState, useMemo, useCallback } from 'react';
import { Table, OrderItem, CreateReservationRequest } from '../types';
import { format, addHours, parse } from 'date-fns';

export type ReservationStep = 'SELECT_TIME' | 'SELECT_TABLE' | 'SELECT_MENU' | 'REVIEW';

export const useReservation = (initialLargeGroup: boolean = false) => {
    // --- States ---
    const [step, setStep] = useState<ReservationStep>('SELECT_TIME');
    const [isLargeGroup, setIsLargeGroup] = useState(initialLargeGroup);
    const [selectedTables, setSelectedTables] = useState<Table[]>([]);
    const [cart, setCart] = useState<OrderItem[]>([]);

    const [bookingDate, setBookingDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [bookingTime, setBookingTime] = useState<string>(''); // VD: "18:00"
    const [partySize, setPartySize] = useState<number>(initialLargeGroup ? 11 : 2);

    // --- Calculated Values (Memoized) ---
    const preOrderTotal = useMemo(() =>
        cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        , [cart]);

    const depositAmount = useMemo(() => {
        // Tiền cọc = (Tiền món + (Số bàn * 300k)) * 10%
        const tableFee = selectedTables.length * 300000;
        return Math.round((preOrderTotal + tableFee) * 0.1);
    }, [preOrderTotal, selectedTables.length]);

    // --- Actions ---
    const toggleTable = useCallback((table: Table) => {
        setSelectedTables(prev => {
            const isSelected = prev.find(t => t.id === table.id);
            if (isSelected) {
                return prev.filter(t => t.id !== table.id);
            }
            return [...prev, table];
        });
    }, []);

    const nextStep = () => {
        const flow: ReservationStep[] = ['SELECT_TIME', 'SELECT_TABLE', 'SELECT_MENU', 'REVIEW'];
        const currentIndex = flow.indexOf(step);
        if (currentIndex < flow.length - 1) setStep(flow[currentIndex + 1]);
    };

    const prevStep = () => {
        const flow: ReservationStep[] = ['SELECT_TIME', 'SELECT_TABLE', 'SELECT_MENU', 'REVIEW'];
        const currentIndex = flow.indexOf(step);
        if (currentIndex > 0) setStep(flow[currentIndex - 1]);
    };

    /**
     * Chuẩn bị dữ liệu gửi lên Server
     * Kết hợp ngày đã chọn và giờ đã chọn thành ISO String
     */
    const prepareRequest = (customerData: any): CreateReservationRequest => {
        // Parse "2026-03-23" và "18:00" thành Object Date
        const combinedDateTime = parse(
            `${bookingDate} ${bookingTime}`,
            'yyyy-MM-dd HH:mm',
            new Date()
        );

        return {
            customerName: customerData.customerName,
            customerPhone: customerData.customerPhone,
            customerEmail: customerData.customerEmail,
            note: customerData.note,
            partySize: partySize,
            reservationTime: format(combinedDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
            startTime: format(combinedDateTime, "HH:mm:ss"),
            endTime: format(addHours(combinedDateTime, 2), "HH:mm:ss"),
            requestedTableIds: selectedTables.map(t => t.id),
            preOrderItems: cart.map(item => ({
                itemId: item.id,
                quantity: item.quantity,
                note: item.notes || ""
            }))
        };
    };

    return {
        // State
        step, setStep,
        isLargeGroup, setIsLargeGroup,
        selectedTables, setSelectedTables, toggleTable,
        cart, setCart,
        bookingDate, setBookingDate,
        bookingTime, setBookingTime,
        partySize, setPartySize,

        // Calculated
        depositAmount,
        preOrderTotal,

        // Methods
        nextStep,
        prevStep,
        prepareRequest
    };
};