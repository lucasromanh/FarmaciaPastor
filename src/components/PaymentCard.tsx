import React, { useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage, storageKeys } from '../lib/storage';

export const PaymentCard: React.FC = () => {
    const [status, setStatus] = useState<'upcoming' | 'due' | 'overdue' | 'paid_waiting_next'>('upcoming');
    const [targetDate, setTargetDate] = useState<Date>(new Date());
    const [daysDiff, setDaysDiff] = useState<number>(0);

    // Logic: Payment day is always the 12th
    const paymentDay = 12;

    const calculateState = () => {
        const today = new Date();
        let stored = loadFromStorage(storageKeys.KEY_PAYMENTS, {});

        // REQ: "El primero (12 de enero) ya se hizo". 
        // Force initialize Jan 2026 as paid if not present.
        if (stored['2026-1'] === undefined) {
            stored['2026-1'] = true;
            saveToStorage(storageKeys.KEY_PAYMENTS, stored);
        }

        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth(); // 0 = Jan
        const currentMonthKey = `${currentYear}-${currentMonth + 1}`;
        const currentPaymentDate = new Date(currentYear, currentMonth, paymentDay);

        // Check if current month is paid
        if (stored[currentMonthKey]) {
            // Current month paid. Target is next month.
            setStatus('paid_waiting_next');
            
            // Handle December case for next year
            const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            
            const nextPaymentDate = new Date(nextYear, nextMonth, paymentDay);
            setTargetDate(nextPaymentDate);
            
            const diffTime = nextPaymentDate.getTime() - today.getTime();
            setDaysDiff(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        } else {
            // Current month NOT paid.
            setTargetDate(currentPaymentDate);
            const diffTime = currentPaymentDate.getTime() - today.getTime();
            setDaysDiff(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

            if (today.getDate() === paymentDay) {
                setStatus('due');
            } else if (today.getDate() > paymentDay) {
                setStatus('overdue');
            } else {
                setStatus('upcoming');
            }
        }
    };

    useEffect(() => {
        calculateState();
    }, []);

    const handleMarkPaid = () => {
        // Mark the displayed target date as paid
        const keyToPay = `${targetDate.getFullYear()}-${targetDate.getMonth() + 1}`;
        
        const stored = loadFromStorage(storageKeys.KEY_PAYMENTS, {});
        stored[keyToPay] = true;
        saveToStorage(storageKeys.KEY_PAYMENTS, stored);
        
        // Recalculate UI state
        calculateState();
    };

    const getStyles = () => {
        switch(status) {
            case 'due': return 'bg-accent text-white border-accent';
            case 'overdue': return 'bg-red-500 text-white border-red-600';
            case 'paid_waiting_next': return 'bg-green-600 text-white border-green-700 shadow-md'; // Green for "Up to date"
            default: return 'bg-surface border-secondary text-text';
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    };

    return (
        <div className={`p-4 rounded-xl border shadow-md mb-6 transition-all duration-300 ${getStyles()}`}>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        💳 Pago a CM
                        {status === 'due' && <span className="text-xs bg-white text-accent px-2 py-0.5 rounded-full animate-pulse">HOY</span>}
                        {status === 'overdue' && <span className="text-xs bg-white text-red-500 px-2 py-0.5 rounded-full font-bold">ATRASADO</span>}
                        {status === 'paid_waiting_next' && <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">AL DÍA</span>}
                    </h3>
                    <p className="text-sm opacity-90 font-medium">
                        {status === 'overdue' 
                            ? `Venció el ${formatDate(targetDate)} (hace ${Math.abs(daysDiff)} días)`
                            : `Próximo vencimiento: ${formatDate(targetDate)}`}
                    </p>
                    {status === 'paid_waiting_next' && (
                        <p className="text-xs text-white/70 mt-1">El pago de este mes ya fue registrado. ✓</p>
                    )}
                </div>
                {status !== 'paid_waiting_next' && (
                    <button 
                        onClick={handleMarkPaid}
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/50 px-3 py-1 rounded-lg text-sm transition font-medium"
                    >
                        Marcar Pagado
                    </button>
                )}
            </div>
        </div>
    );
};